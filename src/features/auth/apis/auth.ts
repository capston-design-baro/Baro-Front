import axiosInstance from '@/shared/lib/axiosInstance';
import { clearTokens, getRefreshToken, setTokens } from '@/shared/lib/tokenStorage';

import { toUser } from '@/features/auth/mappers/user';
import { useUserStore } from '@/features/auth/stores/useUserStore';
import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  UserResponseDto,
} from '@/features/auth/types/dto';
import type { LoginFormValues, RegisterFormValues } from '@/features/auth/types/form';

export type EmailCheckResponse = {
  available: boolean;
  message: string;
};

// 폼 값을 로그인 요청 dto로 변환
function toLoginRequestDto(values: LoginFormValues): LoginRequestDto {
  const email = values.email.trim();
  const password = values.password;

  // 유효성 검사
  if (!email) throw new Error('EMPTY_EMAIL');
  if (!password) throw new Error('EMPTY_PASSWORD');

  return {
    email,
    password,
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
  const phone_number = values.phone_number.trim();

  // 유효성 검사
  if (!email) throw new Error('EMPTY_EMAIL');
  if (!name) throw new Error('EMPTY_NAME');
  if (!password) throw new Error('EMPTY_PASSWORD');
  if (!address) throw new Error('EMPTY_ADDRESS');
  if (!phone_number) throw new Error('EMPTY_PHONE');

  return {
    email,
    name,
    password,
    address,
    phone_number,
  };
}

// 로그인
export async function login(values: LoginFormValues): Promise<LoginResponseDto> {
  const body = toLoginRequestDto(values);
  const { data } = await axiosInstance.post<LoginResponseDto>(`/auth/login`, body);

  setTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });

  // 로그인 직후 사용자 정보 조회 후 zustand 저장
  const meDto = await getMe();
  const me = toUser(meDto);
  useUserStore.getState().setUser(me);

  return data;
}

// 내 정보 조회
export async function getMe(): Promise<UserResponseDto> {
  const { data } = await axiosInstance.get<UserResponseDto>(`/auth/me`);
  return data;
}

// 회원가입
export async function register(values: RegisterFormValues): Promise<UserResponseDto> {
  const body = toRegisterRequestDto(values);
  const { data } = await axiosInstance.post<UserResponseDto>(`/auth/register`, body);
  return data;
}

// (수동) 토큰 갱신 -> refreshToken을 이용해 accessToken을 재발급
export async function refreshAccessToken(refreshTokenArg?: string) {
  const refreshToken = refreshTokenArg ?? getRefreshToken();
  if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

  const { data } = await axiosInstance.post<LoginResponseDto>(`/auth/refresh`, {
    refresh_token: refreshToken,
  });

  setTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });

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
  clearTokens(); // 토큰 삭제
  useUserStore.getState().clearUser(); // 사용자 정보 초기화
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
