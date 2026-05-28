import { clearTokens, getAccessToken } from '@/shared/lib/tokenStorage';

import { getMe } from '@/features/auth/apis/auth';
import { toUser } from '@/features/auth/mappers/user';
import { useUserStore } from '@/features/auth/stores/useUserStore';

export async function bootstrapAuth() {
  const token = getAccessToken();

  // 토큰 없으면 바로 초기화하고 끝
  if (!token) {
    useUserStore.getState().clearUser();
    return;
  }

  try {
    const meDto = await getMe();
    // 전역 상태에 사용자 정보 저장
    useUserStore.getState().setUser(toUser(meDto));
  } catch {
    clearTokens(); // 토큰 삭제
    useUserStore.getState().clearUser(); // 사용자 정보 초기화
  }
}
