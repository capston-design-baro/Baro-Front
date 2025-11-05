/**
 * Header 컴포넌트
 * ------------------
 * - 로고 클릭 시 홈('/')으로 이동
 * - 로그인 상태에 따라 로그인 or 로그아웃 버튼 노출
 * - 로그아웃 버튼 클릭 시 -> 토큰 및 상태 초기화 후 홈으로 리디렉트
 */
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

  const isLogin = Boolean(user);
  const buttonText = isLogin ? '로그아웃' : '로그인';
  const buttonAction = isLogin ? handleLogoutClick : handleLoginClick;

  const buttonClass =
    'flex h-11 w-20 items-center justify-center gap-2.5 rounded-300 bg-primary-900 px-2 py-2 transition hover:bg-primary-800';

  return (
    /**
     * Header Layout
     * -----------------
     * - 최대 폭 1280px, 가운데 정렬
     * - 좌측: 로고
     * - 우측: 로그인 / 로그아웃 버튼
     */
    <header className="bg-neutral-0 mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-8 py-6">
      <img
        src={logoUrl}
        alt="BaLaw 로고"
        className="h-[clamp(24px,8vw,60px)] w-auto cursor-pointer"
        onClick={handleLogoClick}
      />

      {/* 로그인 여부(user 존재 여부)에 따라 버튼 분기 */}
      <button
        onClick={buttonAction}
        className={buttonClass}
      >
        <span className="text-body-3-regular text-neutral-0 font-medium">{buttonText}</span>{' '}
      </button>
    </header>
  );
};

export default Header;
