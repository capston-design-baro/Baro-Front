import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoginPrompt from '@/components/LoginPrompt';
import ServiceSection from '@/sections/ServiceSection';
import { useUserStore } from '@/stores/useUserStore';
import type { Service } from '@/types/service';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleClickCard = (service: Service) => {
    if (!user && service.id === 'complaint') {
      setShowLoginPrompt(true);
      return;
    }

    if (service.to) {
      navigate(service.to);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="my-6 flex-1">
        <ServiceSection onClickCard={handleClickCard} />
      </main>
      <Footer />
      {/* 로그인 유도 모달 (로그인 안 된 상태에서 고소장 작성 클릭 시) */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4">
          <LoginPrompt
            onCancel={() => setShowLoginPrompt(false)}
            onLogin={() => {
              setShowLoginPrompt(false);
              navigate('/login');
            }}
          />
        </div>
      )}
    </div>
  );
}
