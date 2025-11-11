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
  const baseBtn =
    'rounded-200 text-body-3-bold flex h-12 w-[220px] items-center justify-center px-6 py-[9px]';

  const prevBtnClass = [
    baseBtn,
    disablePrev
      ? 'bg-primary-200 cursor-not-allowed text-neutral-50 opacity-60'
      : 'bg-primary-400 text-neutral-0',
  ].join(' ');

  const nextBtnClass = [
    baseBtn,
    isNextDisabled
      ? 'bg-primary-200 cursor-not-allowed text-neutral-50 opacity-60'
      : 'bg-primary-400 text-neutral-0',
  ].join(' ');

  return (
    <div className="mx-auto flex w-full max-w-[420px] items-center justify-center">
      <div className="flex w-full items-center justify-between gap-3">
        <button
          type="button"
          onClick={!disablePrev ? onPrev : undefined}
          disabled={disablePrev}
          className={prevBtnClass}
        >
          {prevLabel}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={nextBtnClass}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
};

export default WizardNavButtons;
