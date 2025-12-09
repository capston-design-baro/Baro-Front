import Footer from '@/components/Footer';
import Header from '@/components/Header';
import AgreementsCard from '@/components/agreements/AgreementsCard';
import WelcomeCard from '@/components/auth/WelcomeCard';
import { DEFAULT_AGREEMENTS } from '@/constants/agreement';
import useIsMdUp from '@/hooks/useIsMdUp';
import React from 'react';

const AgreementsPage: React.FC = () => {
  const isMdUp = useIsMdUp();

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

            {/* 약관 카드는 항상 표시 */}
            <div className="h-[600px] w-full max-w-[460px] flex-1">
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
