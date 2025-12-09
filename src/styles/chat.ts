import { bubblePalette, bubbleWidthClasses } from '@/styles/tokens';
import type { Side } from '@/types/side';

/** 말풍선 본체 클래스 */
export function buildSurface(side: Side) {
  const isLeft = side === 'left';
  const palette = isLeft ? bubblePalette.bot : bubblePalette.me;
  const corner = isLeft ? 'rounded-bl' : 'rounded-br';
  return [
    palette.bg,
    palette.border,
    palette.text,
    'border',
    'rounded-400',
    corner,
    'px-4',
    'py-2',
  ].join(' ');
}

/** 채팅 텍스트 스타일 */
export function textBase() {
  return ['text-body-2-regular', 'break-words', 'whitespace-pre-wrap'].join(' ');
}

/** 타임 스탬프 스타일
 * bot이 보낸거면 왼쪽에 패딩을 주고,
 * me가 보낸거면 오른쪽에 패딩을 준 후 오른쪽 정렬 함
 */
export function buildTime(side: Side) {
  return [
    'mt-1',
    'text-detail-regular',
    'text-neutral-400',
    'tabular-nums',
    side === 'left' ? 'pl-2' : 'pr-2 text-right',
  ].join(' ');
}

export { bubbleWidthClasses };
