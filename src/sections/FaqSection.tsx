import FaqItemCard from '@/components/FaqItemCard';
import IntroHeader from '@/components/IntroHeader';
import { FAQ_ITEMS } from '@/constants/faq';
import React, { useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 3;

const FaqSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(FAQ_ITEMS.length / ITEMS_PER_PAGE);

  const visibleFaqs = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return FAQ_ITEMS.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage]);

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <section className="bg-neutral-0 w-full">
      <div className="mx-auto flex max-w-[960px] flex-col items-center gap-20 px-4 py-16">
        {/* 상단 타이틀 영역 */}
        <IntroHeader
          title="자주 하는 질문"
          lines={['자주 궁금해하는 것들을 모아 봤어요.']}
          center
          showArrow={false}
        />

        {/* FAQ 리스트 + 페이지네이션 묶음 -> 높이 고정 */}
        <div className="flex min-h-[550px] w-full flex-col justify-between">
          {/* FAQ 리스트 (한 화면에 최대 3개) */}
          <div className="flex w-full flex-1 flex-col gap-10">
            {visibleFaqs.map((item) => (
              <FaqItemCard
                key={item.id}
                item={item}
              />
            ))}
          </div>

          {/* 페이지네이션 버튼 */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const isActive = idx === currentPage;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePageClick(idx)}
                  className={[
                    'text-body-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    isActive
                      ? 'bg-primary-400 text-neutral-0'
                      : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200',
                  ].join(' ')}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
