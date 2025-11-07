import AgreementDetailModal from '@/components/agreements/AgreementDetailModal';
import type { Agreement } from '@/types/agreement';
import React from 'react';

type Props = {
  data: Agreement;
  onToggleCheck: (id: number) => void;
};

const AgreementItem: React.FC<Props> = ({ data, onToggleCheck }) => {
  const { id, title, content, isChecked, required } = data;
  const [isOpen, setIsOpen] = React.useState(false);

  const labelText = required ? '(필수)' : '(선택)';

  return (
    <>
      {/* 왼쪽 텍스트, 오른쪽 체크박스 */}
      <div
        className={[
          'flex items-center justify-between gap-4',
          'rounded-100 bg-neutral-0 border border-neutral-200',
          'px-4 py-3',
        ].join(' ')}
      >
        <div className="flex items-center gap-2">
          {/* 필수 or 선택 뱃지 */}
          <span
            className={
              required ? 'text-body-3-bold text-positive-200' : 'text-body-3-bold text-neutral-500'
            }
          >
            {labelText}
          </span>

          {/* 제목 및 > 아이콘 */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2"
          >
            <span className="text-body-1-regular text-neutral-900">{title}</span>
            <span
              className="material-symbols-outlined text-neutral-400"
              style={{ fontSize: '12px' }}
            >
              arrow_forward_ios
            </span>
          </button>
        </div>

        {/* 오른쪽 체크박스 */}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggleCheck(id)}
          className="accent-positive-200 h-5 w-5 cursor-pointer"
          aria-required={required}
        />
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
