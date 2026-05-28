import React from 'react';

import Button from '@/shared/ui/common/Button';

type WizardNavButtonsProps = {
  onPrev?: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  disablePrev?: boolean;
  prevLabel?: string;
  nextLabel?: string;
};

const WizardNavButtons: React.FC<WizardNavButtonsProps> = ({
  onPrev,
  onNext,
  isNextDisabled,
  disablePrev = false,
  prevLabel = '이전',
  nextLabel = '다음',
}) => {
  return (
    <div className="w-full shrink-0">
      {/* 바 본체 */}
      <div className="px-6 pt-2 pb-3">
        <div className="mx-auto flex w-full max-w-[420px] items-center justify-between">
          {/* 이전: 텍스트 버튼 */}
          <button
            type="button"
            onClick={onPrev}
            disabled={disablePrev}
            className="text-body-3-regular flex items-center gap-1 text-neutral-500 transition-colors hover:text-neutral-700 disabled:invisible"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '18px' }}
            >
              arrow_back
            </span>
            {prevLabel}
          </button>

          {/* 다음: primary 버튼 */}
          <Button
            variant="primary"
            size="md"
            onClick={onNext}
            disabled={isNextDisabled}
            className="min-w-[120px]"
          >
            {nextLabel}
            <span
              className="material-symbols-outlined ml-1"
              style={{ fontSize: '18px' }}
            >
              arrow_forward
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WizardNavButtons;
