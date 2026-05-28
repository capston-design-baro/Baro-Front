import characterUrl from '@/assets/BaLawCharacter-large.svg';

import {
  bubbleWidthClasses,
  buildSurface,
  buildTime,
  textBase,
} from '@/features/complaint/components/chat/styles/chat';
import type { Side } from '@/features/complaint/components/chat/types/side';
import { useMultilineDetect } from '@/features/complaint/components/chat/utils/multilineDetect';

type BubbleProps = {
  side: Side;
  text: string;
  time: string;
  srLabel: string;
  isTyping?: boolean;
};

export function ChatBubble({ side, text, time, srLabel, isTyping }: BubbleProps) {
  const { ref: pRef, isMultiline } = useMultilineDetect(text);

  const isLeft = side === 'left';
  const alignClass = isLeft ? 'text-left' : isMultiline ? 'text-left' : 'text-right';

  return (
    <div
      className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'} py-1.5`}
      role="listitem"
      aria-label={srLabel}
    >
      {/* 봇 아바타 */}
      {isLeft && (
        <img
          src={characterUrl}
          alt="바로"
          className="mr-2 h-8 w-8 shrink-0 self-start rounded-full"
          draggable={false}
        />
      )}

      <div className={bubbleWidthClasses}>
        <div className={buildSurface(side)}>
          <span className="sr-only">{srLabel}</span>
          <p
            ref={isTyping ? undefined : pRef}
            className={`${textBase()} ${alignClass}`}
          >
            {isTyping ? (
              <span className="inline-flex items-center gap-1 px-2">
                <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-neutral-400" />
                <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-neutral-400 [animation-delay:0.15s]" />
                <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-neutral-400 [animation-delay:0.3s]" />
              </span>
            ) : (
              text
            )}
          </p>
        </div>
        <div className={buildTime(side)}>{time}</div>
      </div>
    </div>
  );
}
