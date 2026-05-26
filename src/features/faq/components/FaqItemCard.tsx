import React from 'react';

import type { FaqItem } from '@/features/faq/constants/faq';

interface Props {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  isVisible: boolean;
}

const FaqItemCard: React.FC<Props> = ({ item, isOpen, onToggle, index, isVisible }) => {
  return (
    <div
      className={[
        'overflow-hidden rounded-[16px] bg-white transition-all duration-300',
        'shadow-[0_2px_16px_rgba(0,0,0,0.04)]',
        isOpen ? 'shadow-[0_4px_20px_rgba(37,99,235,0.08)]' : '',
        // 등장 애니메이션
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
      ].join(' ')}
      style={{ transitionDelay: isVisible ? `${index * 80}ms` : '0ms' }}
    >
      <div className="flex">
        {/* 좌측 하이라이트 바 */}
        <div
          className={[
            'w-1 flex-shrink-0 transition-all duration-300',
            isOpen ? 'bg-primary-400' : 'bg-transparent',
          ].join(' ')}
        />

        <div className="flex-1">
          {/* 질문 영역 (토글 버튼) */}
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between px-5 py-5 text-left"
          >
            <p className={[
              'text-body-2-bold pr-4 transition-colors duration-300',
              isOpen ? 'text-primary-400' : 'text-neutral-900',
            ].join(' ')}>
              <span className="mr-1.5 text-primary-400">Q.</span>
              {item.question}
            </p>
            <span
              className={[
                'material-symbols-outlined !text-[20px] flex-shrink-0',
                'transition-all duration-300',
                isOpen ? 'rotate-180 text-primary-400' : 'text-neutral-400',
              ].join(' ')}
            >
              expand_more
            </span>
          </button>

          {/* 답변 영역 (아코디언) */}
          <div
            className={[
              'grid transition-all duration-300 ease-out',
              isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            ].join(' ')}
          >
            <div className="overflow-hidden">
              <div className="border-t border-neutral-100 px-5 pt-4 pb-5">
                <p className="text-body-3-regular whitespace-pre-line leading-relaxed text-neutral-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqItemCard;
