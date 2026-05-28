import { bubblePalette, bubbleWidthClasses } from '@/features/complaint/components/chat/tokens';
import type { Side } from '@/features/complaint/components/chat/types/side';

/** 말풍선 본체 클래스 */
export function buildSurface(side: Side) {
  const isLeft = side === 'left';
  const palette = isLeft ? bubblePalette.bot : bubblePalette.me;
  const corner = isLeft ? 'rounded-tl-none' : 'rounded-tr-none';
  return [palette.bg, palette.text, 'rounded-2xl', corner, 'px-4', 'py-3'].join(' ');
}

/** 채팅 텍스트 스타일 */
export function textBase() {
  return ['text-body-3-regular', 'break-words', 'whitespace-pre-wrap', 'leading-relaxed'].join(' ');
}

/** 타임스탬프 스타일 */
export function buildTime(side: Side) {
  return [
    'mt-1',
    'text-detail-regular',
    'text-neutral-400',
    'tabular-nums',
    side === 'left' ? 'pl-1' : 'pr-1 text-right',
  ].join(' ');
}

export { bubbleWidthClasses };
