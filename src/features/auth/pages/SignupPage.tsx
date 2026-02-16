import { useNavigate } from 'react-router-dom';

import React from 'react';

import useIsMdUp from '@/shared/hooks/useIsMdUp';
import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';

import { register } from '@/features/auth/apis/auth';
import SignupCard from '@/features/auth/components/SignupCard';
import WelcomeCard from '@/features/auth/components/WelcomeCard';
import type { RegisterFormValues } from '@/features/auth/types/auth';

const SignupPage: React.FC = () => {
  const isMdUp = useIsMdUp();
  const navigate = useNavigate();

  const handleSignup = async (values: RegisterFormValues) => {
    await register(values);
    navigate('/login');
  };

  return (
    <div className="bg-neutral-0 flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-[1000px] py-8 md:py-10">
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
            {/* md 이상에서만 WelcomeCard 렌더 */}
            {isMdUp && (
              <div className="h-[600px] w-full max-w-[460px] flex-1">
                <WelcomeCard variant="signup" />
              </div>
            )}

            {/* 회원가입 카드 */}
            <div className="h-[600px] w-full max-w-[460px] flex-1">
              <SignupCard onSignup={handleSignup} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignupPage;
