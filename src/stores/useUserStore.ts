import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 사용자 정보 타입 정의
interface User {
  id: number;
  email: string;
  name: string;
  address: string;
}

// Zustand에서 관리할 상태 타입 정의
interface UserStore {
  user: User | null; // 현재 로그인한 사용자 정보 (없으면 null)
  setUser: (user: User | null) => void; // 사용자 정보 저장 (로그인 성공 시)
  clearUser: () => void; // 사용자 정보 초기화 (로그아웃 시)
}

// zustand 스토어 생성
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // 초기 상태
      user: null,

      // 로그인 후 사용자 정보를 상태에 저장
      setUser: (user) => set({ user }),

      // 로그아웃 시 사용자 정보를 비움
      clearUser: () => set({ user: null }),
    }),
    {
      // persist 미들웨어 설정
      name: 'user-storage', // localStorage에 저장될 key 이름
      storage: createJSONStorage(() => localStorage), // localStorage를 사용해서 상태를 영구 저장
    },
  ),
);
