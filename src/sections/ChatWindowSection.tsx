// src/sections/ChatWindowSection.tsx
import { sendChat, startAiSession } from '@/apis/complaints';
import { ChatBubble } from '@/components/Chat/bubble/ChatBubble';
import type { Side } from '@/types/side';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type Msg = {
  id: string;
  side: Side; // 'left' | 'right'
  text: string;
  time: string;
};

type Props = {
  complaintId: number; // 고소장 ID
  offense?: string; // 선택: 미지정 시 채팅에서 먼저 물어봄
  onReady?: (aiSessionId: string) => void;
};

// 타임스탬프 표시
function fmtTime(d = new Date()) {
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

// 사용자가 입력한 문자열을 백엔드 키로 매핑 ('fraud' | 'insult')
function parseOffense(
  inputRaw: string,
): { key: 'fraud' | 'insult'; label: '사기죄' | '모욕죄' } | null {
  const s = inputRaw.trim().toLowerCase();
  if (!s) return null;
  // 허용 패턴(한/영/변형)
  if (/(사기|사기죄|fraud)/i.test(s)) return { key: 'fraud', label: '사기죄' };
  if (/(모욕|모욕죄|insult)/i.test(s)) return { key: 'insult', label: '모욕죄' };
  return null;
}

type Phase = 'askOffense' | 'starting' | 'chatting';

const ChatWindowSection: React.FC<Props> = ({ complaintId, offense, onReady }) => {
  const listRef = useRef<HTMLDivElement>(null);

  const [aiSessionId, setAiSessionId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>(offense ? 'starting' : 'askOffense');
  const [chosen, setChosen] = useState<{
    key: 'fraud' | 'insult';
    label: '사기죄' | '모욕죄';
  } | null>(offense ? (parseOffense(offense) ?? { key: 'fraud', label: '사기죄' }) : null);

  // 최초 마운트: offense가 없으면 죄목 질문부터
  useEffect(() => {
    if (phase !== 'askOffense') return;
    setMsgs([
      {
        id: `ask-${Date.now()}`,
        side: 'left',
        text: '사기죄와 모욕죄 중에서 고소장을 작성하고 싶은 죄목을 입력해주세요 (예: 사기죄)',
        time: fmtTime(),
      },
    ]);
  }, [phase]);

  // offense가 미리 넘어왔거나, 사용자가 선택을 마친 경우 세션 시작
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (phase !== 'starting') return;

      const key = chosen?.key ?? 'fraud'; // 안전 기본값
      try {
        // 세션 시작
        const res = await startAiSession(complaintId, key);
        if (!mounted) return;

        setAiSessionId(res.ai_session_id);
        onReady?.(res.ai_session_id);

        // 봇의 첫 질문 노출
        setMsgs((prev) => [
          ...prev,
          {
            id: `q-${Date.now()}`,
            side: 'left',
            text: res.first_question || '사건에 대해 설명해 주세요.',
            time: fmtTime(),
          },
        ]);
        setPhase('chatting');
      } catch {
        if (!mounted) return;
        setMsgs((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            side: 'left',
            text: 'AI 세션 초기화에 실패했어요. 잠시 후 다시 시도해 주세요.',
            time: fmtTime(),
          },
        ]);
        // 다시 죄목부터 물어보도록 되돌리기
        setPhase('askOffense');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [phase, chosen, complaintId, onReady]);

  // 스크롤 하단 유지
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs.length]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    // 1) 아직 세션 전: 죄목 선택 단계 처리
    if (phase === 'askOffense') {
      const parsed = parseOffense(text);
      // 사용자 입력 버블
      setMsgs((prev) => [...prev, { id: `u-${Date.now()}`, side: 'right', text, time: fmtTime() }]);
      setInput('');

      if (!parsed) {
        // 잘못된 입력 → 재요청
        setMsgs((prev) => [
          ...prev,
          {
            id: `reprompt-${Date.now()}`,
            side: 'left',
            text: '죄목을 정확히 입력해주세요: 사기죄 또는 모욕죄 (예: 사기죄)',
            time: fmtTime(),
          },
        ]);
        return;
      }

      // 올바른 선택 → 안내 후 세션 시작
      setChosen(parsed);
      setMsgs((prev) => [
        ...prev,
        {
          id: `ack-${Date.now()}`,
          side: 'left',
          text: `좋아요. ${parsed.label}로 진행할게요. 잠시만요…`,
          time: fmtTime(),
        },
      ]);
      setPhase('starting');
      return;
    }

    // 2) 채팅 단계: 일반 채팅 처리
    if (phase !== 'chatting' || !aiSessionId) return;

    const userMsg: Msg = { id: `m-${Date.now()}`, side: 'right', text, time: fmtTime() };
    setMsgs((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const { reply } = await sendChat(complaintId, aiSessionId, text);
      const botMsg: Msg = { id: `r-${Date.now()}`, side: 'left', text: reply, time: fmtTime() };
      setMsgs((prev) => [...prev, botMsg]);
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
    }
  }, [phase, aiSessionId, input, complaintId]);

  // Enter 전송 / Shift+Enter 줄바꿈
  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 하단 입력 비활성화 규칙: 'starting' 단계에서만 입력 잠금(세션 시작 중)
  const inputDisabled = phase === 'starting';

  return (
    <section className="flex h-[680px] w-[720px] flex-col items-center justify-between overflow-hidden px-[110px] py-[60px]">
      {/* 채팅 로그 */}
      <div
        ref={listRef}
        className="flex h-[500px] w-[720px] flex-col overflow-y-auto rounded-lg border border-gray-300 bg-white px-2 py-3"
        style={{ boxShadow: '0px 4px 8px 0 rgba(0,0,0,0.1)' }}
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
        {phase === 'starting' && (
          <ChatBubble
            side="left"
            text="세션을 준비하고 있어요…"
            time={fmtTime()}
            srLabel="바로 타이핑 중"
          />
        )}
      </div>

      {/* 하단 입력 바 */}
      <div
        className="flex h-12 w-[720px] items-center justify-between rounded-lg border border-blue-600 bg-white px-[22px] py-2.5"
        aria-label="채팅 입력 영역"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            phase === 'askOffense'
              ? '사기죄 또는 모욕죄 중 하나를 입력하세요 (예: 사기죄)'
              : '여기에 입력하고 Enter로 전송 (줄바꿈은 Shift+Enter)'
          }
          rows={1}
          aria-label="메시지 입력"
          disabled={inputDisabled}
          className="mr-2 flex-1 resize-none border-none p-0 text-left text-sm leading-9 font-medium text-gray-700 placeholder:text-gray-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={inputDisabled || (phase === 'chatting' && !input.trim())}
          className="flex h-9 w-[96px] items-center justify-center rounded-2xl border-2 border-blue-600 bg-blue-50 px-3 text-sm font-semibold text-blue-700 disabled:opacity-40"
        >
          보내기
        </button>
      </div>
    </section>
  );
};

export default ChatWindowSection;
