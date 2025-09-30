export type ServiceId = 'complaint' | 'precedent' | 'faq';

export interface Service {
  id: ServiceId;
  title: string;
  icon: string;
  to?: string;
}
