import IntroHeader from '@/components/Common/IntroHeader';
import { useComplaintWizard } from '@/stores/useComplaintWizard';
import React from 'react';

const Chip: React.FC<{ active?: boolean; onClick?: () => void; label: string }> = ({
  active,
  onClick,
  label,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'inline-flex h-9 items-center gap-2 rounded-2xl px-4',
      active ? 'bg-blue-100' : 'bg-blue-50',
      'ring-1 ring-blue-200 hover:bg-blue-100',
    ].join(' ')}
    aria-pressed={!!active}
  >
    {/* 체크박스 아이콘 */}
    <span
      className={`material-symbols-outlined text-[20px] leading-none ${
        active ? 'text-blue-600' : 'text-gray-400'
      }`}
      aria-hidden
    >
      {active ? 'check_box' : 'check_box_outline_blank'}
    </span>

    <span className="text-base font-medium text-blue-600">{label}</span>
  </button>
);

const QuestionRow: React.FC<{
  id: string;
  title: string;
  checked: boolean;
  onToggle: () => void;
}> = ({ id, title, checked, onToggle }) => (
  <div className="flex w-[420px] flex-col gap-2 px-3">
    {/* ⬇️ items-start → items-center 로 변경, 그리고 약간의 간격(gap-2) 추가 */}
    <div className="flex w-[400px] items-center justify-between gap-2">
      {/* ⬇️ 줄높이 균질화를 위해 leading-tight */}
      <p className="text-xl leading-tight font-medium text-black">{title}</p>
      {/* ⬇️ 아이콘에 leading-none + align-middle 로 수직 정렬 보정 */}
      <span
        className="material-symbols-outlined align-middle text-[24px] leading-none text-gray-600"
        aria-hidden
      >
        info
      </span>
    </div>
    <div className="flex h-12 w-[400px] items-center justify-end gap-6">
      <Chip
        active={checked}
        onClick={onToggle}
        label="관련 안내를 확인했습니다."
      />
    </div>
  </div>
);

const ComplaintIntroSection: React.FC = () => {
  const prechecks = useComplaintWizard((s) => s.state.prechecks);
  const toggle = useComplaintWizard((s) => s.toggleConfirm);
  const allChecked = useComplaintWizard((s) => s.allChecked());
  const triedNext = useComplaintWizard((s) => s.triedNext);

  return (
    <section className="flex h-[680px] w-[720px] flex-col items-center justify-between overflow-hidden px-[110px] pt-[60px] pb-6">
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

      {/* 아래는 기존 질문 리스트 */}
      <div className="flex h-[325px] w-[420px] flex-col gap-6 py-6">
        {prechecks.map((q) => (
          <div
            key={q.id}
            className="flex w-[420px] flex-col gap-2 px-3"
          >
            <div className="flex w-[400px] items-center justify-between gap-2">
              <p className="text-xl leading-tight font-medium text-black">{q.title}</p>
              <span
                className="material-symbols-outlined align-middle text-[24px] leading-none text-gray-600"
                aria-hidden
              >
                info
              </span>
            </div>

            <div className="flex h-12 w-[400px] items-center justify-end gap-6">
              <Chip
                active={q.confirmChip.checked}
                onClick={() => toggle(q.id)}
                label="관련 안내를 확인했습니다."
              />
            </div>
          </div>
        ))}
      </div>

      {/* 안내 문구 (항상 공간을 차지: invisible로 토글) */}
      <div className="mt-1 flex min-h-[24px] items-center justify-center">
        <div
          className={`flex items-center gap-1 text-sm font-medium transition-opacity duration-200 ${
            triedNext && !allChecked ? 'visible text-red-500 opacity-100' : 'invisible opacity-0'
          }`}
          role={allChecked ? undefined : 'alert'}
          aria-live="polite"
        >
          {/* cancel 아이콘 */}
          <span
            className="material-symbols-outlined text-[18px] text-red-500"
            aria-hidden
          >
            cancel
          </span>
          <span>모든 안내 사항을 꼼꼼히 읽고 체크해주세요.</span>
        </div>
      </div>
    </section>
  );
};

export default ComplaintIntroSection;
