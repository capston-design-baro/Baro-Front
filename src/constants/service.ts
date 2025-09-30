import type { Service } from '@/types/service';

export const SERVICES: Service[] = [
  { id: 'complaint', title: '고소장 작성하기', icon: 'edit_note', to: '/complaint' },
  { id: 'precedent', title: '판례 찾아보기', icon: 'content_paste_search', to: '/precedent' },
  { id: 'faq', title: '자주 하는 질문', icon: 'contact_support', to: '/faq' },
];
