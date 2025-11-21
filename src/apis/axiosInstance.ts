import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  COOKIE_OPTIONS,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
} from '@/constants/auth';
import type { TokenResponse } from '@/types/auth';
import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { Cookies } from 'react-cookie';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const cookies = new Cookies();

// 401 재시도 여부 플래그가 있는 요청 config
type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// 토큰을 쿠키에 저장
export function applyTokens(data: TokenResponse) {
  const { access_token, refresh_token } = data;

  cookies.set(ACCESS_COOKIE, access_token, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_MAX_AGE,
  });

  if (refresh_token) {
    cookies.set(REFRESH_COOKIE, refresh_token, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_MAX_AGE,
    });
  }
}

// refresh 실패 시 인증 정리 후 로그인 페이지로 이동
function clearAuthAndRedirect() {
  cookies.remove(ACCESS_COOKIE, { path: COOKIE_OPTIONS.path });
  cookies.remove(REFRESH_COOKIE, { path: COOKIE_OPTIONS.path });
  window.location.assign('/login');
}

// Axios 인스턴스 생성
const axiosInstance = axios.create({ baseURL: BASE_URL });

// cfg.headers를 항상 AxiosHeaders 인스턴스로 보장
function ensureHeaders(cfg: InternalAxiosRequestConfig): AxiosHeaders {
  if (cfg.headers instanceof AxiosHeaders) return cfg.headers;

  const headers = AxiosHeaders.from(cfg.headers ?? {});
  cfg.headers = headers;
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
  const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
    refresh_token: refresh,
  });

  applyTokens(data);
}

// 새 accessToken으로 원래 요청 재시도
function retryWithNewAccessToken(original: RetryableRequestConfig) {
  const access = cookies.get(ACCESS_COOKIE);
  if (access) {
    removeRequestAuthHeader(original);
    setRequestAuthHeader(original, access);
  }

  original._retry = true;
  return axiosInstance(original);
}

// 응답 인터셉터 -> 응답에서 401 Unauthorized가 나오면 refreshToken으로 토큰 재발급 시도
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as RetryableRequestConfig | undefined;

    const url = original?.url ?? '';
    const isRefreshCall = url.includes('/auth/refresh');

    // 리프레시 호출 자체는 건드리지 않음
    if (isRefreshCall) return Promise.reject(error);

    // accessToken 만료 → refresh 로직 실행
    if (status === 401 && original && !original._retry) {
      if (isRefreshing) {
        // 이미 갱신 중이면 → 큐에 넣고 완료될 때까지 대기
        await new Promise<void>((resolve) => queue.push(resolve));
        return retryWithNewAccessToken(original);
      }

      try {
        // 갱신 시작
        isRefreshing = true;
        await doRefresh();

        // 큐에 대기중인 요청들 모두 재실행
        queue.forEach((fn) => fn());
        queue = [];

        return retryWithNewAccessToken(original);
      } catch (e) {
        queue = [];
        clearAuthAndRedirect();
        throw e;
      } finally {
        isRefreshing = false; // 갱신 상태 해제
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
