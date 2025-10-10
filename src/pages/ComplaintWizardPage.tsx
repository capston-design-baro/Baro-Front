import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import WizardProgress from '@/components/Wizard/WizardProgress';
import ComplaintIntroSection from '@/sections/ComplaintIntroSection';
import { useComplaintWizard } from '@/stores/useComplaintWizard';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComplaintWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const next = useComplaintWizard((s) => s.attemptNext);
  const prev = useComplaintWizard((s) => s.prev);

  const handleExit = () => navigate(-1);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* 상단 헤더 */}
      <Header />

      {/* 메인 컨테이너: 가운데 정렬 + 최대폭 1440 */}
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-6 py-4">
        {/* 상단 진행바 */}
        <WizardProgress onExit={handleExit} />

        {/* 본문 섹션: 최대폭 720으로 중앙 정렬 */}
        <div className="mx-auto w-full max-w-[720px]">
          <ComplaintIntroSection />
        </div>

        {/* 이전/다음 버튼: 자연 흐름 하단 배치 */}
        <div className="mx-auto mb-14 flex w-full max-w-[720px] items-center justify-center">
          <div className="flex w-full max-w-[500px] items-center justify-between">
            <button
              type="button"
              onClick={prev}
              className="flex h-12 w-[220px] items-center justify-center rounded-2xl bg-blue-600 px-6 py-[9px] text-2xl font-bold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              이전
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-12 w-[220px] items-center justify-center rounded-2xl bg-blue-600 px-6 py-[9px] text-2xl font-bold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              다음
            </button>
          </div>
        </div>
      </main>

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
};

export default ComplaintWizardPage;
