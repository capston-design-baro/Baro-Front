import axiosInstance from '@/apis/axiosInstance';
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  COOKIE_OPTIONS,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
} from '@/constants/auth';
import { useUserStore } from '@/stores/useUserStore';
import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '@/types/auth';
import { Cookies } from 'react-cookie';

// 쿠키 관리 객체 생성
const cookies = new Cookies();

// 공통: Authorization 기본 헤더 갱신
// -> 로그인 시 받은 accessToken을 axios 전역 Authorization 헤더에 설정
// -> 로그아웃하거나 토큰이 없으면 헤더 삭제
function setAuthHeader(accessToken?: string) {
  if (accessToken) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
}
// 로그인
// -> 응답으로 acces token이랑 refresh token을 발급받음
// -> 토큰을 쿠키에 저장하고, zustand user 상태 업데이트
export async function login(body: LoginRequest): Promise<TokenResponse> {
  const { data } = await axiosInstance.post<TokenResponse>(`/auth/login`, body);

  const { access_token, refresh_token } = data;

  // accessToken → 단기 쿠키 저장
  cookies.set(ACCESS_COOKIE, access_token, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_MAX_AGE,
  });

  // refreshToken → 장기 쿠키 저장
  cookies.set(REFRESH_COOKIE, refresh_token, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_MAX_AGE,
  });

  // axios 전역 Authorization 헤더 설정
  setAuthHeader(access_token);

  // 로그인 직후 사용자 정보 조회 → zustand 저장
  const me = await getMe();
  useUserStore.getState().setUser(me);

  return data;
}

// 내 정보 조회
export async function getMe(): Promise<UserResponse> {
  // accessToken이 없으면 쿠키에서 복원 후 Authorization 헤더 설정
  if (!axiosInstance.defaults.headers.common.Authorization) {
    const token: string | undefined = cookies.get(ACCESS_COOKIE);
    if (token) setAuthHeader(token);
  }

  const { data } = await axiosInstance.get<UserResponse>(`/auth/me`);
  return data;
}

// 회원가입
export async function register(payload: RegisterRequest): Promise<UserResponse> {
  // payload의 주소 객체(city, district, town)를 문자열로 합쳐서 서버에 전송
  const fullAddress =
    `${payload.address?.city ?? ''} ${payload.address?.district ?? ''} ${payload.address?.town ?? ''}`.trim();

  // string으로 변환한 address를 서버에 전송
  const body = { ...payload, address: fullAddress };

  const { data } = await axiosInstance.post<UserResponse>(`/auth/register`, body);
  return data;
}

// 토큰 갱신 -> refreshToken을 이용해 accessToken을 재발급
export async function refreshAccessToken(refreshTokenArg?: string) {
  const refreshToken = refreshTokenArg ?? cookies.get(REFRESH_COOKIE);
  if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

  const { data } = await axiosInstance.post<TokenResponse>(`/auth/refresh`, {
    refresh_token: refreshToken,
  });

  const { access_token, refresh_token, token_type } = data;

  // accessToken 갱신
  cookies.set(ACCESS_COOKIE, access_token, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_MAX_AGE,
  });

  // refreshToken이 새로 발급된 경우 → 교체
  if (refresh_token) {
    cookies.set(REFRESH_COOKIE, refresh_token, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_MAX_AGE,
    });
  }

  // axios Authorization 헤더 업데이트
  setAuthHeader(access_token);

  return data;
}

// 로그아웃
export async function logout() {
  try {
    // 서버가 /logout 제공하면 호출
    // await axiosInstance.post(`${API}/auth/logout`);
  } finally {
    initAuthStatus();
  }
}

// 인증 상태 초기화
export function initAuthStatus() {
  // accessToken / refreshToken 쿠키 제거
  cookies.remove(ACCESS_COOKIE, { path: COOKIE_OPTIONS.path });
  cookies.remove(REFRESH_COOKIE, { path: COOKIE_OPTIONS.path });

  // axios Authorization 헤더 제거
  setAuthHeader(undefined);

  // zustand user 상태 초기화
  useUserStore.getState().clearUser();
}
