import { login } from '@/apis/auth';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoginCard from '@/components/auth/LoginCard';
import WelcomeCard from '@/components/auth/WelcomeCard';
import useIsMdUp from '@/hooks/useIsMdUp';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const isMdUp = useIsMdUp(); // md 이상일 때만 true
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    // 1) 로그인 → 토큰 쿠키 저장 + axios 헤더 설정
    await login({ email, password });

    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:py-20">
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-stretch">
            {/* md 이상에서만 WelcomeCard 렌더 */}
            {isMdUp && (
              <div>
                <WelcomeCard />
              </div>
            )}

            {/* 로그인 카드는 항상 표시 */}
            <div className="w-full md:w-[460px]">
              <LoginCard
                className="h-full"
                onLogin={handleLogin}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
