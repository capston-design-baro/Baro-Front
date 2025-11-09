// 확인용 칩을 눌렀는지 저장하는 구조
export type ConfirmChip = {
  key: string; // key: 상태 저장 및 전송 시 식별자
  label: string; // label: UI에 노출할 문구
  checked: boolean; // checked: 선택 여부
};

// 예/아니오 질문 지원
export type BinaryAnswer = 'yes' | 'no' | null;

// 질문의 표현 방식 구분
// - confirm -> 체크 박스 1개로 안내를 확인했는지 여부를 받는 형태
// - binary -> 예 / 아니오 2개 중에 택하는 답을 받는 형탠
export type QuestionKind = 'confirm' | 'binary';

// 사전 확인 단계에서 쓰이는 개별 질문 단위의 데이터 모델
export type PrecheckQuestion = {
  id: string; // 질문 식별자
  title: string; // 질문 문구
  hintIcon?: 'info' | 'alert'; // 보조 아이콘 타입
  kind: QuestionKind; // 질문 유형
  description?: string; // Tooltip 등에서 사용할 상세 설명

  // kind === 'confirm' 일 때 사용
  confirmChip?: ConfirmChip;

  // kind === 'binary' 일 때 사용
  answer?: BinaryAnswer;
};

// 마법사 전체 상태 모델
export type WizardState = {
  step: number; // 0-based
  stepsTotal: number; // 전체 단계 수
  prechecks: PrecheckQuestion[]; // 사전 확인 질문 목록
};

export type OffenseType = '사기죄' | '모욕죄';

export type ComplaintWizardState = WizardState & {
  offense: OffenseType | null;
};
