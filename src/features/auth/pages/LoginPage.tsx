import { useNavigate } from 'react-router-dom';

import React from 'react';

import characterUrl from '@/assets/BaLawCharacter-large.svg';

import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';
import SectionHeader from '@/shared/ui/SectionHeader';

import { login } from '@/features/auth/apis/auth';
import LoginCard from '@/features/auth/components/LoginCard';
import type { LoginFormValues } from '@/features/auth/types/form';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    await login(values);
    navigate('/');
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50">
      <Header />
      <main className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-8">
        <div className="animate-fade-in flex w-full max-w-[420px] flex-col items-center">
          {/* 캐릭터 + 인사말 */}
          <img
            src={characterUrl}
            alt="BaLaw 캐릭터"
            className="mb-4 h-24 w-24"
            draggable={false}
          />
          <SectionHeader
            size="sm"
            title="다시 만나서 반가워요!"
            description="바로와 함께 시작해볼까요?"
          />

          {/* 로그인 카드 */}
          <LoginCard onLogin={handleLogin} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
