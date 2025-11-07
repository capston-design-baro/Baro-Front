import { useComplaintWizard } from '@/stores/useComplaintWizard';
import React from 'react';

type Props = {
  // 나가기 콜백 함수
  onExit?: () => void;

  // 외부에서 전달할 추가 tailwind 클래스
  className?: string;
};

const WizardProgress: React.FC<Props> = ({ onExit, className = '' }) => {
  // 진행률 (0 ~ 100) -> 스토어의 현재 step / total에 따라 계산됨
  const percent = useComplaintWizard((s) => s.percentage());

  return (
    // 상단 진행 영역 전체 래퍼
    <section className={`flex w-full flex-col gap-4 ${className}`}>
      {/* 진행바 컨테이너: 배지 포지셔닝을 위해 relative */}
      <div className="relative w-full">
        {/* 회색 진행바 */}
        <div
          className="rounded-400 h-3 w-full overflow-hidden bg-neutral-200/50"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* 실제 채워지는(파란색) 진행 바: width %로 제어 */}
          <div
            className="bg-primary-400 rounded-400 h-full transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* 나가기 버튼 -> 우측 정렬 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onExit}
          className={[
            'inline-flex items-center justify-center gap-2',
            'rounded-300 bg-neutral-0 h-9 border border-neutral-300 px-4 py-1.5',
            'text-detail-bold text-neutral-600 shadow-sm transition-all',
            'hover:bg-neutral-100/50 hover:text-neutral-800',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400',
          ].join(' ')}
        >
          <span
            className="material-symbols-outlined leading-none text-neutral-600"
            style={{ fontSize: '16px' }}
            aria-hidden
          >
            logout
          </span>
          작성 종료
        </button>
      </div>
    </section>
  );
};

export default WizardProgress;
