import React from 'react';

import type { Step } from '@/features/home/constants/process';

interface StepCardProps {
  step: Step;
  index: number;
  isVisible: boolean;
  isLast: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ step, index, isVisible, isLast }) => (
  <div className="relative flex flex-1 flex-col items-center">
    {/* 연결선 - 모바일: 세로 / 데스크톱: 가로 */}
    {!isLast && (
      <>
        {/* 데스크톱 가로 연결선 */}
        <div className="absolute top-7 left-[calc(50%+28px)] hidden h-[2px] w-[calc(100%-56px)] sm:block">
          <div
            className="from-primary-200 to-primary-100 h-full bg-gradient-to-r transition-all duration-1000 ease-out"
            style={{
              width: isVisible ? '100%' : '0%',
              transitionDelay: `${index * 200 + 400}ms`,
            }}
          />
        </div>
        {/* 모바일 세로 연결선 */}
        <div className="absolute top-[calc(100%)] left-1/2 block h-8 w-[2px] -translate-x-1/2 sm:hidden">
          <div
            className="from-primary-200 to-primary-100 w-full bg-gradient-to-b transition-all duration-700 ease-out"
            style={{
              height: isVisible ? '100%' : '0%',
              transitionDelay: `${index * 200 + 400}ms`,
            }}
          />
        </div>
      </>
    )}

    <div
      className={[
        'flex flex-col items-center text-center',
        'transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      ].join(' ')}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* 번호 원형 */}
      <div className="bg-primary-400 relative mb-4 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_16px_rgba(37,99,235,0.25)]">
        <span className="material-symbols-outlined !text-[26px] text-white">{step.icon}</span>
        <span className="text-primary-400 absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold shadow-sm">
          {step.number}
        </span>
      </div>

      {/* 텍스트 */}
      <h3 className="text-body-1-bold mb-2 text-neutral-900">{step.title}</h3>
      <p className="text-detail-regular max-w-[200px] whitespace-pre-line text-neutral-500">
        {step.description}
      </p>
    </div>
  </div>
);

export default StepCard;
