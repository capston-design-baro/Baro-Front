import React from 'react';

import { useComplaintWizard } from '@/features/complaint/stores/useComplaintWizard';

type Props = {
  onExit?: () => void;
  className?: string;
};

const STEP_LABELS: Record<number, { icon: string; label: string }> = {
  0: { icon: 'play_circle', label: '시작하기' },
  1: { icon: 'info', label: '안내 확인' },
  2: { icon: 'person', label: '고소인 정보' },
  3: { icon: 'group', label: '피고소인 정보' },
  4: { icon: 'chat', label: '채팅 안내' },
  5: { icon: 'folder_open', label: '증거 제출' },
  6: { icon: 'smart_toy', label: 'AI 상담' },
  7: { icon: 'description', label: '고소장 생성' },
  8: { icon: 'download', label: '고소장 다운로드' },
};

const WizardProgress: React.FC<Props> = ({ onExit, className = '' }) => {
  const percent = useComplaintWizard((s) => s.percentage());
  const step = useComplaintWizard((s) => s.state.step);
  const stepsTotal = useComplaintWizard((s) => s.state.stepsTotal);

  const current = STEP_LABELS[step] ?? { icon: 'circle', label: `${step + 1}단계` };

  return (
    <section className={`flex w-full flex-col gap-3 ${className}`}>
      {/* 상단: 단계 정보 + 나가기 버튼 */}
      <div className="flex items-center justify-between">
        {/* 왼쪽: 아이콘 + 단계 라벨 */}
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary-400"
            style={{ fontSize: '20px' }}
          >
            {current.icon}
          </span>
          <span className="text-body-3-bold text-neutral-800">{current.label}</span>
        </div>

        {/* 오른쪽: 단계 수 + 퍼센트 + 나가기 */}
        <div className="flex items-center gap-3">
          <span className="text-detail-regular text-neutral-500">
            {step + 1}/{stepsTotal}
          </span>
          <span className="text-detail-bold text-primary-400">{percent}%</span>
          <button
            type="button"
            onClick={onExit}
            className="text-detail-bold flex items-center gap-1 text-neutral-400 transition-colors hover:text-neutral-600"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px' }}
            >
              close
            </span>
            종료
          </button>
        </div>
      </div>

      {/* 진행바 */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-neutral-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="from-primary-300 to-primary-400 h-full rounded-full bg-gradient-to-r shadow-[0_0_8px_rgba(59,130,246,0.4),0_0_2px_rgba(59,130,246,0.6)] transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  );
};

export default WizardProgress;
