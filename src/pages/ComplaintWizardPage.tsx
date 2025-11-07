// ComplaintWizardPage.tsx
import CharacterModal from '@/components/CharacterModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import WizardProgress from '@/components/WizardProgress';
import AccusedInfoSection from '@/sections/AccusedInfoSection';
import type { AccusedInfoSectionHandle } from '@/sections/AccusedInfoSection';
import ChatInfoSection from '@/sections/ChatInfoSection';
import ComplainantInfoSection from '@/sections/ComplaintInfoSection';
import type { ComplainantInfoSectionHandle } from '@/sections/ComplaintInfoSection';
import ComplaintIntroSection from '@/sections/ComplaintIntroSection';
import { useComplaintWizard } from '@/stores/useComplaintWizard';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ComplaintWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const step = useComplaintWizard((s) => s.state.step);
  const next = useComplaintWizard((s) => s.attemptNext);
  const prev = useComplaintWizard((s) => s.prev);

  const infoRef = useRef<ComplainantInfoSectionHandle>(null);
  const accusedRef = useRef<AccusedInfoSectionHandle>(null);

  // 고소인 저장 후 받은 complaintId를 보관해서 피고소인 섹션에 넘김
  const [complaintId, setComplaintId] = useState<number | null>(null);

  // 작성 종료 모달 노출 여부
  const [showExitModal, setShowExitModal] = useState(false);

  // 상단 "작성 종료" 버튼 클릭 시 바로 나가지 않고 모달 오픈
  const handleExit = () => {
    setShowExitModal(true);
  };

  const handleGoChat = () => {
    if (complaintId && Number.isFinite(complaintId)) {
      navigate(`/complaints/${complaintId}/chat`);
    }
  };

  const handleNext = async () => {
    // step 0 (인트로)
    if (step === 0) {
      next();
      return;
    }

    // step 1 (고소인 정보)
    if (step === 1) {
      try {
        const rawId = await infoRef.current?.save();
        const id = Number(rawId);
        if (Number.isFinite(id) && id > 0) {
          setComplaintId(id);
          next();
        } else {
          console.error('Invalid complaintId from save():', rawId);
        }
      } catch {
        // 섹션 내부에서 에러 처리
      }
      return;
    }

    // step 2 (피고소인 정보)
    if (step === 2) {
      try {
        await accusedRef.current?.save();
        // onSaved 에서 next() 호출
      } catch {
        // 섹션 내부에서 에러 처리
      }
      return;
    }

    if (step === 3) {
      handleGoChat();
      return;
    }

    next();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Header />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-2 px-6 py-4">
        <WizardProgress onExit={handleExit} />

        <div className="mx-auto w-full max-w-[720px]">
          {step === 0 && <ComplaintIntroSection />}
          {step === 1 && <ComplainantInfoSection ref={infoRef} />}
          {step === 2 &&
            typeof complaintId === 'number' &&
            Number.isFinite(complaintId) &&
            complaintId > 0 && (
              <AccusedInfoSection
                ref={accusedRef}
                complaintId={complaintId}
                onSaved={() => {
                  next(); // 피고소인 저장 성공 시 다음 단계로
                }}
              />
            )}
          {step === 3 && <ChatInfoSection />}
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

      {/* 작성 종료 확인 모달 */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4">
          <CharacterModal
            variant="exit" // ✅ "지금 나가면 복구 불가" 텍스트 나오는 모드
            onCancel={() => setShowExitModal(false)} // 계속 작성하기
            onConfirm={() => {
              setShowExitModal(false);
              navigate(-1); // 진짜 나가기 (이전 페이지로)
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ComplaintWizardPage;
