import { useMultilineDetect } from '@/hooks/useMultilineDetect';
import { bubbleWidthClasses, buildSurface, buildTime, textBase } from '@/styles/chat';
import type { Side } from '@/types/side';

// 말풍선 컴포넌트 Props
type BubbleProps = {
  side: Side;
  text: string;
  time: string;
  srLabel: string;
};

export function ChatBubble({ side, text, time, srLabel }: BubbleProps) {
  const widthClasses = bubbleWidthClasses;

  const { ref: pRef, isMultiline } = useMultilineDetect<HTMLParagraphElement>(text);

  const isLeft = side === 'left';
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
