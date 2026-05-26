import { useNavigate } from 'react-router-dom';

import React from 'react';

import characterUrl from '@/assets/BaLawCharacter-large.svg';
import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';
import SectionHeader from '@/shared/ui/SectionHeader';

import { register } from '@/features/auth/apis/auth';
import SignupCard from '@/features/auth/components/SignupCard';
import type { RegisterFormValues } from '@/features/auth/types/form';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignup = async (values: RegisterFormValues) => {
    await register(values);
    navigate('/login');
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-50">
      <Header />
      <main className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-8">
        <div className="flex w-full max-w-[420px] flex-col items-center">
          {/* 캐릭터 + 인사말 */}
          <img
            src={characterUrl}
            alt="BaLaw 캐릭터"
            className="mb-4 h-24 w-24"
            draggable={false}
          />
          <SectionHeader
            size="sm"
            title="바로에 오신 걸 환영해요!"
            description="간단한 정보만 입력하면 바로 시작할 수 있어요."
          />

          {/* 회원가입 카드 */}
          <SignupCard onSignup={handleSignup} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
