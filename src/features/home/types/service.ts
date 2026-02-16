export type ServiceId = 'complaint' | 'find' | 'faq';

export type ServiceIcon = 'edit_note' | 'content_paste_search' | 'contact_support';

export interface Service {
  id: ServiceId;
  title: string;
  icon: ServiceIcon;
  to: string;
}

export type ServiceClickHandler = (service: Service) => void;
