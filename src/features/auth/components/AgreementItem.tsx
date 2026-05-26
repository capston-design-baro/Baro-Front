import React from 'react';

import AgreementDetailModal from '@/features/auth/components/AgreementDetailModal';
import type { Agreement } from '@/features/auth/types/model';

type Props = {
  data: Agreement;
  onToggleCheck: (id: number) => void;
};

const AgreementItem: React.FC<Props> = ({ data, onToggleCheck }) => {
  const { id, title, content, isChecked, required } = data;
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center justify-between py-2.5">
        {/* 좌측: 체크 아이콘 + 제목 */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onToggleCheck(id)}
            className="flex flex-shrink-0 items-center"
          >
            <span
              className={[
                'material-symbols-outlined !text-[20px] leading-none transition-colors duration-200',
                isChecked ? 'text-primary-400' : 'text-neutral-300',
              ].join(' ')}
            >
              {isChecked ? 'check_circle' : 'radio_button_unchecked'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1"
          >
            <span
              className={[
                'text-detail-bold leading-none',
                required ? 'text-primary-400' : 'text-neutral-400',
              ].join(' ')}
            >
              {required ? '[필수]' : '[선택]'}
            </span>
            <span className="text-detail-regular leading-none text-neutral-700">{title}</span>
            <span className="material-symbols-outlined !text-[14px] leading-none text-neutral-400">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      {/* 약관 자세히 보기 모달 */}
      <AgreementDetailModal
        open={isOpen}
        title={title}
        content={content}
        checked={isChecked}
        onToggleCheck={() => onToggleCheck(id)}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default AgreementItem;
