import type { Service } from '@/types/service';
import React from 'react';

type Props = { service: Service; onClick?: (s: Service) => void };

const ServiceCard: React.FC<Props> = ({ service, onClick }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onClick?.(service)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') onClick?.(service);
    }}
    className={[
      // 크기 & 레이아웃
      'group inline-flex h-[220px] w-[360px] items-center justify-center',
      'rounded-2xl bg-white',
      // 기본 섀도우
      'shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
      // hover: 배경/섀도우 색 변경
      'transition-all duration-300',
      'hover:bg-blue-50/[0.35]',
      'hover:shadow-[0_4px_12px_rgba(37,99,235,0.1)]',
      // 포커스 접근성
      'focus:ring-2 focus:ring-blue-500/40 focus:outline-none',
    ].join(' ')}
  >
    <div className="flex flex-col items-center gap-3 text-center">
      <span
        className={[
          'material-symbols-outlined',
          '!text-[120px]',
          // 기본 아이콘 컬러
          'text-slate-900',
          // hover 시 아이콘 컬러
          'group-hover:text-blue-600',
          'transition-colors',
        ].join(' ')}
        aria-hidden
      >
        {service.icon}
      </span>

      <h3
        className={[
          // 텍스트 32px, medium, 중앙, 기본색
          'text-[32px] font-medium text-slate-900',
          // hover 시 텍스트 색
          'group-hover:text-blue-600',
          'transition-colors duration-300',
        ].join(' ')}
      >
        {service.title}
      </h3>
    </div>
  </div>
);

export default ServiceCard;
