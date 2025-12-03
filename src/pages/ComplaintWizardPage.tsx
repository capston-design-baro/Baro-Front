import {
  type AccusedInfoCreate,
  type EvidenceCreate,
  generateFinal,
  registerAccused,
  registerEvidence,
  registerRelatedCases,
} from '@/apis/complaints';
import type { ComplainantInfoCreate } from '@/apis/complaints';
import { createComplaint } from '@/apis/complaints';
import type { RagCase } from '@/apis/complaints';
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
import ComplaintDownloadSection from '@/sections/ComplaintDownloadSection';
import ComplaintEntrySection from '@/sections/ComplaintEntrySection';
import type { ComplainantExtraInfoSectionHandle } from '@/sections/ComplaintExtraInfoSection';
import type { ComplainantExtraInfo } from '@/sections/ComplaintExtraInfoSection';
import ComplainantExtraInfoSection from '@/sections/ComplaintExtraInfoSection';
import ComplainantInfoSection from '@/sections/ComplaintInfoSection';
import type { ComplainantInfoSectionHandle } from '@/sections/ComplaintInfoSection';
import type { ComplaintBasicInfo } from '@/sections/ComplaintInfoSection';
import ComplaintIntroSection from '@/sections/ComplaintIntroSection';
import ComplaintPreviewSection from '@/sections/ComplaintPreviewSection';
import EvidenceInfoSection, {
  type EvidenceInfoSectionHandle,
} from '@/sections/EvidenceInfoSection';
import { useComplaintWizard } from '@/stores/useComplaintWizard';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const setStep = useComplaintWizard((s) => s.setStep);

  const [isChatCompleted, setIsChatCompleted] = useState(false);

  const [entryMode, setEntryMode] = useState<'new' | 'resume' | null>(null);

  const complainantRef = useRef<ComplainantInfoSectionHandle>(null);
  const complainantExtraRef = useRef<ComplainantExtraInfoSectionHandle>(null);
  const accusedRef = useRef<AccusedInfoSectionHandle>(null);
  const accusedExtraRef = useRef<AccusedExtraInfoSectionHandle>(null);
  const evidenceRef = useRef<EvidenceInfoSectionHandle>(null);

  // AI 메타 정보 (이 페이지에서만 관리)
  const [ragKeyword, setRagKeyword] = useState<string | null>(null);
  const [ragCases, setRagCases] = useState<RagCase[]>([]);

  const [complaintId, setComplaintId] = useState<number | null>(initialComplaintIdFromState);
  const [complainantBasicInfo, setComplainantBasicInfo] = useState<ComplaintBasicInfo | null>(null);
  const [accusedBasicInfo, setAccusedBasicInfo] = useState<AccusedBasicInfo | null>(null);

  const [generatedComplaint, setGeneratedComplaint] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [showExitModal, setShowExitModal] = useState(false);

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

      try {
        setIsGenerating(true);
        const res = await generateFinal(complaintId);
        setGeneratedComplaint(res.generated_complaint);
        nextRaw(); // → step 9 (ComplaintPreviewSection)
      } catch (e) {
        console.error('failed to generate complaint', e);
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
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <Header />
      <main className="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col overflow-y-auto px-6 py-4">
        <WizardProgress onExit={handleExit} />
        {/* 위자드 본문: 0~7단계 (420px 카드) */}
        <div className="mx-auto w-full max-w-[420px]">
          {/* 0: 시작 선택 (새로 작성 / 이어쓰기 / 목록 보기) */}
          {step === 0 && (
            <ComplaintEntrySection
              activeMode={entryMode}
              onNew={() => setEntryMode('new')}
              onResumeDrafts={() => setEntryMode('resume')}
            />
          )}

          {/* 1: 인트로 / 안내 */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <ComplaintIntroSection />
          </div>

          {/* 2: 고소인 기본정보 */}
          <div className={step === 2 ? 'block' : 'hidden'}>
            <ComplainantInfoSection ref={complainantRef} />
          </div>

          {/* 3: 고소인 추가정보 */}
          <div className={step === 3 ? 'block' : 'hidden'}>
            <ComplainantExtraInfoSection ref={complainantExtraRef} />
          </div>

          {/* 4: 피고소인 기본정보 */}
          {typeof complaintId === 'number' && Number.isFinite(complaintId) && complaintId > 0 && (
            <div className={step === 4 ? 'block' : 'hidden'}>
              <AccusedInfoSection
                ref={accusedRef}
                complaintId={complaintId}
              />
            </div>
          )}

          {/* 5: 피고소인 추가정보 */}
          {typeof complaintId === 'number' && Number.isFinite(complaintId) && complaintId > 0 && (
            <div className={step === 5 ? 'block' : 'hidden'}>
              <AccusedExtraInfoSection
                ref={accusedExtraRef}
                complaintId={complaintId}
              />
            </div>
          )}

          {/* 6: 채팅 안내 */}
          <div className={step === 6 ? 'block' : 'hidden'}>
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
            <div className="mt-6 flex min-h-0 flex-1 gap-2 overflow-hidden">
              <div className="flex min-h-0 flex-1 justify-center">
                <ChatWindowSection
                  complaintId={complaintId}
                  mode={chatMode}
                  initialAiSessionId={initialAiSessionIdFromState ?? null}
                  onComplete={() => setIsChatCompleted(true)}
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

              <aside className="rounded-200 bg-neutral-0 mt-6 h-[630px] w-[340px] border border-neutral-200 p-4">
                <h2 className="text-body-2-bold mb-2">AI가 찾은 핵심 키워드</h2>
                <p className="text-body-3-regular mb-4 text-neutral-700">
                  {ragKeyword
                    ? `"${ragKeyword}"`
                    : '사건 개요를 입력하면, AI가 핵심 키워드를 분석해서 보여드려요.'}
                </p>

                {ragKeyword && (
                  <>
                    <h3 className="text-body-3-bold mb-1">검색 기준</h3>
                    <p className="text-caption-regular mb-3 text-neutral-600">
                      유사 판례는 "{ragKeyword}"를 중심으로 검색했어요.
                    </p>
                  </>
                )}

                <h3 className="text-body-3-bold mb-2">유사 판례</h3>

                {ragCases.length === 0 ? (
                  <p className="text-caption-regular text-neutral-500">
                    아직 불러온 판례가 없어요. 사건 개요를 입력하면 관련 판례를 보여드릴게요.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {ragCases.map((c, idx) => (
                      <li
                        key={c.case_no || idx}
                        className="rounded-200 h-48 overflow-y-auto border border-neutral-200 bg-neutral-50 px-3 py-2"
                      >
                        <p className="text-body-4-bold text-neutral-800">{c.label}</p>
                        <p className="text-caption-regular mt-0.5 text-neutral-600">
                          사건번호: {c.case_no}
                        </p>
                        <div className="text-caption-regular mt-2 flex flex-col gap-1 whitespace-pre-line text-neutral-700">
                          <p>
                            <span className="font-semibold text-neutral-800">사건 개요</span>{' '}
                            {c.summary}
                          </p>
                          <p>
                            <span className="font-semibold text-neutral-800">판결 요지</span>{' '}
                            {c.result}
                          </p>
                          <p>
                            <span className="font-semibold text-neutral-800">
                              내 사건과의 유사점
                            </span>{' '}
                            {c.similarity}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
            </div>
          )}
        {/* 9: 완성된 고소장 미리보기 */}
        {typeof complaintId === 'number' &&
          Number.isFinite(complaintId) &&
          complaintId > 0 &&
          step === 9 &&
          generatedComplaint && (
            <ComplaintPreviewSection
              complaintId={complaintId}
              content={generatedComplaint}
            />
          )}
        {/* 10: DOCX 다운로드 섹션 */}
        {typeof complaintId === 'number' &&
          Number.isFinite(complaintId) &&
          complaintId > 0 &&
          step === 10 && <ComplaintDownloadSection complaintId={complaintId} />}
        <WizardNavButtons
          onPrev={prev}
          onNext={handleNext}
          isNextDisabled={isGenerating || (step === 8 && !isChatCompleted)}
          disablePrev={step === 0 || step === 4}
          nextLabel={
            step === 10 ? '종료' : step === 8 && isGenerating ? '고소장 작성 중...' : '다음'
          }
        />
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
