import ServiceCard from '@/components/ServiceCard';
import { SERVICES } from '@/constants/service';
import '@/styles/main.css';
import type { Service } from '@/types/service';
import React from 'react';

type Props = { onClickCard?: (s: Service) => void };

const ServiceSection: React.FC<Props> = ({ onClickCard }) => {
  return (
    <section className="w-full bg-white">
      {/* 중앙 정렬 컨테이너 */}
      <div className="mx-auto w-full max-w-[1280px] px-6">
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

        <div className="mx-auto mt-10 grid max-w-[1000px] grid-cols-1 justify-items-center gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-6">
          {SERVICES.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              onClick={onClickCard}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
