import type { Side } from '@/types/side';

/** 채팅 메시지 하나당 꼭 갖는 필수 정보들 */
export type Message = {
  id: string; // 메시지의 고유 번호
  side: Side; // bot인지 me인지
  text: string; // 텍스트 내용
  time: string; // 타임스탬프
  srLabel: string; // 스크린리더용 라벨
};

/** 메시지를 보낼 때 쓸 함수 모양 */
export type SendHandler = (val: string) => void;
