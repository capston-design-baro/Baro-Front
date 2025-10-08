import { logout } from '@/apis/auth';
import logoUrl from '@/assets/BaLawLogo.svg';
import { useUserStore } from '@/stores/useUserStore';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  // zustand 스토어에서 현재 로그인한 사용자 정보 가져오기
  const user = useUserStore((state) => state.user);

  // 로그인 버튼 클릭 → /login 페이지 이동
  const handleLoginClick = () => {
    navigate('/login');
  };

  // 로고 클릭 → 홈('/') 이동
  const handleLogoClick = () => {
    navigate('/');
  };

  // 로그아웃 버튼 클릭
  const handleLogoutClick = async () => {
    await logout(); // 토큰/쿠키 삭제 + store 초기화
    navigate('/'); // 로그아웃 후 홈('/')으로 이동
  };

  return (
    <header className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between bg-white px-10 py-6">
      {/* 로고 클릭 시 홈으로 이동 */}
      <img
        src={logoUrl}
        alt="Logo"
        className="h-[clamp(24px,8vw,60px)] w-auto cursor-pointer"
        onClick={handleLogoClick}
      />

      {/* 로그인 여부(user 존재 여부)에 따라 버튼 분기 */}
      {user ? (
        <button
          onClick={handleLogoutClick}
          className="flex h-12 w-22 items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-4 py-2"
        >
          <span className="text-sm font-medium text-white">로그아웃</span>
        </button>
      ) : (
        <button
          onClick={handleLoginClick}
          className="flex h-12 w-20 items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-4 py-2"
        >
          <span className="text-sm font-medium text-white">로그인</span>
        </button>
      )}
    </header>
  );
};

export default Header;
