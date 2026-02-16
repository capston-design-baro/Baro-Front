// 쿠키 키 이름 정의
export const ACCESS_COOKIE = 'accessToken'; // Access Token 저장용 쿠키 키
export const REFRESH_COOKIE = 'refreshToken'; // Refresh Token 저장용 쿠키 키

export const ACCESS_MAX_AGE = 60 * 60; // 1시간
export const REFRESH_MAX_AGE = 60 * 60 * 24; // 1일

// 쿠키 공통 옵션
export const COOKIE_OPTIONS = {
  path: '/', // 모든 경로에서 쿠키 접근 가능
  sameSite: 'strict' as const, // 다른 도메인 요청 시 쿠키 전송 차단 (CSRF 방지)
};
