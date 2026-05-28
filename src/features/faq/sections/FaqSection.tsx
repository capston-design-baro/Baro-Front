import React, { useCallback, useEffect, useRef, useState } from 'react';

import SectionHeader from '@/shared/ui/SectionHeader';

import FaqItemCard from '@/features/faq/components/FaqItemCard';
import { FAQ_ITEMS } from '@/features/faq/constants/faq';

const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = useCallback((id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-neutral-50"
    >
      <div className="mx-auto flex max-w-[720px] flex-col items-center px-4 py-8 sm:py-12">
        {/* 상단 타이틀 영역 */}
        <SectionHeader
          title="자주 하는 질문"
          description="여러분이 가장 많이 물어본 질문들이에요."
        />

        {/* FAQ 리스트 */}
        <div className="flex w-full flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItemCard
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
