import React, { useEffect, useRef, useState } from 'react';

import StepCard from '@/features/home/components/StepCard';
import { STEPS } from '@/features/home/constants/process';

const ProcessSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full snap-start bg-white">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 sm:py-28">
        <header className="mb-12 text-center sm:mb-16">
          <h2 className="text-heading-2-bold sm:text-main-4 mb-3 text-neutral-900">
            이렇게 진행돼요
          </h2>
          <p className="text-body-3-regular sm:text-body-2-regular text-neutral-500">
            간단한 3단계로 고소장을 완성할 수 있어요.
          </p>
        </header>

        <div className="mx-auto flex max-w-[720px] flex-col gap-12 sm:flex-row sm:gap-0">
          {STEPS.map((step, i) => (
            <StepCard
              key={step.number}
              step={step}
              index={i}
              isVisible={isVisible}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
