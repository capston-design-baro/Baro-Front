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
import AccusedExtraInfoSection, {
  type AccusedExtraInfo,
  type AccusedExtraInfoSectionHandle,
} from '@/features/complaint/sections/AccusedExtraInfoSection';
import AccusedInfoSection, {
  type AccusedBasicInfo,
  type AccusedInfoSectionHandle,
} from '@/features/complaint/sections/AccusedInfoSection';
import ChatInfoSection from '@/features/complaint/sections/ChatInfoSection';
import ChatWindowSection from '@/features/complaint/sections/ChatWindowSection';
import ComplaintDownloadSection from '@/features/complaint/sections/ComplaintDownloadSection';
import ComplaintEntrySection from '@/features/complaint/sections/ComplaintEntrySection';
import type { ComplainantExtraInfoSectionHandle } from '@/features/complaint/sections/ComplaintExtraInfoSection';
import type { ComplainantExtraInfo } from '@/features/complaint/sections/ComplaintExtraInfoSection';
import ComplainantExtraInfoSection from '@/features/complaint/sections/ComplaintExtraInfoSection';
import type { ComplainantInfoSectionHandle } from '@/features/complaint/sections/ComplaintInfoSection';
import type { ComplaintBasicInfo } from '@/features/complaint/sections/ComplaintInfoSection';
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

  const [isChatCompleted, setIsChatCompleted] = useState(false);

  // 채팅 단계에서만 html 스크롤 차단
  useEffect(() => {
    if (step === 8) {
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

  const [entryMode, setEntryMode] = useState<'new' | 'resume' | null>(null);

  const complainantRef = useRef<ComplainantInfoSectionHandle>(null);
  const complainantExtraRef = useRef<ComplainantExtraInfoSectionHandle>(null);
  const accusedRef = useRef<AccusedInfoSectionHandle>(null);
  const accusedExtraRef = useRef<AccusedExtraInfoSectionHandle>(null);
  const evidenceRef = useRef<EvidenceInfoSectionHandle>(null);

  // AI 메타 정보 (이 페이지에서만 관리)
  const [ragKeyword, setRagKeyword] = useState<string | null>(null);
  const [ragCases, setRagCases] = useState<RagCase[]>([]);
  const [ragSearchStarted, setRagSearchStarted] = useState(false);

  const [complaintId, setComplaintId] = useState<number | null>(initialComplaintIdFromState);
  const [complainantBasicInfo, setComplainantBasicInfo] = useState<ComplaintBasicInfo | null>(null);
  const [accusedBasicInfo, setAccusedBasicInfo] = useState<AccusedBasicInfo | null>(null);

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
      setStep(8); // 0: 엔트리, 1: 인트로, ..., 7: 증거, 8: 채팅
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

    // 2: 고소인 기본정보 → 로컬 상태만 저장
    if (step === 2) {
      if (!complainantRef.current) return;

      try {
        const basic = await complainantRef.current.save();
        setComplainantBasicInfo(basic);
        nextRaw();
      } catch {
        // 섹션 내부에서 에러 처리
      }
      return;
    }

    // 3: 고소인 추가정보 → complaint 생성 + 관련 사건 등록
    if (step === 3) {
      if (!complainantBasicInfo || !complainantExtraRef.current) return;

      try {
        const extra: ComplainantExtraInfo = await complainantExtraRef.current.save();

        const payload: ComplainantInfoCreate = {
          complainant_name: complainantBasicInfo.name,
          complainant_email: complainantBasicInfo.unknownEmail ? '' : complainantBasicInfo.email,
          complainant_address: complainantBasicInfo.unknownAddr ? '' : complainantBasicInfo.address,
          complainant_phone: complainantBasicInfo.unknownPhone ? '' : complainantBasicInfo.phone,
          complainant_job: extra.unknownOccupation ? '' : extra.occupation,
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

    // 4: 피고소인 기본정보
    if (step === 4) {
      try {
        const basic = await accusedRef.current?.save();
        if (basic) {
          setAccusedBasicInfo(basic);
          nextRaw();
        }
      } catch {
        // 섹션 내부에서 에러 처리
      }
      return;
    }

    // 5: 피고소인 추가정보 → registerAccused
    if (step === 5) {
      if (!complaintId || !accusedBasicInfo) return;
      if (!accusedExtraRef.current) return;

      try {
        const extra: AccusedExtraInfo = await accusedExtraRef.current.save();

        const payload: AccusedInfoCreate = {
          accused_name: accusedBasicInfo.name,
          accused_email: accusedBasicInfo.email,
          accused_address: accusedBasicInfo.address,
          accused_phone: accusedBasicInfo.phone,
          accused_job: extra.occupation,
          accused_office_address: extra.officeAddress,
          accused_etc: extra.etc,
        };

        await registerAccused(complaintId, payload);
        nextRaw();
      } catch (e) {
        console.error('failed to register accused info', e);
      }
      return;
    }

    // 7: 증거 섹션 → registerEvidence 후 채팅 단계(8)로
    if (step === 7) {
      if (!complaintId) return;
      if (!evidenceRef.current) return;

      try {
        const { hasEvidence } = await evidenceRef.current.save();

        const payload: EvidenceCreate = {
          has_evidence: hasEvidence,
        };

        await registerEvidence(complaintId, payload);
        nextRaw(); // → step 8 (ChatWindowSection)
      } catch (e) {
        console.error('failed to register evidence', e);
      }

      return;
    }

    // 8: 채팅 완료 후 → 최종 고소장 생성 + 미리보기(9)
    if (step === 8) {
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

    if (step === 10) {
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
      className={`bg-neutral-0 flex w-full flex-col ${step === 8 ? 'h-screen overflow-hidden' : 'min-h-screen'}`}
    >
      <Header />
      <main
        className={`mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 py-4 ${step === 8 ? 'min-h-0 overflow-hidden' : ''}`}
      >
        <WizardProgress
          onExit={handleExit}
          className="mb-4 shrink-0"
        />
        {/* 위자드 본문: 0~7단계 */}
        <div className={step >= 8 ? 'hidden' : 'flex min-h-0 flex-1 flex-col'}>
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

          {/* 2: 고소인 기본정보 */}
          <div className={step === 2 ? 'flex flex-1 flex-col' : 'hidden'}>
            <ComplainantInfoSection ref={complainantRef} />
          </div>

          {/* 3: 고소인 추가정보 */}
          <div className={step === 3 ? 'flex flex-1 flex-col' : 'hidden'}>
            <ComplainantExtraInfoSection ref={complainantExtraRef} />
          </div>

          {/* 4: 피고소인 기본정보 */}
          {typeof complaintId === 'number' && Number.isFinite(complaintId) && complaintId > 0 && (
            <div className={step === 4 ? 'flex flex-1 flex-col' : 'hidden'}>
              <AccusedInfoSection
                ref={accusedRef}
                complaintId={complaintId}
              />
            </div>
          )}

          {/* 5: 피고소인 추가정보 */}
          {typeof complaintId === 'number' && Number.isFinite(complaintId) && complaintId > 0 && (
            <div className={step === 5 ? 'flex flex-1 flex-col' : 'hidden'}>
              <AccusedExtraInfoSection
                ref={accusedExtraRef}
                complaintId={complaintId}
              />
            </div>
          )}

          {/* 6: 채팅 안내 */}
          <div className={step === 6 ? 'flex flex-1 flex-col' : 'hidden'}>
            <ChatInfoSection />
          </div>

          {/* 7: 증거 제출 여부 확인 */}
          {typeof complaintId === 'number' &&
            Number.isFinite(complaintId) &&
            complaintId > 0 &&
            step === 7 && <EvidenceInfoSection ref={evidenceRef} />}
        </div>
        {/* 8: 실제 채팅창 + 오른쪽 메타 패널 */}
        {typeof complaintId === 'number' &&
          Number.isFinite(complaintId) &&
          complaintId > 0 &&
          step === 8 && (
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
                      사건 개요를 입력하면 AI가 분석해드려요
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
                            <span
                              className="material-symbols-outlined text-primary-300 mb-2 animate-spin"
                              style={{ fontSize: '28px' }}
                            >
                              progress_activity
                            </span>
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
          step === 9 &&
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
          step === 10 && (
            <div className="flex min-h-0 flex-1 flex-col">
              <ComplaintDownloadSection complaintId={complaintId} />
            </div>
          )}
        {step !== 8 && (
          <WizardNavButtons
            onPrev={prev}
            onNext={handleNext}
            isNextDisabled={
              isGenerating || (step === 0 && entryMode === null) || (step === 1 && !allChecked)
            }
            disablePrev={step === 0 || step === 9}
            nextLabel={step === 10 ? '종료' : '다음'}
          />
        )}
        <GeneratingModal open={showGeneratingModal} />
      </main>
      <Footer />

      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4">
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
      )}
    </div>
  );
};

export default ComplaintWizardPage;
