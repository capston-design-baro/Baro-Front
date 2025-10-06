import { useMultilineDetect } from '@/hooks/useMultilineDetect';
import { bubbleWidthClasses, buildSurface, buildTime, textBase } from '@/styles/chat';
import type { Side } from '@/types/side';

// 말풍선 컴포넌트 Props
type BubbleProps = {
  side: Side; // 말풍선이 왼쪽(bot)인지 오른쪽(me)인지
  text: string; // 채팅 메시지 텍스트
  time: string; // 타임스탬프
  srLabel: string; // 스크린리더 접근성 레이블
};

export function ChatBubble({ side, text, time, srLabel }: BubbleProps) {
  // 말풍선의 최대 폭 클래스
  const widthClasses = bubbleWidthClasses;

  const { ref: pRef, isMultiline } = useMultilineDetect(text);

  // 왼쪽 or 오른쪽 정렬 여부
  const isLeft = side === 'left';
  // 왼쪽 말풍선은 항상 text-left | 오른쪽 말풍선인데 여러 줄이면 text-left, 아니면 text-right
  const alignClass = isLeft ? 'text-left' : isMultiline ? 'text-left' : 'text-right';

  return (
    <div
      className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'} py-1`}
      role="listitem"
      aria-label={srLabel}
    >
      <div className={`${widthClasses}`}>
        <div className={buildSurface(side)}>
          <span className="sr-only">{srLabel}</span>
          <p
            ref={pRef}
            className={`${textBase()} ${alignClass}`}
          >
            {text}
          </p>
        </div>
        <div className={buildTime(side)}>{time}</div>
      </div>
    </div>
  );
}
