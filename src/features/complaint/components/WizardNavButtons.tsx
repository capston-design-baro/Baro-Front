import Button from '@/components/common/Button';
import React from 'react';

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
    <div className="mx-auto flex w-full max-w-[420px] items-center justify-center">
      <div className="flex w-full items-center justify-between gap-3">
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={onPrev}
          disabled={disablePrev}
        >
          {prevLabel}
        </Button>
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={onNext}
          disabled={isNextDisabled}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
};

export default WizardNavButtons;
