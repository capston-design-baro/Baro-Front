// ComplaintWizardPage.tsx

import React, { useRef } from 'react';

import ComplainantInfoSection from '@/sections/ComplaintInfoSection';
import type { ComplainantInfoSectionHandle } from '@/sections/ComplaintInfoSection';
import ComplaintIntroSection from '@/sections/ComplaintIntroSection';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import WizardProgress from '@/components/Wizard/WizardProgress';
import { useComplaintWizard } from '@/stores/useComplaintWizard';
import { useNavigate } from 'react-router-dom';

const ComplaintWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const step = useComplaintWizard((s) => s.state.step);
  const next = useComplaintWizard((s) => s.attemptNext);
  const prev = useComplaintWizard((s) => s.prev);

  const infoRef = useRef<ComplainantInfoSectionHandle>(null);

  const handleExit = () => navigate(-1);

  const handleNext = async () => {
    if (step === 1) {
      try {
        await infoRef.current?.save(); // ⬅️ 저장 성공 시 섹션 내부에서 navigate 수행
      } catch {
        // 실패 시 섹션 안쪽 에러 메시지로 안내되므로 여기선 조용히 종료
      }
      return;
    }
    next();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Header />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-2 px-6 py-4">
        <WizardProgress
          onExit={handleExit}
          badgeText={step === 1 ? '바로가 도와줄게요!' : '잘 하고 있어요!'}
        />
        <div className="mx-auto w-full max-w-[720px]">
          {step === 0 && <ComplaintIntroSection />}
          {step === 1 && <ComplainantInfoSection ref={infoRef} />}
        </div>
        <div className="mx-auto mb-14 flex w-full max-w-[720px] items-center justify-center">
          <div className="flex w-full max-w-[500px] items-center justify-between">
            <button
              type="button"
              onClick={prev}
              className="flex h-12 w-[220px] items-center justify-center rounded-2xl bg-blue-600 px-6 py-[9px] text-2xl font-bold text-white"
            >
              이전
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex h-12 w-[220px] items-center justify-center rounded-2xl bg-blue-600 px-6 py-[9px] text-2xl font-bold text-white"
            >
              다음
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComplaintWizardPage;
