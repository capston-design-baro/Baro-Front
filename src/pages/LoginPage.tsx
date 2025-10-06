import { getMe, login } from '@/apis/auth';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import LoginCard from '@/components/auth/LoginCard';
import WelcomeCard from '@/components/auth/WelcomeCard';
import useIsMdUp from '@/hooks/useIsMdUp';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const isMdUp = useIsMdUp(); // md 이상일 때만 true
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    /*
    // 1) 로그인 → 토큰 쿠키 저장 + axios 헤더 설정
    await login({ email, password });

    // 2) 내 정보 불러오기 (선택)
    try {
      const me = await getMe();
      console.log('me', me);
      // 전역 상태가 있다면 setUser(me)
    } catch {
      // me 실패해도 라우팅은 가능
    }
    */

    // 가짜 로그인 처리 👉 토큰과 이메일을 로컬에 저장
    localStorage.setItem('accessToken', 'fake-token');
    localStorage.setItem('userEmail', email);

    // getMe 대신 콘솔 로그
    console.log('fake me', { email, name: '관리자(테스트)' });

    // 3) 라우팅
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
