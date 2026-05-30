export interface Step {
  number: number;
  icon: string;
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  {
    number: 1,
    icon: 'category',
    title: '범죄 유형 선택',
    description: '어떤 피해를 입으셨는지\n유형을 선택해주세요.',
  },
  {
    number: 2,
    icon: 'edit_note',
    title: '상세 내용 입력',
    description: '바로의 질문에 답하면서\n사건 내용을 정리해요.',
  },
  {
    number: 3,
    icon: 'description',
    title: '고소장 초안 완성',
    description: '작성한 초안을 확인하고\n바로 다운로드하세요.',
  },
];
