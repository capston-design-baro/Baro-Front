/**
 * ServiceCard 컴포넌트
 * ----------------------
 * - 서비스 아이콘 + 제목 표시
 * - 클릭 시 onClick(service) 호출
 */
import type { Service } from '@/types/service';
import React from 'react';

type Props = { service: Service; onClick?: (s: Service) => void };

const ServiceCard: React.FC<Props> = ({ service, onClick }) => (
  <button
    type="button"
    onClick={() => onClick?.(service)}
    aria-label={`${service.title} 서비스로 이동`}
    className={[
      // layout
      'group inline-flex items-center justify-center',
      'h-30 w-full max-w-90 sm:h-50 md:h-55',
      'rounded-400 bg-neutral-0',

      // shadow & transition
      'shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
      'transition-all duration-300',

      // hover
      'hover:bg-primary-0/[0.2]',
      'hover:shadow-[0_4px_12px_rgba(37,99,235,0.1)]',

      // focus
      'focus-visible:ring-primary-200/40 focus-visible:ring-2 focus-visible:outline-none',
    ].join(' ')}
  >
    <div className="flex flex-col items-center gap-3 text-center">
      {/* 아이콘 */}
      <span
        className={[
          'material-symbols-outlined',
          '!text-[56px] sm:text-[80px] md:text-[100px] lg:text-[120px]',
          'group-hover:text-primary-400 transition-colors',
        ].join(' ')}
        aria-hidden
      >
        {service.icon}
      </span>

      {/* 서비스 제목 */}
      <h3
        className={[
          // 텍스트 32px, medium, 중앙, 기본색
          'md:text-heading-2 sm:text-heading-3',
          'text-primary-800',
          // hover 시 텍스트 색
          'group-hover:text-primary-400 transition-colors duration-300',
        ].join(' ')}
      >
        {service.title}
      </h3>
    </div>
  </button>
);

export default ServiceCard;
