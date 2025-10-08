import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import AgreementsCard from '@/components/agreements/AgreementsCard';
import WelcomeCard from '@/components/auth/WelcomeCard';
import { DEFAULT_AGREEMENTS } from '@/constants/agreement';
import useIsMdUp from '@/hooks/useIsMdUp';
import React from 'react';

const AgreementsPage: React.FC = () => {
  const isMdUp = useIsMdUp();

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

            {/* 약관 카드는 항상 표시 */}
            <div className="h-full w-full md:w-[460px]">
              <AgreementsCard initial={DEFAULT_AGREEMENTS} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AgreementsPage;
