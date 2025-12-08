import { login } from '@/apis/auth';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoginCard from '@/components/auth/LoginCard';
import WelcomeCard from '@/components/auth/WelcomeCard';
import useIsMdUp from '@/hooks/useIsMdUp';
import type { LoginFormValues } from '@/types/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const isMdUp = useIsMdUp(); // md 이상일 때만 true
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    await login(values);
    navigate('/');
  };

  return (
    <div className="bg-neutral-0 flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-[1000px] md:py-10">
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
            {/* md 이상에서만 WelcomeCard 렌더 */}
            {isMdUp && (
              <div className="h-[600px] w-full max-w-[460px] flex-1">
                <WelcomeCard variant="login" />
              </div>
            )}

            {/* 로그인 카드는 항상 표시 */}
            <div className="h-[600px] w-full max-w-[460px] flex-1">
              <LoginCard onLogin={handleLogin} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
