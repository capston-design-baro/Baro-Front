import { type AccusedInfoCreate, registerAccused } from '@/apis/complaints';
import type { ComplainantInfoCreate } from '@/apis/complaints';
import { createComplaint } from '@/apis/complaints';
import CharacterModal from '@/components/CharacterModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import WizardNavButtons from '@/components/WizardNavButtons';
import WizardProgress from '@/components/WizardProgress';
import AccusedExtraInfoSection, {
  type AccusedExtraInfo,
  type AccusedExtraInfoSectionHandle,
} from '@/sections/AccusedExtraInfoSection';
import AccusedInfoSection, {
  type AccusedBasicInfo,
  type AccusedInfoSectionHandle,
} from '@/sections/AccusedInfoSection';
import ChatInfoSection from '@/sections/ChatInfoSection';
import ChatWindowSection from '@/sections/ChatWindowSection';
import type { ComplainantExtraInfoSectionHandle } from '@/sections/ComplaintExtraInfoSection';
import type { ComplainantExtraInfo } from '@/sections/ComplaintExtraInfoSection';
import ComplainantExtraInfoSection from '@/sections/ComplaintExtraInfoSection';
import ComplainantInfoSection from '@/sections/ComplaintInfoSection';
import type { ComplainantInfoSectionHandle } from '@/sections/ComplaintInfoSection';
import type { ComplaintBasicInfo } from '@/sections/ComplaintInfoSection';
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
  const resetWizard = useComplaintWizard((s) => s.reset);
  const [isChatCompleted, setIsChatCompleted] = useState(false);

  const complainantRef = useRef<ComplainantInfoSectionHandle>(null);
  const complainantExtraRef = useRef<ComplainantExtraInfoSectionHandle>(null);
  const accusedRef = useRef<AccusedInfoSectionHandle>(null);
  const accusedExtraRef = useRef<AccusedExtraInfoSectionHandle>(null);

  const offense = useComplaintWizard((s) => s.state.offense);

  // 고소인 저장 후 받은 complaintId를 보관해서 피고소인 섹션에 넘김
  const [complaintId, setComplaintId] = useState<number | null>(null);

  const [complainantBasicInfo, setComplainantBasicInfo] = useState<ComplaintBasicInfo | null>(null);

  // 피고소인 기본 정보 (섹션 1에서 받은 값)
  const [accusedBasicInfo, setAccusedBasicInfo] = useState<AccusedBasicInfo | null>(null);

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
      if (!complainantRef.current) return;
      try {
        const basic = await complainantRef.current.save();
        setComplainantBasicInfo(basic);
        next(); // → step 2 (고소인 추가 정보)
      } catch {
        // 섹션 내부에서 에러 처리
      }
      return;
    }

    if (step === 2) {
      if (!complainantBasicInfo || !complainantExtraRef.current) return;

      try {
        const extra: ComplainantExtraInfo = await complainantExtraRef.current.save();

        const payload: ComplainantInfoCreate = {
          complainant_name: complainantBasicInfo.name,
          complainant_email: complainantBasicInfo.unknownEmail ? '' : complainantBasicInfo.email,
          complainant_address: complainantBasicInfo.unknownAddr ? '' : complainantBasicInfo.address,
          complainant_phone: complainantBasicInfo.unknownPhone ? '' : complainantBasicInfo.phone,
          complainant_occupation: extra.unknownOccupation ? '' : extra.occupation,
          complainant_office_address: extra.unknownOfficeAddress ? '' : extra.officeAddress,
          complainant_office_phone: extra.unknownOfficePhone ? '' : extra.officePhone,
          complainant_home_phone: extra.unknownHomePhone ? '' : extra.homePhone,
        };

        const res = await createComplaint(payload);
        const id = Number(res?.id);

        if (!Number.isFinite(id) || id <= 0) {
          console.error('Invalid complaintId from createComplaint:', res);
          return;
        }

        setComplaintId(id);
        next(); // → step 3 (피고소인 기본 정보)
      } catch (e) {
        console.error('failed to create complaint', e);
        // TODO: 토스트 / 알럿으로 사용자에게 안내
      }
      return;
    }

    // step 3 (피고소인 정보)
    if (step === 3) {
      try {
        const basic = await accusedRef.current?.save();
        if (basic) {
          setAccusedBasicInfo(basic);
          next(); // → step 3 (추가 정보 섹션으로 이동)
        }
      } catch {
        // 섹션 내부에서 에러 처리
      }
      return;
    }

    // step 4 (피고소인 추가 정보 입력 + 서버에 최종 한 번 저장)
    if (step === 4) {
      if (!complaintId || !accusedBasicInfo) return;
      if (!accusedExtraRef.current) return;

      try {
        const extra: AccusedExtraInfo = await accusedExtraRef.current.save();

        const payload: AccusedInfoCreate = {
          accused_name: accusedBasicInfo.name,
          accused_email: accusedBasicInfo.email,
          accused_address: accusedBasicInfo.address,
          accused_phone: accusedBasicInfo.phone,
          accused_occupation: extra.occupation,
          accused_office_address: extra.officeAddress,
          accused_office_phone: extra.officePhone,
          accused_home_phone: extra.homePhone,
        };

        await registerAccused(complaintId, payload);
        next(); // step 5 (채팅 안내)
      } catch (e) {
        console.error('failed to register accused info', e);
        // TODO: 토스트 / 알럿으로 사용자에게 안내
      }
      return;
    }

    // step 5 (AI 채팅 후 고소장 생성)
    if (step === 6) {
      if (!complaintId) return;

      // TODO: 나중에 실제 AI 연동되면 generateFinal 호출로 다시 바꾸기
      try {
        setIsGenerating(true);
        const mockCriminalFacts = `2025년 10월경, 피고소인은 카카오톡 메신저를 통해
고소인에게 "원금과 수익금을 합쳐 300만 원을 보장해 주겠다"고 말하며
투자를 권유하였습니다.

고소인은 피고소인의 말을 믿고, 같은 해 10월 15일경
피고소인이 지정한 계좌(국민은행 123456-78-901234)로
총 300만 원을 송금하였습니다.

그러나 그 이후 피고소인은 고소인에게 약속한 수익금을 지급하지 않았을 뿐 아니라,
투자 원금 반환 요구에도 응하지 않은 채 연락을 회피하였습니다.`;

        const mockAccusationReason = `피고소인의 위와 같은 행위는
형법 제347조 제1항의 사기죄에 해당합니다.

피고소인은 처음부터 정상적인 투자나 원금/수익금 지급 의사 없이
고소인을 기망하여 재산상 이득을 취득한 것으로 보이며,
이에 고소인은 피고소인을 형법 제347조 제1항(사기죄) 위반으로
엄중히 처벌해주시기를 바랍니다.`;

        const merged = `${mockCriminalFacts}\n\n${mockAccusationReason}`;

        setGeneratedComplaint(merged);
        next();
      } finally {
        setIsGenerating(false); // 로딩 끝
      }

      /* 서버 코드 수정되면 다시 복구할 예정
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
      */

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
            <ComplainantInfoSection ref={complainantRef} />
          </div>

          {/* 2단계: 고소인 추가 정보 */}
          <div className={step === 2 ? 'block' : 'hidden'}>
            <ComplainantExtraInfoSection ref={complainantExtraRef} />
          </div>

          {/* 2단계: 피고소인 기본 정보 */}
          {typeof complaintId === 'number' && Number.isFinite(complaintId) && complaintId > 0 && (
            <div className={step === 3 ? 'block' : 'hidden'}>
              <AccusedInfoSection
                ref={accusedRef}
                complaintId={complaintId}
              />
            </div>
          )}

          {/* 4단계: 피고소인 추가 정보 */}
          {typeof complaintId === 'number' && Number.isFinite(complaintId) && complaintId > 0 && (
            <div className={step === 4 ? 'block' : 'hidden'}>
              <AccusedExtraInfoSection
                ref={accusedExtraRef}
                complaintId={complaintId}
              />
            </div>
          )}

          {/* 5단계: 채팅 안내 */}
          <div className={step === 5 ? 'block' : 'hidden'}>
            <ChatInfoSection />
          </div>
        </div>

        {/* 6단계: 실제 채팅창 */}
        {typeof complaintId === 'number' &&
          Number.isFinite(complaintId) &&
          complaintId > 0 &&
          step === 6 && (
            <ChatWindowSection
              complaintId={complaintId}
              offense={offense ?? undefined}
              onComplete={() => setIsChatCompleted(true)}
            />
          )}

        {/* 7단계: 완성된 고소장 미리보기 */}
        {typeof complaintId === 'number' &&
          Number.isFinite(complaintId) &&
          complaintId > 0 &&
          step === 7 &&
          generatedComplaint && (
            <ComplaintPreviewSection
              complaintId={complaintId}
              content={generatedComplaint}
            />
          )}

        <WizardNavButtons
          onPrev={prev}
          onNext={handleNext}
          isNextDisabled={isGenerating || (step === 6 && !isChatCompleted)}
          disablePrev={step === 0 || step === 4}
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
              resetWizard();
              navigate('/'); // 진짜 나가기
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ComplaintWizardPage;
