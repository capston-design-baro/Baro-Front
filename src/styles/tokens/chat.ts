/**
 * 말풍선 생상 팔레트
 * bot은 ai 메시지용
 * me는 사용자가 보낸 메시지용
 *
 * as const를 통해 각 값을 리터럴 타입으로 고정했음
 */
export const bubblePalette = {
  bot: { bg: 'bg-blue-50', border: 'border-blue-600', text: 'text-black' },
  me: { bg: 'bg-white', border: 'border-blue-600', text: 'text-black' },
} as const;

/**
 * 말풍선 최대 너비 토큰
 * base, sm, md, lg 브레이크포인트마다 다른 max-width 클래스를 제공해줌
 * (예를 들어 sm 이상이면 최대 너비가 75%임)
 */
export const bubbleMaxW = {
  base: 'max-w-[82%]',
  sm: 'sm:max-w-[75%]',
  md: 'md:max-w-[65%]',
  lg: 'lg:max-w-[55%]',
} as const;

/** 조합된 폭 클래스 상수 */
export const bubbleWidthClassses =
  `${bubbleMaxW.base} ${bubbleMaxW.sm} ${bubbleMaxW.md} ${bubbleMaxW.lg}` as const;
