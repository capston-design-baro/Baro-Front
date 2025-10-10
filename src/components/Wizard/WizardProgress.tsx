import { useComplaintWizard } from '@/stores/useComplaintWizard';
import React from 'react';

type Props = {
  // 나가기 콜백 함수
  onExit?: () => void;

  // 외부에서 전달할 추가 tailwind 클래스
  className?: string;

  // 중앙의 응원 배지 노출 여부 (기본: true)
  showEncourageBadge?: boolean;
};

const WizardProgress: React.FC<Props> = ({ onExit, className = '', showEncourageBadge = true }) => {
  // 진행률 (0 ~ 100) -> 스토어의 현재 step / total에 따라 계산됨
  const percent = useComplaintWizard((s) => s.percentage());

  return (
    // 상단 진행 영역 전체 래퍼
    <section className={`flex w-full flex-col gap-4 ${className}`}>
      {/* 진행바 컨테이너: 배지 포지셔닝을 위해 relative */}
      <div className="relative w-full">
        {/* 회색 진행바 */}
        <div
          className="h-3 w-full overflow-hidden rounded-md bg-gray-200"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* 실제 채워지는(파란색) 진행 바: width %로 제어, 애니메이션 부드럽게 */}
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

      {/* 나가기 버튼 -> 우측 정렬 */}
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
