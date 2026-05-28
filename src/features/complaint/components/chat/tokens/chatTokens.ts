/** 말풍선 색상 팔레트 */
export const bubblePalette = {
  bot: { bg: 'bg-neutral-100', text: 'text-neutral-900' },
  me: { bg: 'bg-primary-400', text: 'text-white' },
} as const;

/** 말풍선 최대 너비 (반응형) */
export const bubbleMaxW = {
  base: 'max-w-[82%]',
  sm: 'sm:max-w-[75%]',
  md: 'md:max-w-[65%]',
  lg: 'lg:max-w-[55%]',
} as const;

/** 조합된 폭 클래스 상수 */
export const bubbleWidthClasses =
  `${bubbleMaxW.base} ${bubbleMaxW.sm} ${bubbleMaxW.md} ${bubbleMaxW.lg}` as const;
