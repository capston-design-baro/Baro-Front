import React from 'react';

import type { FeatureItem } from '@/features/home/constants/trust';

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
  isVisible: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index, isVisible }) => (
  <div
    className={[
      'flex flex-col items-center text-center',
      'rounded-[16px] bg-white px-6 py-10 sm:px-8 sm:py-12',
      'shadow-[0_2px_16px_rgba(0,0,0,0.04)]',
      'transition-all duration-700 ease-out',
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
    ].join(' ')}
    style={{ transitionDelay: `${index * 150}ms` }}
  >
    <div className="bg-primary-0 mb-5 flex h-14 w-14 items-center justify-center rounded-full">
      <span className="material-symbols-outlined text-primary-400 !text-[28px]">
        {feature.icon}
      </span>
    </div>
    <h3 className="text-body-1-bold mb-2 text-neutral-900">{feature.title}</h3>
    <p className="text-detail-regular whitespace-pre-line text-neutral-500">
      {feature.description}
    </p>
  </div>
);

export default FeatureCard;
