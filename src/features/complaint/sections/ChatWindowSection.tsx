import type { AxiosError } from 'axios';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { ChatMetaPayload, RagCase } from '@/features/complaint/apis/complaints';
import {
  type ChatMessageHistoryItem,
  getChatHistory,
  getMyComplaints,
  initChatSession,
  sendChat,
} from '@/features/complaint/apis/complaints';
import { ChatBubble } from '@/features/complaint/components/ChatBubble';
import type { Side } from '@/features/complaint/components/chat/types/side';
import {
  CRIMINAL_CATEGORIES,
  type CrimeCategory,
  type CrimeSubcategory,
  type SavedOffenseSelection,
  loadSelectedOffense,
  saveSelectedOffense,
} from '@/features/complaint/constants/criminalCrimes';

type Msg = {
  id: string;
  side: Side; // 'left' | 'right'
  text: string;
  time: string;
  reason?: string | null;
};

/**
 * selecting  : 사용자가 죄목을 직접 선택하는 단계 (칩 선택)
 * askSummary : 선택한 죄목 기준으로 사건 경위를 자유 서술하는 단계
 * initializing/chatting : 기존 AI 대화 단계
 */
type Phase = 'selecting' | 'askSummary' | 'initializing' | 'chatting';

/** 죄목 선택 세부 단계 */
type SelectStep = 'category' | 'subcategory' | 'confirm';

type Props = {
  complaintId: number;
  onReady?: (aiSessionId: string) => void;
  onInitStart?: () => void;
  onComplete?: () => void;
  onInitMeta?: (meta: {
    offense: string;
    rag_keyword: string | null;
    rag_cases: RagCase[];
  }) => void;

  /** 🔹 이어쓰기 모드용 */
  mode?: 'new' | 'resume';
  initialAiSessionId?: string | null;
};

function fmtTime(d = new Date()) {
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

/** history.content가 메타 객체인지 판별하는 타입가드 */
function isAiMetaMessage(content: ChatMessageHistoryItem['content']): content is ChatMetaPayload {
  if (typeof content !== 'object' || content === null) return false;

  const c = content as ChatMetaPayload;

  return (
    typeof c.offense !== 'undefined' ||
    typeof c.rag_keyword !== 'undefined' ||
    typeof c.rag_cases !== 'undefined'
  );
}

const DONE_PHRASE = '필수 정보가 충족되었습니다. 고소장을 작성해드릴게요.';

/**
 * 백엔드가 보내는 완료 멘트("...고소장을 작성해드릴게요")는 "대행" 뉘앙스라
 * 감지는 원문(DONE_PHRASE)으로 그대로 하되, 화면에 보여줄 때만 안전한 문구로 치환한다.
 */
const DONE_PHRASE_DISPLAY =
  '필수 정보가 모두 모였어요. 다음 단계에서 고소장 초안을 정리해 드릴게요.';

function toDisplayText(text: string): string {
  return text.includes(DONE_PHRASE) ? text.split(DONE_PHRASE).join(DONE_PHRASE_DISPLAY) : text;
}

/** 이어쓰기 인트로 문구 (선택한 죄목이 있으면 반영) */
function buildResumeIntro(saved: SavedOffenseSelection | null) {
  if (saved) {
    return `안녕하세요, 바로예요 👋\n\n이어서 작성을 도와드릴게요.\n지난번에 '${saved.offense}' 유형으로 진행하고 계셨어요.`;
  }
  return '안녕하세요, 바로예요 👋\n\n이어서 작성을 도와드릴게요.\n어떤 일이 있었는지 이어서 알려주세요.';
}

/** 이어쓰기 시 보여줄 "선택한 유형" 요약 문구 */
function buildSelectionRecap(saved: SavedOffenseSelection) {
  return `📌 선택하신 유형: ${saved.category} › ${saved.offense}`;
}

/** 사건 경위 입력을 유도하는 안내 문구 */
const CASE_SUMMARY_ASK =
  '어떤 일이 있었는지 알려주세요.\n언제, 어디서, 누구에게, 어떤 피해를 입었는지 자세히 적어주시면 고소장 작성에 큰 도움이 돼요.';

const ChatWindowSection: React.FC<Props> = ({
  complaintId,
  onReady,
  onInitStart,
  onComplete,
  onInitMeta,
  mode = 'new',
  initialAiSessionId = null,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '24px';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const [aiSessionId, setAiSessionId] = useState<string | null>(
    mode === 'resume' ? initialAiSessionId : null,
  );

  // 이어쓰기는 바로 chatting, 새 작성은 죄목 선택(selecting)부터
  const [phase, setPhase] = useState<Phase>(mode === 'resume' ? 'chatting' : 'selecting');

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // 🟢 죄목 직접 선택 상태 (new 모드 전용)
  const [selectStep, setSelectStep] = useState<SelectStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<CrimeCategory | null>(null);
  const [selectedOffense, setSelectedOffense] = useState<CrimeSubcategory | null>(null);

  /** 🟢 새 세션: 죄목 선택 안내 메시지 */
  useEffect(() => {
    if (mode !== 'new') return;
    if (phase !== 'selecting') return;

    setMsgs([
      {
        id: `intro-${Date.now()}`,
        side: 'left',
        text: '안녕하세요, 바로예요 👋\n\n먼저 어떤 종류의 피해를 겪으셨는지 골라주세요. 가장 가까운 유형을 선택하시면 돼요.\n\n정확한 죄명은 수사기관·법원이 판단하니, 비슷한 유형을 고르셔도 괜찮아요.',
        time: fmtTime(),
      },
    ]);
    // 선택 상태 초기화
    setSelectStep('category');
    setSelectedCategory(null);
    setSelectedOffense(null);
    // 최초 1회만 안내 (phase는 selecting으로 고정 시작)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  /** 🟣 이어쓰기 모드: 히스토리 로드 + 메타 복원 */
  useEffect(() => {
    if (mode !== 'resume') return;
    if (!complaintId) return;

    // 선택했던 죄목 복원 (AI 세션 이전에 고른 값이라 백엔드 히스토리엔 없음)
    const saved = loadSelectedOffense(complaintId);

    const introMsgs = (): Msg[] => [
      {
        id: `intro-${Date.now()}`,
        side: 'left',
        text: buildResumeIntro(saved),
        time: fmtTime(),
      },
      ...(saved
        ? [
            {
              id: `recap-${Date.now()}`,
              side: 'left' as Side,
              text: buildSelectionRecap(saved),
              time: fmtTime(),
            },
          ]
        : []),
    ];

    // 사건 경위 입력 유도 메시지
    const caseSummaryMsg = (): Msg => ({
      id: `summary-ask-${Date.now()}`,
      side: 'left',
      text: CASE_SUMMARY_ASK,
      time: fmtTime(),
    });

    const loadHistory = async () => {
      try {
        const history: ChatMessageHistoryItem[] = await getChatHistory(complaintId);

        if (!history || history.length === 0) {
          // 히스토리도 없고 ai_session_id도 없으면 사건 경위 입력 단계로
          if (!initialAiSessionId) {
            setPhase('askSummary');
          }
          // AI 질문 내역이 없으니 사건 경위 입력을 한 번 더 안내
          setMsgs([...introMsgs(), caseSummaryMsg()]);
        } else {
          const restored: Msg[] = [];
          let lastMeta: ChatMetaPayload | undefined;

          const AUTO_MSG = '위 사건 개요를 기반으로, 이어서 질문을 해 주세요.';

          history.forEach((msg, idx) => {
            if (isAiMetaMessage(msg.content)) {
              lastMeta = msg.content;
              return;
            }

            // 자동 발송 메시지는 히스토리에서 숨김
            if (typeof msg.content === 'string' && msg.content === AUTO_MSG) {
              return;
            }

            const text =
              typeof msg.content === 'string'
                ? toDisplayText(msg.content)
                : JSON.stringify(msg.content);

            restored.push({
              id: `hist-${idx}`,
              side: msg.role === 'assistant' ? 'left' : 'right',
              text,
              time: fmtTime(new Date(msg.created_at)),
              reason: msg.reason ?? null,
            });
          });

          // 백엔드 히스토리에 실제 AI 질문이 있었는지 확인
          const hasAiQuestion = history.some(
            (msg) =>
              msg.role === 'assistant' &&
              typeof msg.content === 'string' &&
              msg.content !== AUTO_MSG,
          );

          // AI 질문이 있었고 마지막이 사용자 답변이면, 이어서 답변하도록 안내
          const last = history[history.length - 1];
          if (hasAiQuestion && last && last.role === 'user') {
            restored.push({
              id: `resume-hint-${Date.now()}`,
              side: 'left',
              text: '이전 질문에 대한 답변을 다시 작성해 주세요.',
              time: fmtTime(),
            });
          }

          // 맨 위에 인트로 + 선택 유형 요약, AI 질문이 없으면 사건 경위 안내를 마지막에 추가
          setMsgs([...introMsgs(), ...restored, ...(hasAiQuestion ? [] : [caseSummaryMsg()])]);

          // 히스토리 안에 DONE_PHRASE가 있으면 완료 상태로 취급
          const hasDone = history.some(
            (msg) =>
              msg.role === 'assistant' &&
              typeof msg.content === 'string' &&
              msg.content.includes(DONE_PHRASE),
          );

          if (hasDone) {
            setIsCompleted(true);
            onComplete?.(); // 부모(ComplaintWizardPage)의 isChatCompleted = true
          }

          if (lastMeta) {
            onInitMeta?.({
              // 죄목 라벨은 사용자가 고른 값을 우선 사용
              offense: saved?.offense || lastMeta.offense || '',
              rag_keyword: lastMeta.rag_keyword ?? null,
              rag_cases: lastMeta.rag_cases ?? [],
            });
          } else if (saved) {
            onInitMeta?.({ offense: saved.offense, rag_keyword: null, rag_cases: [] });
          }
        }

        if (initialAiSessionId) {
          setAiSessionId(initialAiSessionId);
        }
      } catch (e) {
        console.error('히스토리 로드 실패:', e);
      }
    };

    void loadHistory();

    // 🔴 onInitMeta 제거
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, complaintId, initialAiSessionId]);

  /**
   * 🟣 이어쓰기 모드: location.state에 aiSessionId가 없을 수도 있으므로
   * 목록에서 다시 복구
   */
  useEffect(() => {
    if (mode !== 'resume') return;
    if (aiSessionId) return;
    if (!complaintId) return;

    const fetchSessionId = async () => {
      try {
        const list = await getMyComplaints();
        const target = list.find((c) => c.id === complaintId);

        if (target && target.ai_session_id) {
          setAiSessionId(target.ai_session_id);
        }
      } catch (e) {
        console.error('ai_session_id 복구 실패:', e);
      }
    };

    void fetchSessionId();
  }, [mode, complaintId, aiSessionId]);

  /** 스크롤 항상 아래로 */
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs.length]);

  /** 대화 버블 추가 헬퍼 */
  const appendMsg = useCallback((side: Side, text: string) => {
    setMsgs((prev) => [
      ...prev,
      {
        id: `${side}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        side,
        text,
        time: fmtTime(),
      },
    ]);
  }, []);

  /** 큰 카테고리 선택 → 세부 죄목 단계로 */
  const handleSelectCategory = useCallback(
    (category: CrimeCategory) => {
      appendMsg('right', category.name);
      appendMsg('left', '좀 더 구체적으로는 어떤 상황에 가까운가요?');
      setSelectedCategory(category);
      setSelectStep('subcategory');
    },
    [appendMsg],
  );

  /** 세부 죄목 선택 → 설명 보여주고 확인 단계로 */
  const handleSelectSubcategory = useCallback(
    (offense: CrimeSubcategory) => {
      appendMsg('right', offense.name);
      appendMsg(
        'left',
        `${offense.name}는 이런 경우예요 👇\n\n${offense.description}\n\n이 유형으로 고소장 작성을 도와드릴까요?`,
      );
      setSelectedOffense(offense);
      setSelectStep('confirm');
    },
    [appendMsg],
  );

  /** 죄목 확정 → 사건 경위 입력(askSummary) 단계로 */
  const handleConfirmOffense = useCallback(() => {
    // 이어쓰기 복원을 위해 선택한 죄목을 보관
    if (selectedCategory && selectedOffense) {
      saveSelectedOffense(complaintId, {
        category: selectedCategory.name,
        offense: selectedOffense.name,
      });
    }

    appendMsg('right', '네, 맞아요');
    appendMsg(
      'left',
      '좋아요! 이제 어떤 일이 있었는지 알려주세요.\n언제, 어디서, 누구에게, 어떤 피해를 입었는지 자세히 적어주시면 고소장 작성에 큰 도움이 돼요.',
    );
    setPhase('askSummary');
  }, [appendMsg, complaintId, selectedCategory, selectedOffense]);

  /** 다른 유형 다시 고르기 → 카테고리 단계로 */
  const handleRetrySelection = useCallback(() => {
    appendMsg('right', '다른 유형을 볼게요');
    appendMsg('left', '어떤 종류의 피해에 가까운가요? 다시 골라주세요.');
    setSelectedCategory(null);
    setSelectedOffense(null);
    setSelectStep('category');
  }, [appendMsg]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    if (isCompleted) return;

    /**
     * 🟢 공통 1단계: 세션이 아직 없는 경우 (new / resume 모두 공통)
     *
     *  - 새 작성(new) + 요약 단계
     *  - 이어쓰기(resume)인데 DB에 ai_session_id가 없어서 처음으로 AI를 쓰는 경우
     *
     *  => 이 분기에서 initChatSession을 호출해서 "새 세션"을 만듦
     */
    if (!aiSessionId) {
      const userMsg: Msg = {
        id: `u-summary-${Date.now()}`,
        side: 'right',
        text,
        time: fmtTime(),
      };

      setMsgs((prev) => [...prev, userMsg]);
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = '24px';

      setPhase('initializing');
      setIsBotTyping(true);

      try {
        onInitStart?.();

        // 선택한 죄목: 현재 선택값 우선, 없으면(이어쓰기 등) 저장된 값으로 폴백
        const offenseName =
          selectedOffense?.name ?? loadSelectedOffense(complaintId)?.offense ?? '';

        // 사건 개요 기반 세션 초기화 (백엔드 /complaints/{id}/chat/init)
        // 죄목은 AI가 판단하지 않고, 사용자가 직접 선택한 값을 전달한다.
        const { session_id, rag_keyword, rag_cases } = await initChatSession(
          complaintId,
          text,
          offenseName || undefined,
        );

        // 생성된 세션 ID를 로컬 상태에 저장
        setAiSessionId(session_id);
        onReady?.(session_id);

        // 오른쪽 판례 패널 메타 정보 전달
        // offense는 사용자가 직접 고른 죄목을 사용하고, 판례는 백엔드 결과를 참고자료로 둔다.
        onInitMeta?.({
          offense: offenseName,
          rag_keyword: rag_keyword ?? null,
          rag_cases: rag_cases ?? [],
        });

        let firstQuestionMsg: Msg | null = null;
        let isDoneReply = false;

        // 새 세션이 열렸으니, 첫 질문을 한 번 던져서 대화 흐름 시작
        const { reply } = await sendChat(
          complaintId,
          session_id,
          '위 사건 개요를 기반으로, 이어서 질문을 해 주세요.',
        );

        isDoneReply = reply.includes(DONE_PHRASE);

        firstQuestionMsg = {
          id: `q-first-${Date.now()}`,
          side: 'left',
          text: toDisplayText(reply) || '사건에 대해 조금 더 자세히 알려주세요.',
          time: fmtTime(),
        };

        setMsgs((prev) => [...prev, ...(firstQuestionMsg ? [firstQuestionMsg] : [])]);

        setPhase('chatting');

        if (isDoneReply) {
          setIsCompleted(true);
          onComplete?.();
        }
      } catch (e) {
        const err = e as AxiosError<{ detail?: string }>;
        const detail = err.response?.data?.detail;

        console.error('initChatSession error', err.response?.data || err);

        setMsgs((prev) => [
          ...prev,
          {
            id: `err-init-${Date.now()}`,
            side: 'left',
            text:
              'AI 세션 초기화에 실패했어요. 잠시 후 다시 시도해 주세요.' +
              (detail ? `\n\n(상세: ${detail})` : ''),
            time: fmtTime(),
          },
        ]);

        // 실패하면 다시 요약 입력 단계로
        setPhase('askSummary');
      } finally {
        setIsBotTyping(false);
      }

      return;
    }

    /**
     * 🟣 공통 2단계: 이미 세션이 있는 상태에서의 일반 대화
     *
     *  - new 모드든 resume 모드든, aiSessionId가 존재하면 여기로 옴
     */
    if (phase !== 'chatting') {
      console.warn('전송 불가: phase가 chatting이 아님', { phase, mode });
      return;
    }

    const userMsg: Msg = {
      id: `m-${Date.now()}`,
      side: 'right',
      text,
      time: fmtTime(),
    };
    setMsgs((prev) => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = '24px';

    try {
      setIsBotTyping(true);

      const { reply } = await sendChat(complaintId, aiSessionId, text);

      const botMsg: Msg = {
        id: `r-${Date.now()}`,
        side: 'left',
        text: toDisplayText(reply),
        time: fmtTime(),
      };

      const isDoneReply = reply.includes(DONE_PHRASE);

      setMsgs((prev) => [...prev, botMsg]);

      if (isDoneReply) {
        setIsCompleted(true);
        onComplete?.();
      }
    } catch {
      setMsgs((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          side: 'left',
          text: '서버 통신에 실패했어요. 다시 시도해 주세요.',
          time: fmtTime(),
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  }, [
    input,
    isCompleted,
    aiSessionId,
    phase,
    mode,
    complaintId,
    selectedOffense,
    onInitStart,
    onReady,
    onInitMeta,
    onComplete,
  ]);

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const inputDisabled =
    phase === 'selecting' || phase === 'initializing' || isCompleted || isBotTyping;

  return (
    <section
      className={[
        'flex flex-col',
        'min-h-0 w-full flex-1 overflow-hidden',
        'rounded-2xl border border-neutral-200 bg-neutral-50 shadow-sm',
      ].join(' ')}
    >
      {/* 채팅 헤더 */}
      <div className="flex items-center gap-3 border-b border-neutral-200 bg-white px-6 py-3">
        <div className="bg-primary-400 flex h-8 w-8 items-center justify-center rounded-full">
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: '18px' }}
          >
            smart_toy
          </span>
        </div>
        <div>
          <p className="text-body-3-bold text-neutral-800">바로 AI</p>
          <p className="text-detail-regular text-neutral-400">
            {isBotTyping ? '입력 중...' : '고소장 작성 도우미'}
          </p>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div
        ref={listRef}
        className="balaw-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6"
        role="list"
        aria-label="채팅 메시지"
      >
        {msgs.map((m) => (
          <ChatBubble
            key={m.id}
            side={m.side}
            text={m.text}
            time={m.time}
            srLabel={`${m.side === 'left' ? '바로' : '사용자'} 메시지`}
          />
        ))}
        {isBotTyping && (
          <ChatBubble
            side="left"
            text="..."
            time={fmtTime()}
            srLabel="바로가 입력 중입니다."
            isTyping
          />
        )}
      </div>

      {/* 죄목 선택 칩 영역 (selecting 단계 전용) */}
      {phase === 'selecting' && (
        <div className="border-t border-neutral-200 bg-white px-4 py-3 md:px-6">
          {selectStep === 'category' && (
            <div className="flex flex-wrap gap-2">
              {CRIMINAL_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleSelectCategory(category)}
                  className="text-body-3-regular hover:border-primary-400 hover:bg-primary-50 hover:text-primary-500 rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-700 transition-colors active:scale-95"
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {selectStep === 'subcategory' && selectedCategory && (
            <div className="flex flex-wrap gap-2">
              {selectedCategory.children.map((offense) => (
                <button
                  key={offense.id}
                  type="button"
                  onClick={() => handleSelectSubcategory(offense)}
                  className="text-body-3-regular hover:border-primary-400 hover:bg-primary-50 hover:text-primary-500 rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-700 transition-colors active:scale-95"
                >
                  {offense.name}
                </button>
              ))}
              <button
                type="button"
                onClick={handleRetrySelection}
                className="text-body-3-regular rounded-full border border-neutral-200 bg-white px-4 py-2 text-neutral-400 transition-colors hover:text-neutral-600 active:scale-95"
              >
                ← 처음으로
              </button>
            </div>
          )}

          {selectStep === 'confirm' && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleConfirmOffense}
                className="text-body-3-bold bg-primary-400 hover:bg-primary-500 rounded-full px-5 py-2 text-white transition-colors active:scale-95"
              >
                네, 맞아요
              </button>
              <button
                type="button"
                onClick={handleRetrySelection}
                className="text-body-3-regular rounded-full border border-neutral-300 bg-neutral-50 px-5 py-2 text-neutral-600 transition-colors hover:bg-neutral-100 active:scale-95"
              >
                다른 유형 볼게요
              </button>
            </div>
          )}
        </div>
      )}

      {/* 입력 영역 */}
      <div className="border-t border-neutral-200 bg-white px-4 py-3 md:px-6">
        <div
          className={[
            'flex items-end gap-2',
            input.length > 60 || input.includes(' ') ? 'rounded-2xl' : 'rounded-full',
            'border border-neutral-300 bg-neutral-50',
            'px-4 py-2',
            'focus-within:border-primary-400 focus-within:ring-primary-400/20 focus-within:ring-2',
            'transition-all',
          ].join(' ')}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              resizeTextarea();
            }}
            onInput={resizeTextarea}
            onKeyDown={onKeyDown}
            placeholder={
              phase === 'selecting'
                ? '위에서 피해 유형을 선택해 주세요...'
                : isBotTyping
                  ? '바로가 입력 중이에요...'
                  : mode === 'new' && phase === 'askSummary'
                    ? '사건의 경위를 자유롭게 입력해 주세요...'
                    : '메시지를 입력해주세요...'
            }
            rows={1}
            aria-label="메시지 입력"
            disabled={inputDisabled}
            className={[
              'flex-1 resize-none bg-transparent',
              'text-body-3-regular leading-relaxed',
              'text-neutral-800 placeholder:text-neutral-400',
              'focus:outline-none disabled:opacity-50',
              'h-[24px] max-h-[120px] overflow-y-auto',
            ].join(' ')}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={inputDisabled || !input.trim()}
            className={[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
              'transition-all duration-200',
              inputDisabled || !input.trim()
                ? 'bg-neutral-200 text-neutral-400'
                : 'bg-primary-400 hover:bg-primary-500 text-white active:scale-95',
            ].join(' ')}
            aria-label="전송"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '18px' }}
            >
              arrow_upward
            </span>
          </button>
        </div>
        <p className="text-detail-regular mt-1.5 text-center text-neutral-400">
          Enter로 전송 · Shift+Enter로 줄바꿈
        </p>
      </div>
    </section>
  );
};

export default ChatWindowSection;
