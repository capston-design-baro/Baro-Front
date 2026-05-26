import React, { useEffect, useRef, useState } from 'react';

import FeatureCard from '@/features/home/components/FeatureCard';
import { FEATURES } from '@/features/home/constants/trust';

const TrustSection: React.FC = () => {
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
    <section
      ref={sectionRef}
      className="w-full snap-start bg-neutral-50"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 sm:py-28">
        <header className="mb-12 text-center sm:mb-16">
          <h2 className="text-heading-2-bold sm:text-main-4 mb-3 text-neutral-900">
            왜 바로일까요?
          </h2>
          <p className="text-body-3-regular sm:text-body-2-regular text-neutral-500">
            바로만의 특별한 점을 확인해보세요.
          </p>
        </header>

        <div className="mx-auto grid max-w-[960px] grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
