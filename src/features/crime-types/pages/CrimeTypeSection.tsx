import React, { useEffect, useMemo, useState } from 'react';

import SectionHeader from '@/shared/ui/SectionHeader';

import type { CrimeCategory, CrimeDomain } from '@/features/crime-types/constants/crimeTypes';
import { CRIME_TYPES } from '@/features/crime-types/constants/crimeTypes';

const CrimeTypeSection: React.FC = () => {
  const [domainId, setDomainId] = useState<CrimeDomain['id']>('criminal');
  const currentDomain = useMemo(
    () => CRIME_TYPES.find((d) => d.id === domainId) ?? CRIME_TYPES[0],
    [domainId],
  );

  const [categoryId, setCategoryId] = useState<string | null>(
    currentDomain.categories[0]?.id ?? null,
  );

  const [chipsVisible, setChipsVisible] = useState(true);

  // 도메인 변경 시 칩 fade-out → 카테고리 리셋 → 칩 fade-in
  useEffect(() => {
    setChipsVisible(false);

    const timer = setTimeout(() => {
      if (currentDomain.categories.length > 0) {
        setCategoryId(currentDomain.categories[0].id);
      } else {
        setCategoryId(null);
      }
      setChipsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [currentDomain]);

  const currentCategory: CrimeCategory | undefined = useMemo(
    () => currentDomain.categories.find((c) => c.id === categoryId),
    [currentDomain, categoryId],
  );

  return (
    <section className="w-full bg-neutral-50">
      <div className="mx-auto flex max-w-[720px] flex-col items-center px-4 py-8 sm:py-12">
        {/* 헤더 */}
        <SectionHeader
          title="범죄 유형 안내"
          description="어떤 범죄 유형이 있는지 궁금하다면, 아래에서 살펴보세요."
        />

        {/* 형사 / 민사 Pill 탭 */}
        <div className="relative mb-8 inline-flex rounded-full bg-neutral-100 p-1">
          {/* 슬라이딩 배경 */}
          <div
            className="bg-primary-400 absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all duration-300 ease-out"
            style={{
              left: domainId === 'criminal' ? '4px' : 'calc(50% + 0px)',
            }}
          />
          {CRIME_TYPES.map((domain) => {
            const isActive = domain.id === domainId;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => setDomainId(domain.id)}
                className={[
                  'text-body-3-bold relative z-10 rounded-full px-8 py-2 transition-colors duration-300',
                  isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-700',
                ].join(' ')}
              >
                {domain.name}
              </button>
            );
          })}
        </div>

        {/* 카테고리 칩 */}
        <div
          className={[
            'mb-8 flex w-full flex-wrap justify-center gap-2',
            'transition-all duration-300 ease-out',
            chipsVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
          ].join(' ')}
        >
          {currentDomain.categories.map((cat) => {
            const isActive = cat.id === categoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={[
                  'text-detail-bold rounded-full border px-4 py-1.5 transition-all duration-200',
                  isActive
                    ? 'border-primary-200 bg-primary-0 text-primary-400'
                    : 'border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-700',
                ].join(' ')}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* 상세 카드 */}
        <div className="flex w-full flex-col gap-3">
          {currentCategory ? (
            currentCategory.children.map((sub, i) => (
              <div
                key={`${categoryId}-${sub.id}`}
                className={[
                  'rounded-[16px] bg-white px-6 py-5',
                  'shadow-[0_2px_16px_rgba(0,0,0,0.04)]',
                  'animate-[fadeUp_0.4s_ease-out_both]',
                ].join(' ')}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-primary-400 h-2 w-2 flex-shrink-0 rounded-full" />
                  <p className="text-body-2-bold text-neutral-900">{sub.name}</p>
                </div>
                <p className="text-body-3-regular pl-4 leading-relaxed whitespace-pre-line text-neutral-600">
                  {sub.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-body-3-regular py-10 text-center text-neutral-500">
              카테고리를 선택해주세요.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CrimeTypeSection;
