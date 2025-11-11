import type { FaqItem } from '@/constants/faq';
import React from 'react';

type Props = {
  item: FaqItem;
};

const FaqItemCard: React.FC<Props> = ({ item }) => {
  return (
    <div className="flex flex-col gap-3">
      {/* 질문 영역 */}
      <div className="w-full">
        <p className="text-heading-4-bold text-neutral-900">
          <span className="text-primary-400 mr-1">Q.</span>
          {item.question}
        </p>
      </div>

      {/* 답변 카드 영역 */}
      <div
        className="rounded-300 bg-primary-50 w-full px-6 py-4"
        style={{ boxShadow: '0px 4px 12px 0 rgba(37,99,235,0.1)' }}
      >
        <p className="text-body-2 whitespace-pre-line text-neutral-800">{item.answer}</p>
      </div>
    </div>
  );
};

export default FaqItemCard;
