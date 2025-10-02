export type ServiceId = 'complaint' | 'find' | 'faq';

export interface Service {
  id: ServiceId;
  title: string;
  icon: string;
  to?: string;
}
