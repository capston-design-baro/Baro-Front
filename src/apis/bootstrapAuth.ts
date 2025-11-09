import { getMe } from '@/apis/auth';
import axiosInstance from '@/apis/axiosInstance';
import { ACCESS_COOKIE } from '@/constants/auth';
import type { User } from '@/stores/useUserStore';
import { useUserStore } from '@/stores/useUserStore';
import { Cookies } from 'react-cookie';

// 애플리케이션 시작 시 실행해서 인증 상태를 "부트스트랩"하는 함수
// -> 쿠키에서 토큰을 복원하고 /me API 호출로 사용자 정보를 가져옴
export async function bootstrapAuth() {
  try {
    // 쿠키에서 accessToken 가져오기
    const cookies = new Cookies();
    const token = cookies.get(ACCESS_COOKIE);

    // axios 전역 Authorization 헤더가 비어있다면 토큰으로 보정
    // (새로고침 후 앱이 재시작되면 axios 전역 헤더가 사라지니까)
    if (token && !axiosInstance.defaults.headers.common.Authorization) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    // 내 정보(/auth/me) 조회 → 정상 응답이면 zustand에 사용자 정보 저장
    const me = await getMe();

    const user: User = {
      id: me.id,
      email: me.email,
      name: me.name,
      address: me.address ?? '',
      phone_number: me.phone_number ?? '',
    };

    // 전역 상태에 사용자 정보 저장
    useUserStore.getState().setUser(user);
  } catch {
    // 토큰 없거나 401이면 사용자 상태 초기화
    useUserStore.getState().clearUser();
  }
}
