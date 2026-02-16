import axiosInstance from '@/apis/axiosInstance';
import { getMe } from '@/features/auth/apis/auth';
import { ACCESS_COOKIE } from '@/features/auth/constants/auth';
import { toUser } from '@/features/auth/mappers/user';
import { useUserStore } from '@/features/auth/stores/useUserStore';
import { Cookies } from 'react-cookie';

// 애플리케이션 시작 시 실행해서 인증 상태를 "부트스트랩"하는 함수
// -> 쿠키에서 토큰을 복원하고 /me API 호출로 사용자 정보를 가져옴
export async function bootstrapAuth() {
  // 쿠키에서 accessToken 가져오기
  const cookies = new Cookies();
  const token = cookies.get(ACCESS_COOKIE);

  // 토큰 없으면 바로 초기화하고 끝
  if (!token) {
    useUserStore.getState().clearUser();
    return;
  }

  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;

  try {
    const me = await getMe();
    // 전역 상태에 사용자 정보 저장
    useUserStore.getState().setUser(toUser(me));
  } catch {
    // 토큰 없거나 401이면 사용자 상태 초기화
    useUserStore.getState().clearUser();
  }
}
