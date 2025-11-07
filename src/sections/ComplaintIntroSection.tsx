import FormErrorMessage from '@/components/FormErrorMessage';
import IntroHeader from '@/components/IntroHeader';
import Question from '@/components/Question';
import { useComplaintWizard } from '@/stores/useComplaintWizard';
import React from 'react';

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
        'flex flex-col items-center justify-between',
        'h-[620px] w-full max-w-[1000px]',
        'pb-6',
        'bg-neutral-0 rounded-400',
      ].join(' ')}
    >
      <IntroHeader
        title="고소장 작성하기"
        lines={[
          '고소장 작성 전에 확인해야 할 것들이 있어요.',
          '고소장 접수가 불가능할 수도 있으니',
          '솔직하게 체크해주세요.',
        ]}
        center
        showArrow
      />

      <div className="flex w-[420px] flex-col gap-6">
        {prechecks.map((q) => (
          <Question
            key={q.id}
            q={q}
            onToggleConfirm={toggleConfirm}
            onSetBinary={setBinaryAnswer}
            forceOpenInfo={q.id === blockedPrecheckId}
          />
        ))}
      </div>

      {/* 경고 문구 */}
      <FormErrorMessage
        error={triedNext && !allChecked ? '모든 안내 사항을 꼼꼼히 읽고 체크해주세요.' : null}
      />
    </section>
  );
};

export default ComplaintIntroSection;
