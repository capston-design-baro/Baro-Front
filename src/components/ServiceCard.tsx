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
      'h-30 w-full max-w-70 sm:h-40 md:h-50',
      'rounded-400',

      // ghost base
      'from-primary-100/30 via-primary-50/10 to-primary-0/10 bg-radial',
      'shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]',
      'border border-white/50',
      'backdrop-blur-md',
      'text-primary-700',

      // transition
      'transition-all duration-300 ease-out',

      // hover
      'hover:ring-primary-100/30 hover:ring-2 hover:ring-offset-0',
      'hover:border-white/40',

      // focus
      'focus-visible:ring-primary-100/30 focus-visible:ring-2 focus-visible:outline-none',
    ].join(' ')}
  >
    <div className="flex flex-col items-center gap-2 text-center sm:gap-3">
      {/* 아이콘 */}
      <span
        className={[
          'material-symbols-outlined',
          '!text-[56px] sm:text-[56px] md:text-[100px] lg:text-[120px]',
          'text-primary-800',
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
          'text-body-3-regular xl:text-heading-3 md:text-heading-4 sm:text-body-3-regular',
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
