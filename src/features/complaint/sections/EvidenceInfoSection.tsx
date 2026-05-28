import { forwardRef, useImperativeHandle, useState } from 'react';

import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import IntroHeader from '@/shared/ui/IntroHeader';

export type EvidenceInfo = {
  hasEvidence: boolean;
};

export type EvidenceInfoSectionHandle = {
  save: () => Promise<EvidenceInfo>;
};

const EvidenceInfoSection = forwardRef<EvidenceInfoSectionHandle>((_props, ref) => {
  const [selection, setSelection] = useState<'yes' | 'no' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    async save() {
      if (!selection) {
        setError('증거 제출 여부를 선택해 주세요.');
        throw new Error('evidence_not_selected');
      }

      setError(null);

      return {
        hasEvidence: selection === 'yes',
      };
    },
  }));

  const isYesActive = selection === 'yes';
  const isNoActive = selection === 'no';

  return (
    <section
      className={['flex flex-col items-center', 'w-full flex-1', 'pb-6', 'bg-neutral-0'].join(' ')}
    >
      <IntroHeader
        title="증거 유무 확인"
        lines={[
          '확보한 증거들이 있나요?',
          '증거 확보 유무만 체크해주고, 확보한 증거가 있다면 따로 관할서에 제출하면 돼요.',
        ]}
        center
        showArrow
      />

      <div className="grid w-full flex-1 grid-cols-1 place-content-center gap-4 px-4 md:grid-cols-2 md:gap-6">
        {/* 네, 증거가 있어요 */}
        <button
          type="button"
          onClick={() => {
            setSelection('yes');
            setError(null);
          }}
          className={[
            'group relative flex w-full flex-col items-center justify-center gap-4',
            'rounded-300 px-6 py-10',
            'border-2 bg-white',
            'transition-all duration-200 ease-out',
            isYesActive
              ? 'border-primary-400 bg-primary-0/30 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
              : 'hover:border-primary-300 border-neutral-200 hover:shadow-md',
          ].join(' ')}
        >
          <div
            className={[
              'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
              isYesActive ? 'bg-primary-400' : 'group-hover:bg-primary-100 bg-neutral-100',
            ].join(' ')}
          >
            <span
              className={[
                'material-symbols-outlined transition-colors',
                isYesActive ? 'text-white' : 'group-hover:text-primary-400 text-neutral-500',
              ].join(' ')}
              style={{ fontSize: '28px' }}
            >
              folder_open
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p
              className={[
                'text-body-2-bold transition-colors',
                isYesActive ? 'text-primary-500' : 'text-neutral-800',
              ].join(' ')}
            >
              네, 증거가 있어요
            </p>
            <p className="text-detail-regular text-neutral-400">
              캡처본, 녹취, 진단서 등
              <br />
              제출할 자료가 있어요
            </p>
          </div>
        </button>

        {/* 아니요, 없어요 */}
        <button
          type="button"
          onClick={() => {
            setSelection('no');
            setError(null);
          }}
          className={[
            'group relative flex w-full flex-col items-center justify-center gap-4',
            'rounded-300 px-6 py-10',
            'border-2 bg-white',
            'transition-all duration-200 ease-out',
            isNoActive
              ? 'border-primary-400 bg-primary-0/30 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
              : 'hover:border-primary-300 border-neutral-200 hover:shadow-md',
          ].join(' ')}
        >
          <div
            className={[
              'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
              isNoActive ? 'bg-primary-400' : 'group-hover:bg-primary-100 bg-neutral-100',
            ].join(' ')}
          >
            <span
              className={[
                'material-symbols-outlined transition-colors',
                isNoActive ? 'text-white' : 'group-hover:text-primary-400 text-neutral-500',
              ].join(' ')}
              style={{ fontSize: '28px' }}
            >
              block
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p
              className={[
                'text-body-2-bold transition-colors',
                isNoActive ? 'text-primary-500' : 'text-neutral-800',
              ].join(' ')}
            >
              아니요, 없어요
            </p>
            <p className="text-detail-regular text-neutral-400">
              지금은 없지만
              <br />
              이후에 확보할 수도 있어요
            </p>
          </div>
        </button>
      </div>

      <FormErrorMessage
        error={error}
        className="mt-4"
      />

      <p className="text-detail-regular mt-3 text-center text-neutral-400">
        증거가 없더라도 고소는 가능해요.
        <br />
        다만 수사 과정에서 추가 자료 제출이 필요할 수 있어요.
      </p>
    </section>
  );
});

EvidenceInfoSection.displayName = 'EvidenceInfoSection';

export default EvidenceInfoSection;
