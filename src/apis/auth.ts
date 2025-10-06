import axiosInstance from '@/apis/axiosInstance';
import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from '@/types/auth';
import { Cookies } from 'react-cookie';

// 토큰 쿠키 만료시간
const ACCESS_MAX_AGE = 60 * 60; // 1시간
const REFRESH_MAX_AGE = 60 * 60 * 24; // 1일

const cookies = new Cookies();
const API = '/api';

// 로그인: 이메일 & 비밀번호를 보내서 토큰 받기
export async function login(body: LoginRequest): Promise<TokenResponse> {
  try {
    // POST /api/auth/login 으로 로그인 요청
    const { data } = await axiosInstance.post<TokenResponse>(`${API}/auth/login`, body);

    // 서버가 준 응답에서 액세스 토큰과 타입(bearer)을 꺼냄
    const { access_token, token_type } = data;

    // 액세스 토큰을 쿠키에 저장
    cookies.set('accessToken', access_token, {
      path: '/', // 사이트 전체에서 쿠키 접근 가능
      secure: true, // HTTPS에서만 전송
      sameSite: 'strict', // 다른 사이트에서 온 요청엔 쿠키 안 붙임
      maxAge: ACCESS_MAX_AGE,
    });

    // 이후 요청에 기본 Authorization 헤더 자동으로 붙도록 설정
    axiosInstance.defaults.headers.common.Authorization = `${token_type} ${access_token}`;

    // 호출한 쪽에서 쓸 수 있게 원본 응답 데이터 반환
    return data;
  } catch (e) {
    // 백엔드가 401을 준다면 여기서 일괄 메시지 매핑 가능
    throw new Error('INVALID_CREDENTIALS');
  }
}

// 내 정보 조회
export async function getMe(): Promise<UserResponse> {
  // 쿠키에서 액세스 토큰을 읽음
  const token: string | undefined = cookies.get('accessToken');

  // 토큰 없으면 바로 에러
  if (!token) throw new Error('NO_TOKEN');

  // GET /api/auth/me으로 요청. 헤더에 Bearer 토큰을 붙임
  const { data } = await axiosInstance.get<UserResponse>(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // 사용자 정보 반환
  return data;
}

// 회원가입
export async function register(payload: RegisterRequest): Promise<UserResponse> {
  // city + district + town을 한 줄 주소로 합침
  const fullAddress = `${payload.address.city} ${payload.address.district} ${payload.address.town}`;

  // 전송용 바디 재구성
  const body = { ...payload, address: fullAddress };

  // POST /api/auth/register로 회원가입 요청
  const { data } = await axiosInstance.post<UserResponse>(`${API}/auth/register`, body);
  return data;
}

// 액세스 토큰 재발급
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

// 로그아웃
export async function logout() {
  try {
    await axiosInstance.post(`${API}/auth/logout`);
  } catch {
    // 서버 로그아웃 없으면 무시
  } finally {
    initAuthStatus();
  }
}

// 인증 상태 초기화
export function initAuthStatus() {
  // 토큰 쿠키 삭제
  cookies.remove('accessToken', { path: '/' });

  // axios에 기본으로 세팅해둔 Authorization 헤더 제거
  delete axiosInstance.defaults.headers.common.Authorization;

  // 전역 사용자 상태/스토리지 초기화가 있다면 여기서 정리
  // localStorage.removeItem('user-storage');
}
