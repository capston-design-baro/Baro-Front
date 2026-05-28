import React from 'react';

import characterUrl from '@/assets/BaLawCharacter-large.svg';

import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';
import SectionHeader from '@/shared/ui/SectionHeader';

import AgreementsCard from '@/features/auth/components/AgreementsCard';
import { DEFAULT_AGREEMENTS } from '@/features/auth/constants/agreement';

const AgreementsPage: React.FC = () => {
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
            title="시작하기 전에"
            description="서비스 이용을 위한 약관에 동의해주세요."
          />

          {/* 약관 카드 */}
          <AgreementsCard initial={DEFAULT_AGREEMENTS} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgreementsPage;
