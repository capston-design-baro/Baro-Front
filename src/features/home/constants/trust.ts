export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export const FEATURES: FeatureItem[] = [
  {
    icon: 'psychology',
    title: 'AI 작성 도우미',
    description: '입력하신 내용을\n고소장 형식에 맞게 정리하도록 도와드려요.',
  },
  {
    icon: 'schedule',
    title: '24시간 이용 가능',
    description: '시간과 장소에 구애받지 않고\n언제든 고소장을 작성할 수 있어요.',
  },
  {
    icon: 'verified',
    title: '단계별 안내',
    description: '복잡한 법률 용어 없이\n쉬운 질문으로 안내해드려요.',
  },
];
