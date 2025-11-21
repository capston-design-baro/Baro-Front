import axiosInstance, { applyTokens } from '@/apis/axiosInstance';
import { ACCESS_COOKIE, COOKIE_OPTIONS, REFRESH_COOKIE } from '@/constants/auth';
import { useUserStore } from '@/stores/useUserStore';
import type {
  LoginFormValues,
  LoginRequestDto,
  RegisterFormValues,
  RegisterRequestDto,
  TokenResponse,
  UserResponse,
} from '@/types/auth';
import { Cookies } from 'react-cookie';

// 쿠키 관리 객체 생성
const cookies = new Cookies();

// 폼 값을 로그인 요청 dto로 변환
function toLoginRequestDto(values: LoginFormValues): LoginRequestDto {
  return {
    email: values.email.trim(),
    password: values.password,
  };
}

// 폼 값을 회원가입 요청 dto로 변환
function toRegisterRequestDto(values: RegisterFormValues): RegisterRequestDto {
  const { email, name, password } = values;
  const { address, phone_number } = values;

  // 주소 합치기
  const { city, district, town } = address ?? {};
  const fullAddress = [city, district, town]
    .filter((part) => !!part && part.trim().length > 0)
    .join(' ')
    .trim();

  const addressOrNull = fullAddress.length > 0 ? fullAddress : null;

  // 전화번호 처리
  const phoneOrNull = phone_number && phone_number.trim().length > 0 ? phone_number.trim() : null;

  return {
    email: email.trim(),
    name: name.trim(),
    password,
    address: addressOrNull,
    phone_number: phoneOrNull,
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
