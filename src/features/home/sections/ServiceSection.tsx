import React from 'react';

import ServiceCard from '@/features/home/components/ServiceCard';
import { SERVICES } from '@/features/home/constants/service';
import type { ServiceClickHandler } from '@/features/home/types/service';

interface ServiceSectionProps {
  onClickCard?: ServiceClickHandler;
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ onClickCard }) => {
  return (
    <section className="w-full snap-start bg-neutral-50">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 sm:py-28">
        <header className="text-center">
          <h2 className="text-heading-2-bold sm:text-main-4 mb-2 text-neutral-900">
            필요한 서비스를 선택하세요
          </h2>
          <p className="text-body-3-regular sm:text-body-2-regular text-neutral-500">
            원하는 서비스를 클릭하면 바로 시작할 수 있어요.
          </p>
        </header>

        <div className="mx-auto mt-10 grid max-w-[1000px] grid-cols-1 justify-items-center gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-6">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={onClickCard}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
