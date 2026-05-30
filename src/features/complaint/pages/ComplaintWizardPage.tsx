import { useLocation, useNavigate } from 'react-router-dom';

import React, { useEffect, useRef, useState } from 'react';

import CharacterModal from '@/shared/ui/CharacterModal';
import Footer from '@/shared/ui/Footer';
import GeneratingModal from '@/shared/ui/GeneratingModal';
import Header from '@/shared/ui/Header';

import type { ComplainantInfoCreate } from '@/features/complaint/apis/complaints';
import type { RagCase } from '@/features/complaint/apis/complaints';
import { createComplaint } from '@/features/complaint/apis/complaints';
import {
  type AccusedInfoCreate,
  type EvidenceCreate,
  generateFinal,
  registerAccused,
  registerEvidence,
  registerRelatedCases,
} from '@/features/complaint/apis/complaints';
import WizardNavButtons from '@/features/complaint/components/WizardNavButtons';
import WizardProgress from '@/features/complaint/components/WizardProgress';
import AccusedInfoSection, {
  type AccusedInfoSectionHandle,
} from '@/features/complaint/sections/AccusedInfoSection';
import ChatInfoSection from '@/features/complaint/sections/ChatInfoSection';
import ChatWindowSection from '@/features/complaint/sections/ChatWindowSection';
import ComplaintDownloadSection from '@/features/complaint/sections/ComplaintDownloadSection';
import ComplaintEntrySection from '@/features/complaint/sections/ComplaintEntrySection';
import type { ComplainantInfoSectionHandle } from '@/features/complaint/sections/ComplaintInfoSection';
import ComplainantInfoSection from '@/features/complaint/sections/ComplaintInfoSection';
import ComplaintIntroSection from '@/features/complaint/sections/ComplaintIntroSection';
import ComplaintPreviewSection from '@/features/complaint/sections/ComplaintPreviewSection';
import EvidenceInfoSection, {
  type EvidenceInfoSectionHandle,
} from '@/features/complaint/sections/EvidenceInfoSection';
import { useComplaintWizard } from '@/features/complaint/stores/useComplaintWizard';

const ComplaintWizardPage: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation() as {
    state?: {
      mode?: 'new' | 'resume';
      complaintId?: number;
      aiSessionId?: string | null;
      status?: 'in_progress' | 'completed' | string;
    };
  };

  const fromState = location.state;
  const resumeMode = fromState?.mode === 'resume';
  const initialComplaintIdFromState = fromState?.complaintId ?? null;
  const initialAiSessionIdFromState = fromState?.aiSessionId ?? null;

  const step = useComplaintWizard((s) => s.state.step);
  const nextRaw = useComplaintWizard((s) => s.next);
  const prev = useComplaintWizard((s) => s.prev);
  const resetWizard = useComplaintWizard((s) => s.reset);
  const allChecked = useComplaintWizard((s) => s.allChecked());
  const setStep = useComplaintWizard((s) => s.setStep);

  const [, setIsChatCompleted] = useState(false);

  // 채팅 단계에서만 html 스크롤 차단
  useEffect(() => {
    if (step === 6) {
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
    } else {
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, [step]);

  const newMode = fromState?.mode === 'new';
  const [entryMode, setEntryMode] = useState<'new' | 'resume' | null>(newMode ? 'new' : null);

  // 외부에서 mode: 'new'로 진입하면 step 0 건너뛰기
  useEffect(() => {
    if (newMode && step === 0) {
      setStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const complainantRef = useRef<ComplainantInfoSectionHandle>(null);
  const accusedRef = useRef<AccusedInfoSectionHandle>(null);
  const evidenceRef = useRef<EvidenceInfoSectionHandle>(null);

  // AI 메타 정보 (이 페이지에서만 관리)
  const [ragKeyword, setRagKeyword] = useState<string | null>(null);
  const [ragCases, setRagCases] = useState<RagCase[]>([]);
  const [ragSearchStarted, setRagSearchStarted] = useState(false);

  const [complaintId, setComplaintId] = useState<number | null>(initialComplaintIdFromState);

  const [generatedComplaint, setGeneratedComplaint] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [showExitModal, setShowExitModal] = useState(false);

  const [selectedCase, setSelectedCase] = useState<RagCase | null>(null);

  const [showGeneratingModal, setShowGeneratingModal] = useState(false);

  /** 나가기 버튼 */
  const handleExit = () => {
    setShowExitModal(true);
  };

  /** 이어쓰기 진입이면 바로 채팅 단계로 점프 (step 8) */
  useEffect(() => {
    if (resumeMode && initialComplaintIdFromState) {
      setComplaintId(initialComplaintIdFromState);
      setStep(6); // 0: 엔트리, 1: 인트로, 2: 고소인, 3: 피고소인, 4: 채팅안내, 5: 증거, 6: 채팅
    }
  }, [resumeMode, initialComplaintIdFromState, setStep]);

  const handleNext = async () => {
    // 0: 엔트리 → 그냥 다음 단계로
    if (step === 0) {
      // 아직 아무 것도 안 골랐으면 그냥 리턴 (혹은 여기서 토스트 띄워도 됨)
      if (!entryMode) return;

      if (entryMode === 'new') {
        // 새 고소장 → 인트로(step 1)로
        nextRaw(); // 0 -> 1
      } else if (entryMode === 'resume') {
        // 이어 작성 → /complaints로
        navigate('/complaints');
      }

      return;
    }

    if (step === 1) {
      const { attemptNext } = useComplaintWizard.getState();
      attemptNext();
      return;
    }

    // 2: 고소인 정보 (기본+추가 통합) → complaint 생성 + 관련 사건 등록
    if (step === 2) {
      if (!complainantRef.current) return;

      try {
        const info = await complainantRef.current.save();

        const payload: ComplainantInfoCreate = {
          complainant_name: info.name,
          complainant_email: info.unknownEmail ? '' : info.email,
          complainant_address: info.unknownAddr ? '' : info.address,
          complainant_phone: info.unknownPhone ? '' : info.phone,
          complainant_job: info.unknownOccupation ? '' : info.occupation,
          complainant_office_address: info.unknownOfficeAddress ? '' : info.officeAddress,
          complainant_office_phone: info.unknownOfficePhone ? '' : info.officePhone,
          complainant_home_phone: info.unknownHomePhone ? '' : info.homePhone,
        };

        const res = await createComplaint(payload);
        const id = Number(res?.id);

        if (!Number.isFinite(id) || id <= 0) {
          console.error('Invalid complaintId from createComplaint:', res);
          return;
        }

        setComplaintId(id);

        const prechecks = useComplaintWizard.getState().state.prechecks;
        const criminal = prechecks.find((q) => q.id === 'alreadyCriminalFiled');
        const civil = prechecks.find((q) => q.id === 'alreadyCivilFiled');
        const withdrawn = prechecks.find((q) => q.id === 'withdrawnBefore');

        await registerRelatedCases(id, {
          duplicate_complaint: withdrawn?.answer === 'yes',
          related_criminal_case: criminal?.answer === 'yes',
          related_civil_case: civil?.answer === 'yes',
        });

        nextRaw();
      } catch (e) {
        console.error('failed to create complaint', e);
      }
      return;
    }

    // 3: 피고소인 정보 (기본 + 추가 통합) → registerAccused
    if (step === 3) {
      if (!complaintId) return;
      if (!accusedRef.current) return;

      try {
        const info = await accusedRef.current.save();
        const payload: AccusedInfoCreate = {
          accused_name: info.name,
          accused_email: info.email,
          accused_address: info.address,
          accused_phone: info.phone,
          accused_job: info.occupation,
          accused_office_address: info.officeAddress,
          accused_etc: info.etc,
        };

        await registerAccused(complaintId, payload);
        nextRaw();
      } catch (e) {
        console.error('failed to register accused info', e);
      }
      return;
    }

    // 4: 증거 섹션 → registerEvidence
    if (step === 4) {
      if (!complaintId) return;
      if (!evidenceRef.current) return;

      try {
        const { hasEvidence } = await evidenceRef.current.save();

        const payload: EvidenceCreate = {
          has_evidence: hasEvidence,
        };

        await registerEvidence(complaintId, payload);
        nextRaw(); // → step 5 (채팅 안내)
      } catch (e) {
        console.error('failed to register evidence', e);
      }

      return;
    }

    // 6: 채팅 완료 후 → 최종 고소장 생성 + 미리보기(7)
    if (step === 6) {
      if (!complaintId) return;

      // 버튼 누르는 즉시 모달 띄우기
      setShowGeneratingModal(true);
      setIsGenerating(true);

      try {
        const res = await generateFinal(complaintId);
        setGeneratedComplaint(res.generated_complaint);

        // 응답 오면 모달 닫고 다음 단계로 이동
        setShowGeneratingModal(false);
        setIsGenerating(false);

        nextRaw(); // → step 9 (ComplaintPreviewSection)
      } catch (e) {
        console.error('failed to generate complaint', e);
        // 실패 시에도 모달은 닫아줌
        setShowGeneratingModal(false);
        setIsGenerating(false);
      } finally {
        setIsGenerating(false);
      }

      return;
    }

    if (step === 8) {
      resetWizard(); // 위자드 상태 초기화
      navigate('/'); // 홈으로 이동
      return;
    }

    // 나머지 단계는 그냥 +1
    nextRaw();
  };

  const chatMode: 'new' | 'resume' = resumeMode ? 'resume' : 'new';

  return (
    <div
      className={`bg-neutral-0 flex w-full flex-col ${step === 6 ? 'h-screen overflow-hidden' : 'min-h-screen'}`}
    >
      <Header />
      <main
        className={`mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 py-4 ${step === 6 ? 'min-h-0 overflow-hidden' : ''}`}
      >
        <WizardProgress
          onExit={handleExit}
          className="mb-4 shrink-0"
        />
        {/* 위자드 본문: 0~7단계 */}
        <div className={step >= 6 ? 'hidden' : 'flex min-h-0 flex-1 flex-col'}>
          {/* 0: 시작 선택 (새로 작성 / 이어쓰기 / 목록 보기) */}
          {step === 0 && (
            <ComplaintEntrySection
              activeMode={entryMode}
              onNew={() => setEntryMode('new')}
              onResumeDrafts={() => setEntryMode('resume')}
            />
          )}

          {/* 1: 인트로 / 안내 */}
          <div className={step === 1 ? 'flex flex-1 flex-col' : 'hidden'}>
            <ComplaintIntroSection />
          </div>

          {/* 2: 고소인 정보 */}
          <div className={step === 2 ? 'flex flex-1 flex-col' : 'hidden'}>
            <ComplainantInfoSection ref={complainantRef} />
          </div>

          {/* 3: 피고소인 정보 */}
          {typeof complaintId === 'number' && Number.isFinite(complaintId) && complaintId > 0 && (
            <div className={step === 3 ? 'flex flex-1 flex-col' : 'hidden'}>
              <AccusedInfoSection
                ref={accusedRef}
                complaintId={complaintId}
              />
            </div>
          )}

          {/* 4: 증거 제출 */}
          {typeof complaintId === 'number' && Number.isFinite(complaintId) && complaintId > 0 && (
            <div className={step === 4 ? 'flex flex-1 flex-col' : 'hidden'}>
              <EvidenceInfoSection ref={evidenceRef} />
            </div>
          )}

          {/* 5: 채팅 안내 */}
          <div className={step === 5 ? 'flex flex-1 flex-col' : 'hidden'}>
            <ChatInfoSection />
          </div>
        </div>
        {/* 8: 실제 채팅창 + 오른쪽 메타 패널 */}
        {typeof complaintId === 'number' &&
          Number.isFinite(complaintId) &&
          complaintId > 0 &&
          step === 6 && (
            <div className="flex min-h-0 flex-1 gap-4">
              <div className="flex min-h-0 flex-1">
                <ChatWindowSection
                  complaintId={complaintId}
                  mode={chatMode}
                  initialAiSessionId={initialAiSessionIdFromState ?? null}
                  onInitStart={() => setRagSearchStarted(true)}
                  onComplete={() => {
                    setIsChatCompleted(true);
                    // 자동으로 다음 단계로 이동
                    setTimeout(() => handleNext(), 1500);
                  }}
                  onInitMeta={({ offense, rag_keyword, rag_cases }) => {
                    console.log('📌 onInitMeta in Wizard:', {
                      offense,
                      rag_keyword,
                      rag_cases,
                    });
                    setRagKeyword(rag_keyword ?? null);
                    setRagCases(rag_cases ?? []);
                  }}
                />
              </div>

              <aside className="flex min-h-0 w-[340px] shrink-0 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                {/* 헤더 */}
                <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-3">
                  <div className="bg-primary-100 flex h-7 w-7 items-center justify-center rounded-full">
                    <span
                      className="material-symbols-outlined text-primary-400"
                      style={{ fontSize: '16px' }}
                    >
                      search
                    </span>
                  </div>
                  <h2 className="text-body-3-bold text-neutral-800">AI 분석 결과</h2>
                </div>

                {/* 키워드 섹션 */}
                <div className="border-b border-neutral-100 px-5 py-4">
                  <p className="text-detail-regular mb-2 text-neutral-400">핵심 키워드</p>
                  {ragKeyword ? (
                    <span className="bg-primary-0 text-body-3-bold text-primary-500 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '16px' }}
                      >
                        tag
                      </span>
                      {ragKeyword}
                    </span>
                  ) : (
                    <p className="text-body-3-regular text-neutral-400">
                      사건 개요를 입력하면 관련 정보를 정리해드려요
                    </p>
                  )}
                </div>

                {/* 유사 판례 */}
                <div className="flex flex-1 flex-col overflow-hidden px-5 py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-detail-regular text-neutral-400">유사 판례</p>
                    {ragCases.length > 0 && (
                      <span className="text-detail-bold text-primary-400">{ragCases.length}건</span>
                    )}
                  </div>

                  <div className="balaw-scrollbar flex-1 overflow-y-auto">
                    {ragCases.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        {ragSearchStarted ? (
                          <>
                            {/* 책 넘기기 애니메이션 */}
                            <div
                              className="relative mb-3 h-12 w-16"
                              style={{ perspective: '400px' }}
                            >
                              {/* 책 전체를 비스듬히 기울임 */}
                              <div
                                className="absolute inset-0"
                                style={{
                                  transform: 'rotateX(20deg) rotateZ(-5deg)',
                                  transformStyle: 'preserve-3d',
                                }}
                              >
                                {/* 책 뒤표지 */}
                                <div className="bg-primary-300 absolute inset-0 rounded-r-sm shadow-sm" />
                                {/* 책 옆면 (두께) */}
                                <div className="bg-primary-400 absolute top-0 left-0 h-full w-1 rounded-l-sm" />
                                {/* 페이지 3 */}
                                <div
                                  className="animate-book-page-3 bg-primary-50 absolute inset-0 rounded-r-sm shadow-sm"
                                  style={{
                                    transformOrigin: 'left center',
                                    backfaceVisibility: 'hidden',
                                  }}
                                >
                                  <div className="mx-2 mt-2 space-y-1">
                                    <div className="h-[2px] w-3/4 rounded bg-neutral-200" />
                                    <div className="h-[2px] w-1/2 rounded bg-neutral-200" />
                                  </div>
                                </div>
                                {/* 페이지 2 */}
                                <div
                                  className="animate-book-page-2 bg-primary-0 absolute inset-0 rounded-r-sm shadow-sm"
                                  style={{
                                    transformOrigin: 'left center',
                                    backfaceVisibility: 'hidden',
                                  }}
                                >
                                  <div className="mx-2 mt-2 space-y-1">
                                    <div className="h-[2px] w-2/3 rounded bg-neutral-200" />
                                    <div className="h-[2px] w-4/5 rounded bg-neutral-200" />
                                  </div>
                                </div>
                                {/* 페이지 1 (맨 위) */}
                                <div
                                  className="animate-book-page-1 absolute inset-0 rounded-r-sm bg-white shadow-sm"
                                  style={{
                                    transformOrigin: 'left center',
                                    backfaceVisibility: 'hidden',
                                  }}
                                >
                                  <div className="mx-2 mt-2 space-y-1">
                                    <div className="h-[2px] w-1/2 rounded bg-neutral-300" />
                                    <div className="h-[2px] w-3/4 rounded bg-neutral-200" />
                                    <div className="h-[2px] w-2/3 rounded bg-neutral-200" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-body-3-regular text-neutral-500">
                              유사 판례를 찾고 있어요...
                            </p>
                          </>
                        ) : (
                          <>
                            <span
                              className="material-symbols-outlined mb-2 text-neutral-300"
                              style={{ fontSize: '28px' }}
                            >
                              gavel
                            </span>
                            <p className="text-body-3-regular text-neutral-400">
                              아직 불러온 판례가 없어요
                            </p>
                            <p className="text-detail-regular mt-1 text-neutral-300">
                              사건 개요를 입력하면 관련 판례를 보여드릴게요
                            </p>
                          </>
                        )}
                      </div>
                    ) : (
                      <ul className="flex flex-col gap-3">
                        {ragCases.map((c, idx) => {
                          const isOpen = selectedCase?.case_no === c.case_no;

                          return (
                            <li key={c.case_no || idx}>
                              <div
                                className={[
                                  'w-full rounded-xl border bg-neutral-50 transition-all duration-300',
                                  isOpen
                                    ? 'border-primary-200 bg-primary-0/20'
                                    : 'border-neutral-200',
                                ].join(' ')}
                              >
                                {/* 카드 헤더 (클릭 가능) */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedCase(isOpen ? null : c)}
                                  className="group flex w-full items-center justify-between px-4 py-3 text-left"
                                >
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-body-3-bold text-neutral-800">
                                      {c.case_no}
                                    </span>
                                    {c.label && (
                                      <span className="text-detail-regular text-neutral-500">
                                        {c.label}
                                      </span>
                                    )}
                                  </div>
                                  <span
                                    className={[
                                      'material-symbols-outlined text-neutral-400 transition-transform duration-300',
                                      isOpen ? 'rotate-180' : '',
                                    ].join(' ')}
                                    style={{ fontSize: '18px' }}
                                  >
                                    expand_more
                                  </span>
                                </button>

                                {/* 펼쳐지는 상세 영역 */}
                                <div
                                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                                >
                                  <div className="overflow-hidden">
                                    <div className="border-t border-neutral-100 px-4 pt-3 pb-4">
                                      {/* 유사 포인트 */}
                                      {c.similarity && (
                                        <div className="mb-3">
                                          <p className="text-detail-regular mb-1 text-neutral-400">
                                            유사 포인트
                                          </p>
                                          <p className="text-detail-regular leading-relaxed text-neutral-700">
                                            {c.similarity}
                                          </p>
                                        </div>
                                      )}

                                      {/* 사건 개요 */}
                                      <div className="mb-3">
                                        <p className="text-detail-regular mb-1 text-neutral-400">
                                          사건 개요
                                        </p>
                                        <p className="text-detail-regular leading-relaxed whitespace-pre-line text-neutral-700">
                                          {c.summary || '요약 정보가 없어요.'}
                                        </p>
                                      </div>

                                      {/* 판결 결과 */}
                                      <div>
                                        <p className="text-detail-regular mb-1 text-neutral-400">
                                          판결 결과
                                        </p>
                                        <p className="text-detail-regular leading-relaxed whitespace-pre-line text-neutral-700">
                                          {c.result || '판결 결과 정보가 없어요.'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          )}
        {/* 9: 완성된 고소장 미리보기 */}
        {typeof complaintId === 'number' &&
          Number.isFinite(complaintId) &&
          complaintId > 0 &&
          step === 7 &&
          generatedComplaint && (
            <div className="flex min-h-0 flex-1 flex-col">
              <ComplaintPreviewSection
                complaintId={complaintId}
                content={generatedComplaint}
              />
            </div>
          )}
        {/* 10: DOCX 다운로드 섹션 */}
        {typeof complaintId === 'number' &&
          Number.isFinite(complaintId) &&
          complaintId > 0 &&
          step === 8 && (
            <div className="flex min-h-0 flex-1 flex-col">
              <ComplaintDownloadSection complaintId={complaintId} />
            </div>
          )}
        {step !== 6 && (
          <WizardNavButtons
            onPrev={prev}
            onNext={handleNext}
            isNextDisabled={
              isGenerating || (step === 0 && entryMode === null) || (step === 1 && !allChecked)
            }
            disablePrev={step === 0 || step === 7}
            nextLabel={step === 8 ? '종료' : '다음'}
          />
        )}
        <GeneratingModal open={showGeneratingModal} />
      </main>
      <Footer />

      {showExitModal && (
        <div
          className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4"
          onClick={() => setShowExitModal(false)}
        >
          <div
            className="animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <CharacterModal
              variant="exit"
              onCancel={() => setShowExitModal(false)}
              onConfirm={() => {
                setShowExitModal(false);
                resetWizard();
                navigate('/');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintWizardPage;
