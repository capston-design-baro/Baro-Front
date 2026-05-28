import { useNavigate } from 'react-router-dom';

import { useState } from 'react';

import CharacterModal from '@/shared/ui/CharacterModal';
import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';

import { useUserStore } from '@/features/auth/stores/useUserStore';
import HeroSection from '@/features/home/sections/HeroSection';
import ProcessSection from '@/features/home/sections/ProcessSection';
import ServiceSection from '@/features/home/sections/ServiceSection';
import TrustSection from '@/features/home/sections/TrustSection';
import type { Service } from '@/features/home/types/service';

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

  const handleHeroStart = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    navigate('/complaint');
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="flex-1 snap-y snap-proximity overflow-y-auto scroll-smooth">
        {/* 히어로 섹션 */}
        <HeroSection onClickStart={handleHeroStart} />

        {/* 특징 섹션 */}
        <TrustSection />

        {/* 고소장 작성 단계 안내 섹션 */}
        <ProcessSection />

        {/* 서비스 카드 섹션 */}
        <ServiceSection onClickCard={handleClickCard} />
      </main>
      <Footer />
      {/* 로그인 유도 모달 (로그인 안 된 상태에서 고소장 작성 클릭 시) */}
      {showLoginPrompt && (
        <div
          className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            className="animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <CharacterModal
              variant="login"
              onCancel={() => setShowLoginPrompt(false)}
              onConfirm={() => {
                setShowLoginPrompt(false);
                navigate('/login');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
