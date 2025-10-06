import logoUrl from '@/assets/BaLawLogo.svg';
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex h-20 w-full items-center justify-between bg-white px-10 py-6">
      <img
        src={logoUrl}
        alt="Logo"
        className="h-[clamp(24px,8vw,60px)] w-auto"
      />

      <button className="flex h-9 items-center justify-center gap-2.5 rounded-md bg-slate-900 px-4 py-2">
        <span className="text-sm font-medium text-white">로그인</span>
      </button>
    </header>
  );
};

export default Header;
