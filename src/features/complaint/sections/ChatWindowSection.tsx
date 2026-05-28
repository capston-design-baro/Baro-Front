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

type Msg = {
  id: string;
  side: Side; // 'left' | 'right'
  text: string;
  time: string;
  reason?: string | null;
};

type Phase = 'askSummary' | 'initializing' | 'chatting';

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

  // 이어쓰기는 바로 chatting, 새 작성은 askSummary
  const [phase, setPhase] = useState<Phase>(mode === 'resume' ? 'chatting' : 'askSummary');

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  /** 🟢 새 세션: 사건 개요 안내 메시지 */
  useEffect(() => {
    if (mode !== 'new') return;
    if (phase !== 'askSummary') return;

    setMsgs([
      {
        id: `intro-${Date.now()}`,
        side: 'left',
        text: '먼저 사건의 경위를 자유롭게 작성해 주세요.',
        time: fmtTime(),
      },
    ]);
  }, [mode, phase]);

  /** 🟣 이어쓰기 모드: 히스토리 로드 + 메타 복원 */
  useEffect(() => {
    if (mode !== 'resume') return;
    if (!complaintId) return;

    const loadHistory = async () => {
      try {
        const history: ChatMessageHistoryItem[] = await getChatHistory(complaintId);

        if (!history || history.length === 0) {
          setMsgs([
            {
              id: `resume-${Date.now()}`,
              side: 'left',
              text: '사건 개요를 입력해주세요.',
              time: fmtTime(),
            },
          ]);
        } else {
          const restored: Msg[] = [];
          let lastMeta: ChatMetaPayload | undefined;

          history.forEach((msg, idx) => {
            if (isAiMetaMessage(msg.content)) {
              lastMeta = msg.content; // 여기서 content가 ChatMetaPayload로 좁혀짐
              return;
            }

            const text =
              typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);

            restored.push({
              id: `hist-${idx}`,
              side: msg.role === 'assistant' ? 'left' : 'right',
              text,
              time: fmtTime(new Date(msg.created_at)),
              reason: msg.reason ?? null,
            });
          });

          const last = history[history.length - 1];
          if (last && last.role === 'user') {
            restored.push({
              id: `resume-hint-${Date.now()}`,
              side: 'left',
              text: '이전 질문에 대한 답변을 다시 작성해 주세요.',
              time: fmtTime(),
            });
          }

          setMsgs(restored);

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
              offense: lastMeta.offense ?? '',
              rag_keyword: lastMeta.rag_keyword ?? null,
              rag_cases: lastMeta.rag_cases ?? [],
            });
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

        // 사건 개요 기반 세션 초기화 (백엔드 /complaints/{id}/chat/init)
        const { session_id, offense, rag_keyword, rag_cases } = await initChatSession(
          complaintId,
          text,
        );

        // 생성된 세션 ID를 로컬 상태에 저장
        setAiSessionId(session_id);
        onReady?.(session_id);

        // 오른쪽 판례 패널 메타 정보 전달
        onInitMeta?.({
          offense: offense ?? '',
          rag_keyword: rag_keyword ?? null,
          rag_cases: rag_cases ?? [],
        });

        // 키워드 안내 문구
        const keywordText = rag_keyword
          ? `입력해주신 내용으로 추정한 결과 "${rag_keyword}"죄로 추정됩니다. "${rag_keyword}"죄로 고소장 작성을 도와드릴게요.`
          : '입력해주신 내용을 바탕으로 사건을 분류했어요. 이어서 몇 가지 질문을 드릴게요.';

        const keywordMsg: Msg = {
          id: `offense-${Date.now()}`,
          side: 'left',
          text: keywordText,
          time: fmtTime(),
        };

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
          text: reply || '사건에 대해 조금 더 자세히 알려주세요.',
          time: fmtTime(),
        };

        setMsgs((prev) => {
          const nextMsgs = [...prev, keywordMsg, ...(firstQuestionMsg ? [firstQuestionMsg] : [])];

          if (isDoneReply) {
            const guideMsg: Msg = {
              id: `done-guide-${Date.now()}`,
              side: 'left',
              text: '화면 오른쪽 아래의 "다음" 버튼을 눌러, AI가 작성한 고소장 초안을 확인해 주세요.',
              time: fmtTime(),
            };
            nextMsgs.push(guideMsg);
          }

          return nextMsgs;
        });

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
        text: reply,
        time: fmtTime(),
      };

      const isDoneReply = reply.includes(DONE_PHRASE);

      setMsgs((prev) => {
        const nextMsgs = [...prev, botMsg];

        if (isDoneReply) {
          const guideMsg: Msg = {
            id: `done-guide-${Date.now()}`,
            side: 'left',
            text: '화면 오른쪽 아래의 "다음" 버튼을 눌러, AI가 작성한 고소장 초안을 미리보기로 확인해 주세요.',
            time: fmtTime(),
          };
          nextMsgs.push(guideMsg);
        }

        return nextMsgs;
      });

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

  const inputDisabled = phase === 'initializing' || isCompleted;

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
              mode === 'new' && phase === 'askSummary'
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
