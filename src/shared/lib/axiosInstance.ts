import axios from 'axios';

import type { LoginResponseDto } from '@/features/auth/types/dto';

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

// 요청 인터셉터: API 호출 시마다 자동으로 accessToken을 Authorization 헤더에 붙여줌
axiosInstance.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false; // 현재 토큰 갱신 중인지 여부
const failedQueue: FailedQueueItem[] = []; // 갱신 도중 들어온 요청들을 잠시 대기시킬 큐

// 응답 인터셉터 -> 응답에서 401 Unauthorized가 나오면 refreshToken으로 토큰 재발급 시도
async function refreshAccessTokenInternal() {
  // 토큰 갱신 시도 전에 refreshToken이 있는지 확인
  const refreshToken = getRefreshToken();

  // refreshToken이 없으면 갱신 자체가 불가능하므로 에러 처리
  if (!refreshToken) {
    throw new Error('NO_REFRESH_TOKEN');
  }

  // 실제 토큰 갱신 API 호출
  const response = await axios.post<LoginResponseDto>(`${BASE_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  });

  // 새로 받은 토큰 저장
  setTokens({
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  });

  return response.data.access_token;
}

// 401 에러 응답이 오면 토큰 갱신 시도
axiosInstance.interceptors.response.use(
  // 응답이 성공적이면 그대로 반환
  (response) => response,

  // 응답이 에러면 에러 처리
  async (error) => {
    // 401 에러인지 확인
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    const url = originalRequest.url ?? '';
    const isRefreshCall = url.includes('/auth/refresh');
    if (isRefreshCall) return Promise.reject(error);

    // refresh API 호출 자체는 무한 루프 방지 위해 건드리지 않음
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 비로그인 사용자의 401은 refresh 시도를 하지 않고 그대로 401 반환
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(error);
      }

      // 로그인 사용자의 401은 refresh 시도
      originalRequest._retry = true;

      // 이미 갱신 중이면 큐에 넣고 완료될 때까지 대기
      if (isRefreshing) {
        // 큐에 콜백 추가: 토큰이 갱신되면 이 콜백이 호출되어 원래 요청을 재실행
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers ?? {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      // 갱신 시작
      isRefreshing = true;

      // 실제 토큰 갱신
      try {
        // 새 accessToken으로 원래 요청 재시도
        const newAccessToken = await refreshAccessTokenInternal();

        // 큐에 대기중인 요청들 모두 새 토큰으로 재실행
        failedQueue.forEach((p) => p.resolve(newAccessToken));
        failedQueue.length = 0; // 큐 초기화

        // 원래 요청에도 새 토큰 적용
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (error) {
        failedQueue.forEach((p) => p.reject(error)); // 갱신 실패한 경우 큐에 대기중인 요청들도 모두 에러 처리
        failedQueue.length = 0; // 큐 초기화
        clearAuthAndRedirect(); // 갱신 실패 시 인증 정보 삭제 및 로그인 페이지로 리다이렉트
        return Promise.reject(error); // 갱신 실패 시 원래 에러 반환
      } finally {
        isRefreshing = false; // 갱신 상태 해제
      }
    }

    // 401 에러가 아니거나 이미 재시도한 요청이면 에러 그대로 반환
    return Promise.reject(error);
  },
);

function clearAuthAndRedirect() {
  clearTokens();
  window.location.assign('/login');
}

export default axiosInstance;
