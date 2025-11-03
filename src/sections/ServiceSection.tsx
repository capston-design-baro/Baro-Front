import ServiceCard from '@/components/ServiceCard';
import { SERVICES } from '@/constants/service';
import '@/styles/main.css';
import type { Service } from '@/types/service';
import React from 'react';

type Props = { onClickCard?: (s: Service) => void };

const ServiceSection: React.FC<Props> = ({ onClickCard }) => {
  return (
    <section className="w-full bg-white">
      {/* 1440px 중앙 정렬 컨테이너 */}
      <div className="mx-auto w-full max-w-[1440px] px-6">
        <div className="mx-auto flex max-w-[411px] flex-col items-center gap-6 pt-32">
          <h2 className="relative mb-4 text-center font-bold">
            <span className="relative inline-block text-3xl whitespace-nowrap sm:text-4xl md:text-5xl">
              <span className="animate-wave-fill">무엇을 도와드릴까요?</span>
            </span>
          </h2>
          <p className="text-center text-[3.5vw] font-medium whitespace-nowrap text-gray-500 sm:text-lg md:text-xl">
            필요한 서비스를 선택하고 시작해보세요.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1120px] grid-cols-1 justify-items-center gap-6 sm:mt-14 sm:grid-cols-3 lg:mt-20 lg:grid-cols-3">
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
