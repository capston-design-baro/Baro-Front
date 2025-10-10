import IntroHeader from '@/components/Common/IntroHeader';
import { useComplaintWizard } from '@/stores/useComplaintWizard';
import type { PrecheckQuestion } from '@/types/complaint';
import React from 'react';

// 칩 컴포넌트 -> colorScheme로 색상 테마 제어 (blue | red)
const Chip: React.FC<{
  active?: boolean;
  onClick?: () => void;
  label: string;
  colorScheme?: 'blue' | 'red';
}> = ({ active, onClick, label, colorScheme = 'blue' }) => {
  const scheme =
    colorScheme === 'red'
      ? {
          activeBg: 'bg-red-100',
          inactiveBg: 'bg-red-50',
          ring: 'ring-red-200',
          text: active ? 'text-red-600' : 'text-gray-400',
          label: 'text-red-600',
          focus: 'focus-visible:ring-red-400',
          hover: 'hover:bg-red-100',
        }
      : {
          activeBg: 'bg-blue-100',
          inactiveBg: 'bg-blue-50',
          ring: 'ring-blue-200',
          text: active ? 'text-blue-600' : 'text-gray-400',
          label: 'text-blue-600',
          focus: 'focus-visible:ring-blue-400',
          hover: 'hover:bg-blue-100',
        };

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex h-6 items-center gap-2 rounded-2xl px-4',
        active ? scheme.activeBg : scheme.inactiveBg,
        'ring-1',
        scheme.ring,
        scheme.hover,
        'focus:outline-none',
        'focus-visible:ring-2',
        scheme.focus,
        'transition-colors',
      ].join(' ')}
      aria-pressed={!!active}
    >
      <span
        className={['material-symbols-outlined text-[20px] leading-none', scheme.text].join(' ')}
        aria-hidden
      >
        {active ? 'check_box' : 'check_box_outline_blank'}
      </span>
      <span className={['text-sm font-medium', scheme.label].join(' ')}>{label}</span>
    </button>
  );
};

// 질문 행
const QuestionRow: React.FC<{
  q: PrecheckQuestion;
  onToggleConfirm: (id: string) => void;
  onSetBinary: (id: string, answer: 'yes' | 'no') => void;
}> = ({ q, onToggleConfirm, onSetBinary }) => (
  <div className="flex w-[420px] flex-col gap-1 px-3">
    <div className="flex w-[400px] items-center justify-between gap-2">
      <p className="text-lg leading-tight font-medium text-black">{q.title}</p>
      <span
        className="material-symbols-outlined align-middle text-[24px] leading-none text-gray-600"
        aria-hidden
      >
        info
      </span>
    </div>

    <div className="flex h-12 w-[400px] items-center justify-end gap-3">
      {q.kind === 'binary' ? (
        <>
          {/* 예 = 붉은색 */}
          <Chip
            active={q.answer === 'yes'}
            onClick={() => onSetBinary(q.id, 'yes')}
            label="예"
            colorScheme="red"
          />
          {/* 아니오 = 파란색 */}
          <Chip
            active={q.answer === 'no'}
            onClick={() => onSetBinary(q.id, 'no')}
            label="아니오"
            colorScheme="blue"
          />
        </>
      ) : (
        <Chip
          active={!!q.confirmChip?.checked}
          onClick={() => onToggleConfirm(q.id)}
          label={q.confirmChip?.label ?? '관련 안내를 확인했습니다.'}
          colorScheme="blue"
        />
      )}
    </div>
  </div>
);

const ComplaintIntroSection: React.FC = () => {
  const prechecks = useComplaintWizard((s) => s.state.prechecks);
  const toggleConfirm = useComplaintWizard((s) => s.toggleConfirm);
  const setBinaryAnswer = useComplaintWizard((s) => s.setBinaryAnswer);
  const allChecked = useComplaintWizard((s) => s.allChecked());
  const triedNext = useComplaintWizard((s) => s.triedNext);

  return (
    <section className="flex h-[620px] w-[720px] flex-col items-center justify-between overflow-hidden px-[110px] pt-[60px] pb-6">
      <IntroHeader
        title="고소장 작성하기"
        lines={[
          '고소장 작성 전에 확인해야 할 것들이 있어요.',
          '고소장 접수가 불가능할 수도 있으니',
          '솔직하게 체크해주세요.',
        ]}
        center
        showArrow
        arrowSize={24}
        arrowOpacity={0.5}
        arrowFrom="#333333"
        arrowTo="#2563EB"
      />

      <div className="flex w-[420px] flex-col gap-6 py-6">
        {prechecks.map((q) => (
          <QuestionRow
            key={q.id}
            q={q}
            onToggleConfirm={toggleConfirm}
            onSetBinary={setBinaryAnswer}
          />
        ))}
      </div>

      <div className="mt-1 flex min-h-[24px] items-center justify-center">
        <div
          className={`flex items-center gap-1 text-sm font-medium transition-opacity duration-200 ${
            triedNext && !allChecked ? 'visible text-red-500 opacity-100' : 'invisible opacity-0'
          }`}
          role={triedNext && !allChecked ? 'alert' : undefined}
          aria-live="polite"
        >
          <span
            className="material-symbols-outlined align-middle text-[18px] leading-none text-red-500"
            aria-hidden
          >
            cancel
          </span>
          <span className="leading-tight">모든 안내 사항을 꼼꼼히 읽고 체크해주세요.</span>
        </div>
      </div>
    </section>
  );
};

export default ComplaintIntroSection;
