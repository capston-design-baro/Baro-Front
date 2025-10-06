import axiosInstance from '@/apis/axiosInstance';
import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '@/types/auth';
import { Cookies } from 'react-cookie';

// 토큰 쿠키 만료시간: 초 단위
const ACCESS_MAX_AGE = 60 * 60; // 1시간
const REFRESH_MAX_AGE = 60 * 60 * 24; // 1일

const cookies = new Cookies();
const API = '/api';

export async function login(body: LoginRequest): Promise<TokenResponse> {
  try {
    const { data } = await axiosInstance.post<TokenResponse>(`${API}/auth/login`, body);
    // 서버가 access_token, token_type를 JSON으로 반환한다고 가정
    const { access_token, token_type } = data;

    // 토큰 쿠키 저장 (HttpOnly 쿠키 전략이 가능하면 백엔드에서 설정 권장)
    cookies.set('accessToken', access_token, {
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: ACCESS_MAX_AGE,
    });

    // Authorization 헤더 기본값 주입(선택)
    axiosInstance.defaults.headers.common.Authorization = `${token_type} ${access_token}`;

    return data;
  } catch (e) {
    // 백엔드가 401을 준다면 여기서 일괄 메시지 매핑 가능
    throw new Error('INVALID_CREDENTIALS');
  }
}

export async function getMe(): Promise<UserResponse> {
  const token: string | undefined = cookies.get('accessToken');
  if (!token) throw new Error('NO_TOKEN');

  const { data } = await axiosInstance.get<UserResponse>(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function register(payload: RegisterRequest): Promise<UserResponse> {
  const fullAddress = `${payload.address.city} ${payload.address.district} ${payload.address.town}`;
  const body = { ...payload, address: fullAddress };

  const { data } = await axiosInstance.post<UserResponse>(`${API}/auth/register`, body);
  return data;
}

export async function refreshAccessToken(refreshToken?: string) {
  const { data } = await axiosInstance.post<{ access_token: string; token_type: 'bearer' }>(
    `${API}/auth/reissue-token`,
    { refreshToken },
  );

  const { access_token, token_type } = data;
  cookies.set('accessToken', access_token, {
    path: '/',
    secure: true,
    sameSite: 'strict',
    maxAge: ACCESS_MAX_AGE,
  });
  axiosInstance.defaults.headers.common.Authorization = `${token_type} ${access_token}`;
  return data;
}

export async function logout() {
  try {
    await axiosInstance.post(`${API}/auth/logout`);
  } catch {
    // 서버 로그아웃 없으면 무시
  } finally {
    initAuthStatus();
  }
}

export function initAuthStatus() {
  // 토큰 쿠키 삭제
  cookies.remove('accessToken', { path: '/' });
  // axios 기본 Authorization 제거
  delete axiosInstance.defaults.headers.common.Authorization;
  // 전역 사용자 상태/스토리지 초기화가 있다면 여기서 정리
  // localStorage.removeItem('user-storage');
}
