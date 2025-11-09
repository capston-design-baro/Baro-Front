import { useMultilineDetect } from '@/hooks/useMultilineDetect';
import { bubbleWidthClasses, buildSurface, buildTime, textBase } from '@/styles/chat';
import type { Side } from '@/types/side';

// 말풍선 컴포넌트 Props
type BubbleProps = {
  side: Side; // 말풍선이 왼쪽(bot)인지 오른쪽(me)인지
  text: string; // 채팅 메시지 텍스트
  time: string; // 타임스탬프
  srLabel: string; // 스크린리더 접근성 레이블
  isTyping?: boolean;
};

export function ChatBubble({ side, text, time, srLabel, isTyping }: BubbleProps) {
  // 말풍선의 최대 폭 클래스
  const widthClasses = bubbleWidthClasses;

  const { ref: pRef, isMultiline } = useMultilineDetect(text);

  // 왼쪽 or 오른쪽 정렬 여부
  const isLeft = side === 'left';
  // 왼쪽 말풍선은 항상 text-left | 오른쪽 말풍선인데 여러 줄이면 text-left, 아니면 text-right
  const alignClass = isLeft ? 'text-left' : isMultiline ? 'text-left' : 'text-right';

  return (
    <div
      className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'} py-3`}
      role="listitem"
      aria-label={srLabel}
    >
      {/* 말풍선 최대 폭 제한 컨테이너 */}
      <div className={`${widthClasses}`}>
        {/* 말풍선 본체 */}
        <div className={buildSurface(side)}>
          {/* 스크린리더 전용 텍스트 */}
          <span className="sr-only">{srLabel}</span>

          {/* 실제 메시지 텍스트 */}
          <p
            ref={isTyping ? undefined : pRef}
            className={`${textBase()} ${alignClass}`}
          >
            {isTyping ? (
              <span className="inline-flex items-center gap-1 px-4">
                <span className="bg-primary-200 h-[5px] w-[5px] animate-bounce rounded-full" />
                <span className="bg-primary-300 h-[5px] w-[5px] animate-bounce rounded-full [animation-delay:0.15s]" />
                <span className="bg-primary-400 h-[5px] w-[5px] animate-bounce rounded-full [animation-delay:0.3s]" />
              </span>
            ) : (
              text
            )}
          </p>
        </div>

        {/* 타임스탬프 */}
        <div className={buildTime(side)}>{time}</div>
      </div>
    </div>
  );
}
