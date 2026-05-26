import React from 'react';

import type { Service, ServiceClickHandler } from '@/features/home/types/service';

interface ServiceCardProps {
  service: Service;
  onClick?: ServiceClickHandler;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => (
  <button
    type="button"
    onClick={() => onClick?.(service)}
    aria-label={`${service.title} 서비스로 이동`}
    className={[
      'group relative flex w-full max-w-80 flex-col items-center text-center',
      'rounded-[16px] bg-white px-6 py-10 sm:px-8 sm:py-12',
      'shadow-[0_2px_16px_rgba(0,0,0,0.04)]',
      'border border-neutral-100',
      'transition-all duration-300 ease-out',
      'hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)]',
      'hover:border-primary-100',
      'focus-visible:ring-primary-200 focus-visible:ring-2 focus-visible:outline-none',
    ].join(' ')}
  >
    {/* 아이콘 */}
    <div className="bg-primary-0 group-hover:bg-primary-50 mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-300">
      <span
        className={[
          'material-symbols-outlined',
          '!text-[32px]',
          'text-primary-400',
          'transition-colors duration-300',
        ].join(' ')}
        aria-hidden
      >
        {service.icon}
      </span>
    </div>

    {/* 서비스 제목 */}
    <h3 className="text-body-1-bold mb-1 text-neutral-900">{service.title}</h3>

    {/* 서비스 설명 */}
    <p className="text-detail-regular mb-4 text-neutral-500">{service.description}</p>

    {/* 화살표 */}
    <span className="material-symbols-outlined group-hover:text-primary-400 !text-[20px] text-neutral-300 transition-all duration-300 group-hover:translate-x-1">
      arrow_forward
    </span>
  </button>
);

export default ServiceCard;
