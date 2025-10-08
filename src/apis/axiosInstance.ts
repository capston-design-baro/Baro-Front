import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  COOKIE_OPTIONS,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
} from '@/constants/auth';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { Cookies } from 'react-cookie';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const cookies = new Cookies();

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// cfg.headers를 항상 AxiosHeaders 인스턴스로 보장
function ensureHeaders(cfg: InternalAxiosRequestConfig): AxiosHeaders {
  if (cfg.headers instanceof AxiosHeaders) return cfg.headers;

  const headers = AxiosHeaders.from(cfg.headers ?? {});
  cfg.headers = headers; // AxiosRequestHeaders로 안전하게 대입
  return headers;
}

// 단일 요청 config에 Authorization 헤더 세팅
function setRequestAuthHeader(cfg: InternalAxiosRequestConfig, token: string, type = 'Bearer') {
  const h = ensureHeaders(cfg);
  h.set('Authorization', `${type} ${token}`);
}

// 단일 요청 config에서 Authorization 헤더 제거
function removeRequestAuthHeader(cfg: InternalAxiosRequestConfig) {
  const h = ensureHeaders(cfg);
  h.delete('Authorization');
}

// 요청 인터셉터: API 호출 시마다 자동으로 accessToken을 Authorization 헤더에 붙여줌
axiosInstance.interceptors.request.use((config) => {
  const access = cookies.get(ACCESS_COOKIE);
  if (access) {
    setRequestAuthHeader(config as InternalAxiosRequestConfig, access);
  }
  return config;
});

let isRefreshing = false; // 현재 토큰 갱신 중인지 여부
let queue: Array<() => void> = []; // 갱신 도중 들어온 요청들을 잠시 대기시킬 큐

// 실제 토큰 갱신 함수
async function doRefresh() {
  const refresh = cookies.get(REFRESH_COOKIE);
  if (!refresh) throw new Error('NO_REFRESH_TOKEN');

  // 순환 의존 방지: 여기서는 axios 기본 인스턴스 사용
  const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, {
    refresh_token: refresh,
  });

  const { access_token, refresh_token, token_type } = data as {
    access_token: string;
    refresh_token: string;
    token_type: 'bearer' | string;
  };

  // 새로운 accessToken 쿠키 저장
  cookies.set(ACCESS_COOKIE, access_token, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_MAX_AGE,
  });

  // refreshToken이 새로 내려온 경우 → 교체
  if (refresh_token) {
    cookies.set(REFRESH_COOKIE, refresh_token, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_MAX_AGE,
    });
  }

  // 기본 헤더 업데이트(다음 요청 대비)
  axiosInstance.defaults.headers.common.Authorization = `${token_type} ${access_token}`;
}

// 응답 인터셉터 -> 응답에서 401 Unauthorized가 나오면 refreshToken으로 토큰 재발급 시도
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;

    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const url = original?.url ?? '';
    const isRefreshCall = url.includes('/auth/refresh');

    // 리프레시 호출 자체는 건드리지 않음
    if (isRefreshCall) return Promise.reject(error);

    // accessToken 만료 → refresh 로직 실행
    if (status === 401 && original && !original._retry) {
      if (isRefreshing) {
        // 이미 갱신 중이면 → 큐에 넣고 완료될 때까지 대기
        await new Promise<void>((resolve) => queue.push(resolve));
        original._retry = true;

        // 대기 끝나면 새 accessToken으로 Authorization 붙여서 재요청
        const access = cookies.get(ACCESS_COOKIE);
        if (access) {
          removeRequestAuthHeader(original);
          setRequestAuthHeader(original, access);
        }
        return axiosInstance(original);
      }

      try {
        // 갱신 시작
        isRefreshing = true;
        await doRefresh();

        // 큐에 대기중인 요청들 모두 재실행
        queue.forEach((fn) => fn());
        queue = [];

        original._retry = true;

        // 새 accessToken으로 헤더 갱신 후 원래 요청 다시 실행
        const access = cookies.get(ACCESS_COOKIE);
        if (access) {
          removeRequestAuthHeader(original);
          setRequestAuthHeader(original, access);
        }
        return axiosInstance(original);
      } catch (e) {
        queue = [];
        // 리프레시 실패 → 쿠키 제거 후 로그인 페이지 이동
        cookies.remove(ACCESS_COOKIE, { path: COOKIE_OPTIONS.path });
        cookies.remove(REFRESH_COOKIE, { path: COOKIE_OPTIONS.path });
        window.location.assign('/login');
        throw e;
      } finally {
        isRefreshing = false; // 갱신 상태 해제
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
