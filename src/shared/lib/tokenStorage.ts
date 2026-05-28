import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/features/auth/constants/auth';

// 세션 스토리지에 토큰 저장
export function setTokens(tokens: { access_token: string; refresh_token: string }) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}

// 세션 스토리지에서 액세스 토큰 가져오기
export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

// 세션 스토리지에서 리프레시 토큰 가져오기
export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

// 세션 스토리지에서 토큰 삭제
export function clearTokens() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
