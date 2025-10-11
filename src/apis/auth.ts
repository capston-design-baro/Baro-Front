// src/apis/axiosInstance.ts
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  COOKIE_OPTIONS,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
} from '@/constants/auth';
import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { Cookies } from 'react-cookie';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const cookies = new Cookies();

// ✅ 단순 생성 (top-level await/즉시함수 제거)
const axiosInstance = axios.create({ baseURL: BASE_URL });

// ---- helpers ----
function ensureHeaders(cfg: InternalAxiosRequestConfig): AxiosHeaders {
  if (cfg.headers instanceof AxiosHeaders) return cfg.headers;
  const headers = AxiosHeaders.from(cfg.headers ?? {});
  cfg.headers = headers;
  return headers;
}
function setRequestAuthHeader(cfg: InternalAxiosRequestConfig, token: string, type = 'Bearer') {
  ensureHeaders(cfg).set('Authorization', `${type} ${token}`);
}
function removeRequestAuthHeader(cfg: InternalAxiosRequestConfig) {
  ensureHeaders(cfg).delete('Authorization');
}

// ---- request interceptor ----
axiosInstance.interceptors.request.use((config) => {
  const access = cookies.get(ACCESS_COOKIE);
  if (access) setRequestAuthHeader(config as InternalAxiosRequestConfig, access);
  return config;
});

let isRefreshing = false;
let queue: Array<() => void> = [];

// ✅ refresh도 인스턴스로 상대경로 호출
async function doRefresh() {
  const refresh = cookies.get(REFRESH_COOKIE);
  if (!refresh) throw new Error('NO_REFRESH_TOKEN');

  const { data } = await axiosInstance.post('/auth/refresh', { refresh_token: refresh });
  const { access_token, refresh_token, token_type } = data as {
    access_token: string;
    refresh_token: string;
    token_type: 'bearer' | string;
  };

  cookies.set(ACCESS_COOKIE, access_token, { ...COOKIE_OPTIONS, maxAge: ACCESS_MAX_AGE });
  if (refresh_token) {
    cookies.set(REFRESH_COOKIE, refresh_token, { ...COOKIE_OPTIONS, maxAge: REFRESH_MAX_AGE });
  }
  axiosInstance.defaults.headers.common.Authorization = `${token_type} ${access_token}`;
}

// ---- response interceptor ----
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const url = original?.url ?? '';
    const isRefreshCall = url.includes('/auth/refresh');

    if (isRefreshCall) return Promise.reject(error);

    if (status === 401 && original && !original._retry) {
      if (isRefreshing) {
        await new Promise<void>((resolve) => queue.push(resolve));
        original._retry = true;
        const access = cookies.get(ACCESS_COOKIE);
        if (access) {
          removeRequestAuthHeader(original);
          setRequestAuthHeader(original, access);
        }
        return axiosInstance(original);
      }

      try {
        isRefreshing = true;
        await doRefresh();

        queue.forEach((fn) => fn());
        queue = [];

        original._retry = true;
        const access = cookies.get(ACCESS_COOKIE);
        if (access) {
          removeRequestAuthHeader(original);
          setRequestAuthHeader(original, access);
        }
        return axiosInstance(original);
      } catch (e) {
        queue = [];
        cookies.remove(ACCESS_COOKIE, { path: COOKIE_OPTIONS.path });
        cookies.remove(REFRESH_COOKIE, { path: COOKIE_OPTIONS.path });
        window.location.assign('/login');
        throw e;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
