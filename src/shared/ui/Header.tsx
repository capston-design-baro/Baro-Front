import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';

import logoUrl from '@/assets/BaLawLogo.svg';

import Button from '@/shared/ui/common/Button';

import { logout } from '@/features/auth/apis/auth';
import { useUserStore } from '@/features/auth/stores/useUserStore';
import { useComplaintWizard } from '@/features/complaint/stores/useComplaintWizard';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const resetWizard = useComplaintWizard((s) => s.reset);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // main 태그가 스크롤 컨테이너인 경우 대응
      const scrollContainer = document.querySelector('main');
      const scrollY = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      setScrolled(scrollY > 10);
    };

    const scrollContainer = document.querySelector('main');
    const target = scrollContainer || window;
    target.addEventListener('scroll', handleScroll, { passive: true });

    return () => target.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => navigate('/login');

  const handleLogoClick = () => {
    resetWizard();
    navigate('/');
  };

  const handleLogoutClick = async () => {
    await logout();
    resetWizard();
    navigate('/');
  };

  const isLogin = Boolean(user);
  const buttonText = isLogin ? '로그아웃' : '로그인';
  const buttonAction = isLogin ? handleLogoutClick : handleLoginClick;
  const buttonVariant = isLogin ? 'outline-secondary' : 'outline';

  return (
    <header
      className={[
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/80 shadow-[0_1px_12px_rgba(0,0,0,0.06)] backdrop-blur-lg'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-8">
        <img
          src={logoUrl}
          alt="BaLaw 로고"
          className="h-7 w-auto cursor-pointer"
          onClick={handleLogoClick}
        />

        <Button
          variant={buttonVariant}
          size="sm"
          className="w-20"
          onClick={buttonAction}
        >
          {buttonText}
        </Button>
      </div>
    </header>
  );
};

export default Header;
