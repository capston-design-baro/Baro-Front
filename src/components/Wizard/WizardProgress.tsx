// src/components/Wizard/WizardProgress.tsx
import { useComplaintWizard } from '@/stores/useComplaintWizard';
import React from 'react';

type Props = {
  onExit?: () => void;
  className?: string;
  showEncourageBadge?: boolean;
};

const WizardProgress: React.FC<Props> = ({ onExit, className = '', showEncourageBadge = true }) => {
  const percent = useComplaintWizard((s) => s.percentage());

  return (
    <section className={`flex w-full flex-col gap-4 ${className}`}>
      {/* 상단: 진행바 + 배지 중앙 */}
      <div className="relative w-full">
        {/* 회색 진행바 */}
        <div
          className="h-3 w-full overflow-hidden rounded-md bg-gray-200"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-md bg-blue-600 transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* 중앙 배지 */}
        {showEncourageBadge && (
          <div className="absolute -top-10 left-1/2 flex h-[30px] w-[200px] -translate-x-1/2 items-center justify-center rounded-2xl bg-blue-50 px-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
            <p className="text-base font-medium text-slate-900">잘 하고 있어요!</p>
          </div>
        )}
      </div>

      {/* 나가기 버튼: 우측 정렬 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex h-[30px] items-center gap-1.5 rounded-2xl border border-red-500 bg-white/30 px-3 py-[3px] text-sm font-medium text-red-500/80 hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          aria-label="나가기"
        >
          <span
            className="material-symbols-outlined text-[20px] leading-none text-red-600"
            aria-hidden
          >
            delete_forever
          </span>
          나가기
        </button>
      </div>
    </section>
  );
};

export default WizardProgress;
