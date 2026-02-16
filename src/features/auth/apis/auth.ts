import { Cookies } from 'react-cookie';

import axiosInstance, { applyTokens } from '@/shared/lib/axiosInstance';

import { ACCESS_COOKIE, COOKIE_OPTIONS, REFRESH_COOKIE } from '@/features/auth/constants/auth';
import { useUserStore } from '@/features/auth/stores/useUserStore';
import type {
  LoginFormValues,
  LoginRequestDto,
  RegisterFormValues,
  RegisterRequestDto,
  TokenResponse,
  UserResponse,
} from '@/features/auth/types/auth';

// 쿠키 관리 객체 생성
const cookies = new Cookies();

export type EmailCheckResponse = {
  available: boolean;
  message: string;
};

// 폼 값을 로그인 요청 dto로 변환
function toLoginRequestDto(values: LoginFormValues): LoginRequestDto {
  return {
    email: values.email.trim(),
    password: values.password,
  };
}

// 폼 값을 회원가입 요청 dto로 변환
function toRegisterRequestDto(values: RegisterFormValues): RegisterRequestDto {
  const email = values.email.trim();
  const name = values.name.trim();
  const password = values.password;

  // 주소 객체를 문자열로 변환
  const { city, district, town } = values.address;
  const address = [city, district, town]
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .join(' ')
    .trim();

  // 전화번호 처리
  const phone = values.phone_number.trim();

  // 유효성 검사
  if (!email) throw new Error('EMPTY_EMAIL');
  if (!name) throw new Error('EMPTY_NAME');
  if (!password) throw new Error('EMPTY_PASSWORD');
  if (!address) throw new Error('EMPTY_ADDRESS');
  if (!phone) throw new Error('EMPTY_PHONE');

  return {
    email,
    name,
    password,
    address,
    phone_number: phone,
  };
}

// 로그인
export async function login(values: LoginFormValues): Promise<TokenResponse> {
  const body = toLoginRequestDto(values);
  const { data } = await axiosInstance.post<TokenResponse>(`/auth/login`, body);

  applyTokens(data);

  // 로그인 직후 사용자 정보 조회 → zustand 저장
  const me = await getMe();
  useUserStore.getState().setUser(me);

  return data;
}

// 내 정보 조회
export async function getMe(): Promise<UserResponse> {
  const { data } = await axiosInstance.get<UserResponse>(`/auth/me`);
  return data;
}

// 회원가입
export async function register(values: RegisterFormValues): Promise<UserResponse> {
  const body = toRegisterRequestDto(values);
  const { data } = await axiosInstance.post<UserResponse>(`/auth/register`, body);
  return data;
}

// (수동) 토큰 갱신 -> refreshToken을 이용해 accessToken을 재발급
export async function refreshAccessToken(refreshTokenArg?: string) {
  const refreshToken = refreshTokenArg ?? cookies.get(REFRESH_COOKIE);
  if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

  const { data } = await axiosInstance.post<TokenResponse>(`/auth/refresh`, {
    refresh_token: refreshToken,
  });

  applyTokens(data);

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

  // zustand user 상태 초기화
  useUserStore.getState().clearUser();
}

// 이메일 중복 확인
export async function checkEmailAvailability(email: string): Promise<EmailCheckResponse> {
  const trimmed = email.trim();

  if (!trimmed) {
    throw new Error('EMPTY_EMAIL');
  }

  const { data } = await axiosInstance.get<EmailCheckResponse>(
    `/auth/check-email/${encodeURIComponent(trimmed)}`,
  );

  return data;
}
