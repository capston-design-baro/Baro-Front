import logoUrl from '@/assets/BaLawLogo.svg';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogoutClick = () => {
    // 저장된 토큰 삭제
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    // 홈으로 이동
    navigate('/');
  };

  return (
    <header className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between bg-white px-10 py-6">
      <img
        src={logoUrl}
        alt="Logo"
        className="h-[clamp(24px,8vw,60px)] w-auto cursor-pointer"
        onClick={handleLogoClick}
      />

      {accessToken ? (
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
