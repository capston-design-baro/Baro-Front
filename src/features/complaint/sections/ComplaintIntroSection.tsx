import React from 'react';

import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import IntroHeader from '@/shared/ui/IntroHeader';

import Question from '@/features/complaint/components/Question';
import { useComplaintWizard } from '@/features/complaint/stores/useComplaintWizard';

// 칩 컴포넌트 -> colorScheme로 색상 테마 제어 (blue | red)
const ComplaintIntroSection: React.FC = () => {
  const prechecks = useComplaintWizard((s) => s.state.prechecks);
  const toggleConfirm = useComplaintWizard((s) => s.toggleConfirm);
  const setBinaryAnswer = useComplaintWizard((s) => s.setBinaryAnswer);
  const allChecked = useComplaintWizard((s) => s.allChecked());
  const triedNext = useComplaintWizard((s) => s.triedNext);
  const blockedPrecheckId = useComplaintWizard((s) => s.blockedPrecheckId);

  return (
    <section
      className={[
        'flex flex-col items-center',
        'w-full flex-1',
        'pb-6',
        'bg-neutral-0 rounded-400',
      ].join(' ')}
    >
      <IntroHeader
        title="고소장 작성하기"
        lines={[
          '고소장 작성 전에 확인해야 할 것들이 있어요.',
          '원활한 고소장 접수를 위해서 솔직하게 체크해주세요.',
        ]}
        center
        showArrow
      />

      <div className="flex w-full max-w-[520px] flex-1 flex-col items-center justify-center">
        <div className="rounded-300 w-full border border-neutral-200 bg-white shadow-sm">
          {prechecks.map((q, idx) => (
            <Question
              key={q.id}
              q={q}
              onToggleConfirm={toggleConfirm}
              onSetBinary={setBinaryAnswer}
              forceOpenInfo={q.id === blockedPrecheckId}
              isLast={idx === prechecks.length - 1}
            />
          ))}
        </div>
      </div>

      {/* 경고 문구 */}
      <FormErrorMessage
        className="mt-4"
        error={
          triedNext && blockedPrecheckId
            ? '해당 항목에 "예"라고 답하셨어요. 이 경우 고소장 작성이 어려울 수 있으니, 법률 전문가와 먼저 상담해보시는 걸 추천드려요.'
            : triedNext && !allChecked
              ? '모든 항목을 확인하고 체크해주세요.'
              : null
        }
      />
    </section>
  );
};

export default ComplaintIntroSection;
