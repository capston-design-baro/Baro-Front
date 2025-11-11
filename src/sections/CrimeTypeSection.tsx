import IntroHeader from '@/components/IntroHeader';
import type { CrimeCategory, CrimeDomain } from '@/constants/crimeTypes';
import { CRIME_TYPES } from '@/constants/crimeTypes';
import React, { useEffect, useMemo, useState } from 'react';

const CrimeTypeSection: React.FC = () => {
  const [domainId, setDomainId] = useState<CrimeDomain['id']>('criminal');
  const currentDomain = useMemo(
    () => CRIME_TYPES.find((d) => d.id === domainId) ?? CRIME_TYPES[0],
    [domainId],
  );

  const [categoryId, setCategoryId] = useState<string | null>(
    currentDomain.categories[0]?.id ?? null,
  );

  // 도메인 바뀔 때마다 첫 번째 카테고리로 리셋
  useEffect(() => {
    if (currentDomain.categories.length > 0) {
      setCategoryId(currentDomain.categories[0].id);
    } else {
      setCategoryId(null);
    }
  }, [currentDomain]);

  const currentCategory: CrimeCategory | undefined = useMemo(
    () => currentDomain.categories.find((c) => c.id === categoryId),
    [currentDomain, categoryId],
  );

  return (
    <section className="bg-neutral-0 w-full">
      <div className="mx-auto flex max-w-[960px] flex-col gap-15 px-4 py-16">
        <IntroHeader
          title="범죄 유형 안내"
          lines={[
            '어떤 유형으로 고소해야 할지 헷갈리시나요?',
            '아래에서 사건 유형을 선택하고, 설명을 참고해보세요.',
          ]}
          center
          showArrow={false}
        />

        {/* 형사 / 민사 탭 */}
        <div className="flex justify-center gap-3">
          {CRIME_TYPES.map((domain) => {
            const isActive = domain.id === domainId;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => setDomainId(domain.id)}
                className={[
                  'text-body-3 rounded-400 flex min-w-[120px] items-center justify-center px-4 py-2 transition-colors',
                  isActive
                    ? 'bg-primary-400 text-neutral-0'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
                ].join(' ')}
              >
                {domain.name}
              </button>
            );
          })}
        </div>

        {/* 카테고리 목록 + 상세 보기 */}
        <div className="grid gap-8 md:grid-cols-[260px,1fr]">
          {/* 카테고리 리스트 */}
          <aside className="rounded-200 flex flex-col gap-2 bg-neutral-50 p-4">
            <p className="text-body-3-regular mb-2 text-neutral-500">카테고리를 선택하세요</p>
            {currentDomain.categories.map((cat) => {
              const isActive = cat.id === categoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={[
                    'text-body-3 rounded-200 flex w-full items-center justify-between px-3 py-2 text-left transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-500'
                      : 'text-neutral-700 hover:bg-neutral-100',
                  ].join(' ')}
                >
                  <span>{cat.name}</span>
                  {isActive && (
                    <span className="material-symbols-outlined text-primary-400">
                      arrow_forward
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* 상세 설명 영역 */}
          <div className="flex flex-col gap-4">
            {currentCategory ? (
              <>
                <h3 className="text-heading-3 text-neutral-900">{currentCategory.name}</h3>
                <div className="grid gap-4">
                  {currentCategory.children.map((sub) => (
                    <div
                      key={sub.id}
                      className="rounded-300 bg-neutral-0 border border-neutral-100 px-5 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                    >
                      <p className="text-body-2-semibold text-primary-700 mb-1">{sub.name}</p>
                      <p className="text-body-3-regular whitespace-pre-line text-neutral-700">
                        {sub.description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-body-3-regular text-neutral-500">
                선택된 카테고리가 없습니다. 왼쪽에서 유형을 선택해주세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrimeTypeSection;
