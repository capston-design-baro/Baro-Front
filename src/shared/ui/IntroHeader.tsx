import React from 'react';

import characterUrl from '@/assets/BaLawCharacter-large.svg';

const IntroHeader: React.FC<{
  title?: string;
  lines?: string[];
  center?: boolean;
  className?: string;
  showArrow?: boolean;
}> = ({ lines = [], className = '' }) => {
  if (lines.length === 0) return null;

  return (
    <div className={`mt-4 mb-6 flex items-start gap-3 md:mt-6 md:mb-8 md:gap-4 ${className}`}>
      {/* 바로 캐릭터 */}
      <img
        src={characterUrl}
        alt="바로 캐릭터"
        className="animate-float h-14 w-14 shrink-0 md:h-18 md:w-18 lg:h-22 lg:w-22"
        draggable={false}
      />

      {/* 말풍선 */}
      <div className="animate-bubble-in rounded-200 border-primary-100 bg-primary-0/40 relative flex-1 border px-4 py-3 md:px-5 md:py-4">
        {/* 말풍선 꼬리 */}
        <svg
          className="absolute top-5 -left-[6px] md:top-6"
          width="6"
          height="10"
          viewBox="0 0 6 10"
          fill="none"
        >
          <path
            d="M6 0 L0 5 L6 10"
            className="fill-primary-0/40 stroke-primary-100"
            strokeWidth="1"
          />
          <line
            x1="6"
            y1="0"
            x2="6"
            y2="10"
            className="stroke-primary-0/40"
            strokeWidth="2"
          />
        </svg>
        <div className="flex flex-col gap-0.5">
          {lines.map((text, idx) => (
            <p
              key={text}
              className={
                idx === 0
                  ? 'text-body-3-regular md:text-body-2-regular lg:text-body-1-regular text-neutral-700'
                  : 'text-detail-regular md:text-body-3-regular text-neutral-500'
              }
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroHeader;
