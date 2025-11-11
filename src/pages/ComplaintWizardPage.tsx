import { generateFinal } from '@/apis/complaints';
import CharacterModal from '@/components/CharacterModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import WizardNavButtons from '@/components/WizardNavButtons';
import WizardProgress from '@/components/WizardProgress';
import AccusedInfoSection from '@/sections/AccusedInfoSection';
import type { AccusedInfoSectionHandle } from '@/sections/AccusedInfoSection';
import ChatInfoSection from '@/sections/ChatInfoSection';
import ChatWindowSection from '@/sections/ChatWindowSection';
import ComplainantInfoSection from '@/sections/ComplaintInfoSection';
import type { ComplainantInfoSectionHandle } from '@/sections/ComplaintInfoSection';
import ComplaintIntroSection from '@/sections/ComplaintIntroSection';
import ComplaintPreviewSection from '@/sections/ComplaintPreviewSection';
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

  const offense = useComplaintWizard((s) => s.state.offense);

  // 고소인 저장 후 받은 complaintId를 보관해서 피고소인 섹션에 넘김
  const [complaintId, setComplaintId] = useState<number | null>(null);

  // AI가 생성한 최종 고소장 텍스트
  const [generatedComplaint, setGeneratedComplaint] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 작성 종료 모달 노출 여부
  const [showExitModal, setShowExitModal] = useState(false);

  // 상단 "작성 종료" 버튼 클릭 시 바로 나가지 않고 모달 오픈
  const handleExit = () => {
    setShowExitModal(true);
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

    // step 4 (AI 채팅 후 고소장 생성)
    if (step === 4) {
      if (!complaintId) return;

      try {
        setIsGenerating(true);
        const res = await generateFinal(complaintId);
        setGeneratedComplaint(res.generated_complaint);
        next(); // step 5로 이동
      } catch (e) {
        console.error('failed to generate complaint', e);
        // TODO: 토스트 / 알럿으로 사용자에게 안내
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    next();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <Header />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 py-4">
        <WizardProgress onExit={handleExit} />

        {/* 위자드 본문: 0~3단계 (420px 카드) */}
        <div className="mx-auto w-full max-w-[420px]">
          {/* 0단계: 사전 안내 */}
          <div className={step === 0 ? 'block' : 'hidden'}>
            <ComplaintIntroSection />
          </div>

          {/* 1단계: 고소인 정보 */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <ComplainantInfoSection ref={infoRef} />
          </div>

          {/* 2단계: 피고소인 정보 */}
          {typeof complaintId === 'number' && Number.isFinite(complaintId) && complaintId > 0 && (
            <div className={step === 2 ? 'block' : 'hidden'}>
              <AccusedInfoSection
                ref={accusedRef}
                complaintId={complaintId}
                onSaved={() => {
                  next();
                }}
              />
            </div>
          )}

          {/* 3단계: 채팅 안내 */}
          <div className={step === 3 ? 'block' : 'hidden'}>
            <ChatInfoSection />
          </div>
        </div>

        {/* 4단계: 실제 채팅창 */}
        {typeof complaintId === 'number' &&
          Number.isFinite(complaintId) &&
          complaintId > 0 &&
          step === 4 && (
            <ChatWindowSection
              complaintId={complaintId}
              offense={offense ?? undefined}
            />
          )}

        {/* 5단계: 완성된 고소장 미리보기 */}
        {typeof complaintId === 'number' &&
          Number.isFinite(complaintId) &&
          complaintId > 0 &&
          step === 5 &&
          generatedComplaint && (
            <div className="mx-auto mt-6 flex w-full justify-center">
              <ComplaintPreviewSection
                complaintId={complaintId}
                content={generatedComplaint}
              />
            </div>
          )}

        <WizardNavButtons
          onPrev={prev}
          onNext={handleNext}
          isNextDisabled={isGenerating}
          disablePrev={step === 0 || step === 4} // 필요하면
        />
      </main>
      <Footer />

      {/* 작성 종료 확인 모달 */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4">
          <CharacterModal
            variant="exit"
            onCancel={() => setShowExitModal(false)} // 계속 작성하기
            onConfirm={() => {
              setShowExitModal(false);
              navigate('/'); // 진짜 나가기
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ComplaintWizardPage;
