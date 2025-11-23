import ServiceCard from '@/components/ServiceCard';
import { SERVICES } from '@/constants/service';
import '@/styles/main.css';
import type { Service } from '@/types/service';
import React from 'react';

interface ServiceSectionProps {
  onClickCard?: (s: Service) => void;
}

const ServiceSectionHeader = () => (
  <div className="mx-auto flex max-w-[400px] flex-col items-center gap-4 pt-32">
    <header className="text-center whitespace-nowrap">
      <h2 className="sm:text-main-1 text-main-4 relative mb-4">
        <span className="animate-wave-fill inline-block">무엇을 도와드릴까요?</span>
      </h2>
      <p className="sm:text-body-1-regular text-body-2-regular text-neutral-500">
        필요한 서비스를 선택하고 시작해보세요.
      </p>
    </header>
  </div>
);

const ServiceCardGrid = ({ onClickCard }: { onClickCard?: (service: Service) => void }) => (
  <div className="mx-auto mt-10 grid max-w-[1000px] grid-cols-1 justify-items-center gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-6">
    {SERVICES.map((service) => (
      <ServiceCard
        key={service.id}
        service={service}
        onClick={onClickCard}
      />
    ))}
  </div>
);

const ServiceSection: React.FC<ServiceSectionProps> = ({ onClickCard }) => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <ServiceSectionHeader />
        <ServiceCardGrid onClickCard={onClickCard} />
      </div>
    </section>
  );
};

export default ServiceSection;
