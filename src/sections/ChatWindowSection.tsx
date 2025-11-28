// src/sections/ChatWindowSection.tsx
import {
  type ChatMessageHistoryItem,
  getChatHistory,
  getMyComplaints,
  initChatSession,
  sendChat,
} from '@/apis/complaints';
import type { RagCase } from '@/apis/complaints';
import { ChatBubble } from '@/components/ChatBubble';
import type { Side } from '@/types/side';
import type { AxiosError } from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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

const ChatWindowSection: React.FC<Props> = ({
  complaintId,
  onReady,
  onComplete,
  onInitMeta,
  mode = 'new',
  initialAiSessionId = null,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  const [aiSessionId, setAiSessionId] = useState<string | null>(
    mode === 'resume' ? initialAiSessionId : null,
  );
  const [phase, setPhase] = useState<Phase>(
    mode === 'resume' && initialAiSessionId ? 'chatting' : 'askSummary',
  );

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  /** 🟢 새 세션: 사건 개요 안내 메시지 */
  useEffect(() => {
    if (mode === 'resume') return;
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

  /** 🟣 이어쓰기 모드: 히스토리 로드 */
  useEffect(() => {
    if (mode !== 'resume') return;
    if (!complaintId) return; // ✅ complaintId만 있으면 히스토리 호출 가능

    const loadHistory = async () => {
      try {
        const history: ChatMessageHistoryItem[] = await getChatHistory(complaintId);

        if (!history || history.length === 0) {
          setMsgs([
            {
              id: `resume-${Date.now()}`,
              side: 'left',
              text: '이전에 작성하시던 고소장 상담을 이어서 도와드릴게요.',
              time: fmtTime(),
            },
          ]);
        } else {
          const restored: Msg[] = history.map((msg, idx) => ({
            id: `hist-${idx}`,
            side: msg.role === 'assistant' ? 'left' : 'right',
            text: msg.content,
            time: fmtTime(new Date(msg.created_at)),
            reason: msg.reason ?? null,
          }));

          setMsgs(restored);
        }

        // 🔹 세션 ID는 있으면 세팅, 없으면 일단 채팅 모드로만 전환
        if (initialAiSessionId) {
          setAiSessionId(initialAiSessionId);
          setPhase('chatting');
          onReady?.(initialAiSessionId);
        } else {
          setPhase('chatting');
        }
      } catch (e) {
        console.error('히스토리 로드 실패:', e);
      }
    };

    void loadHistory();
  }, [mode, complaintId, initialAiSessionId, onReady]);

  /**
   * 🟣 이어쓰기 모드: location.state 에 aiSessionId가 없을 수도 있으므로
   * 백엔드 목록에서 해당 complaint의 ai_session_id를 다시 가져와서 복구
   */
  useEffect(() => {
    if (mode !== 'resume') return;
    if (aiSessionId) return; // 이미 있으면 스킵
    if (!complaintId) return;

    const fetchSessionId = async () => {
      try {
        const list = await getMyComplaints();
        const target = list.find((c) => c.id === complaintId);

        if (target && target.ai_session_id) {
          setAiSessionId(target.ai_session_id);
          setPhase('chatting');
          onReady?.(target.ai_session_id);
        }
      } catch (e) {
        console.error('ai_session_id 복구 실패:', e);
      }
    };

    void fetchSessionId();
  }, [mode, complaintId, aiSessionId, onReady]);

  /** 스크롤 항상 아래로 */
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs.length]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    if (isCompleted) return;

    /** 1) 새 세션: 사건 개요 입력 → initChatSession */
    if (mode === 'new' && phase === 'askSummary') {
      const userMsg: Msg = {
        id: `u-summary-${Date.now()}`,
        side: 'right',
        text,
        time: fmtTime(),
      };
      setMsgs((prev) => [...prev, userMsg]);
      setInput('');

      setPhase('initializing');
      setIsBotTyping(true);

      try {
        const { session_id, offense, rag_keyword, rag_cases } = await initChatSession(
          complaintId,
          text,
        );

        console.log('✅ Chat init meta:', { session_id, offense, rag_keyword, rag_cases });

        setAiSessionId(session_id);
        onReady?.(session_id);

        onInitMeta?.({
          offense: offense ?? '',
          rag_keyword: rag_keyword ?? null,
          rag_cases: rag_cases ?? [],
        });

        const keywordText = rag_keyword
          ? `입력해주신 내용에서 "${rag_keyword}"를(을) 핵심 키워드로 인식했어요. 이 키워드를 중심으로 사건을 분류하고, 이어서 몇 가지 질문을 드릴게요.`
          : '입력해주신 내용을 바탕으로 사건을 분류했어요. 이어서 몇 가지 질문을 드릴게요.';

        const keywordMsg: Msg = {
          id: `offense-${Date.now()}`,
          side: 'left',
          text: keywordText,
          time: fmtTime(),
        };

        const { reply } = await sendChat(
          complaintId,
          session_id,
          '위 사건 개요를 기반으로, 고소장 작성을 위해 필요한 정보를 단계적으로 질문해 주세요.',
        );

        const firstQuestion: Msg = {
          id: `q-first-${Date.now()}`,
          side: 'left',
          text: reply || '사건에 대해 조금 더 자세히 알려주세요.',
          time: fmtTime(),
        };

        setMsgs((prev) => [...prev, keywordMsg, firstQuestion]);
        setPhase('chatting');
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

        setPhase('askSummary');
      } finally {
        setIsBotTyping(false);
      }

      return;
    }

    /** 2) 이어쓰기 / 일반 공통: 이미 세션 있는 상태에서 채팅 */
    if (phase !== 'chatting') {
      console.warn('전송 불가: phase가 chatting이 아님', { phase, mode });
      return;
    }

    if (!aiSessionId) {
      // ❗ 조용히 return 하지 말고 사용자한테 알려주기
      setMsgs((prev) => [
        ...prev,
        {
          id: `err-no-session-${Date.now()}`,
          side: 'left',
          text:
            '이 고소장은 아직 AI 세션 정보가 없어, 이어서 채팅을 진행할 수 없어요.\n' +
            '새 고소장 작성으로 다시 시작해 주세요.',
          time: fmtTime(),
        },
      ]);
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

    try {
      setIsBotTyping(true);

      const { reply } = await sendChat(complaintId, aiSessionId, text);

      const botMsg: Msg = {
        id: `r-${Date.now()}`,
        side: 'left',
        text: reply,
        time: fmtTime(),
      };

      const donePhrase = '필수 정보가 충족되었습니다. 고소장을 작성해드릴게요.';
      const isDoneReply = reply.includes(donePhrase);

      setMsgs((prev) => {
        const nextMsgs = [...prev, botMsg];

        if (isDoneReply) {
          const guideMsg: Msg = {
            id: `done-guide-${Date.now()}`,
            side: 'left',
            text: '필수 정보가 모두 확인되었어요. 이제 화면 오른쪽 아래의 "다음" 버튼을 눌러, AI가 작성한 고소장 초안을 미리보기로 확인해 주세요.',
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
  }, [mode, phase, aiSessionId, input, complaintId, isCompleted, onComplete, onInitMeta]);

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
        'flex flex-col items-center justify-between',
        'mx-auto h-[680px] w-full max-w-[1000px]',
        'bg-neutral-0 pt-6 pb-6',
      ].join(' ')}
    >
      <div
        ref={listRef}
        className={[
          'flex min-h-0 w-full flex-1 flex-col',
          'max-w-[720px]',
          'rounded-200 bg-neutral-0 overflow-y-auto border border-gray-300',
          'px-6 py-3',
        ].join(' ')}
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

      <div
        className={[
          'mt-4 flex h-12 w-full max-w-[720px] items-center justify-between',
          'rounded-200 bg-neutral-0 border border-blue-400',
          'px-5 py-2.5',
        ].join(' ')}
        aria-label="채팅 입력 영역"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            mode === 'new' && phase === 'askSummary'
              ? '사건의 경위를 자유롭게 입력해 주세요.'
              : '여기에 입력하고 Enter로 전송하세요. (줄바꿈은 Shift+Enter)'
          }
          rows={1}
          aria-label="메시지 입력"
          disabled={inputDisabled}
          className={[
            'flex-1 resize-none text-left',
            'text-detail-regular leading-9',
            'text-neutral-700 placeholder:text-neutral-500',
            'focus:outline-none disabled:opacity-50',
          ].join(' ')}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={inputDisabled || !input.trim()}
          className={[
            'flex h-9 items-center justify-center',
            'rounded-400 border-primary-400 bg-primary-50 border-2',
            'text-body-3-bold text-primary-400',
            'px-3 disabled:opacity-40',
          ].join(' ')}
        >
          전송
        </button>
      </div>
    </section>
  );
};

export default ChatWindowSection;
