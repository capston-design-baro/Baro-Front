import type { Service } from '@/features/home/types/service';

export const SERVICES: Service[] = [
  {
    id: 'complaint',
    title: '고소장 작성하기',
    description: '바로가 단계별로 안내해드려요.',
    icon: 'edit_note',
    to: '/complaint',
  },
  {
    id: 'find',
    title: '범죄 유형 안내',
    description: '어떤 범죄 유형이 있는지 알아보세요.',
    icon: 'content_paste_search',
    to: '/precedent',
  },
  {
    id: 'faq',
    title: '자주 하는 질문',
    description: '궁금한 점을 빠르게 해결하세요.',
    icon: 'contact_support',
    to: '/faq',
  },
];
