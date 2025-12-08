import FormErrorMessage from '@/components/FormErrorMessage';
import IntroHeader from '@/components/IntroHeader';
import { forwardRef, useImperativeHandle, useState } from 'react';

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
      className={[
        'flex flex-col items-center justify-between',
        'h-[600px] w-full max-w-[1000px]',
        'pb-6',
        'bg-neutral-0',
      ].join(' ')}
    >
      <IntroHeader
        title="증거 유무 확인"
        lines={[
          '확보한 증거들이 있나요?',
          '증거 확보 유무만 체크해주고,',
          '확보한 증거가 있다면 따로 관할서에 제출하면 돼요.',
        ]}
        center
        showArrow
      />
      <div className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setSelection('yes')}
          className={[
            'rounded-300 flex w-full items-center gap-2 border px-4 py-3 text-left',
            // ghost base
            'to-neutral-0/10 bg-radial from-neutral-200/40 via-neutral-100/10',
            'border',
            'shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)]',
            'backdrop-blur-md',
            'transition-all duration-300 ease-out',
            // active vs default
            isYesActive
              ? 'border-primary-300 ring-primary-200 ring-2'
              : 'hover:ring-primary-50/40 border-white/50 hover:border-white/70 hover:ring-2',
          ].join(' ')}
        >
          <span
            className={[
              'inline-flex h-5 w-5 items-center justify-center',
              selection === 'yes' ? 'text-primary-500' : 'text-neutral-400',
            ].join(' ')}
          >
            <span
              className="material-symbols-outlined leading-none"
              style={{ fontSize: '20px' }}
            >
              {selection === 'yes' ? 'check_box' : 'check_box_outline_blank'}
            </span>
          </span>
          <div className="flex flex-col">
            <span className="text-body-4-bold text-neutral-900">네, 제출할 증거가 있어요.</span>
            <span className="text-caption-regular text-neutral-600">
              캡처본, 녹취, 진단서, 영수증 등 이미 가지고 있는 자료가 있습니다.
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelection('no')}
          className={[
            'rounded-300 flex w-full items-center gap-2 border px-4 py-3 text-left',
            // ghost base
            'to-neutral-0/10 bg-radial from-neutral-200/40 via-neutral-100/10',
            'border',
            'shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)]',
            'backdrop-blur-md',
            'transition-all duration-300 ease-out',
            // active vs default
            isNoActive
              ? 'border-primary-300 ring-primary-200 ring-2'
              : 'hover:ring-primary-50/40 border-white/50 hover:border-white/70 hover:ring-2',
          ].join(' ')}
        >
          <span
            className={[
              'inline-flex h-5 w-5 items-center justify-center',
              selection === 'no' ? 'text-primary-500' : 'text-neutral-400',
            ].join(' ')}
          >
            <span
              className="material-symbols-outlined leading-none"
              style={{ fontSize: '20px' }}
            >
              {selection === 'no' ? 'check_box' : 'check_box_outline_blank'}
            </span>
          </span>
          <div className="flex flex-col">
            <span className="text-body-4-bold text-neutral-900">
              아니요, 아직 준비된 증거가 없어요.
            </span>
            <span className="text-caption-regular text-neutral-600">
              지금 당장은 없지만, 이후에 증거를 확보할 수 있을 수도 있습니다.
            </span>
          </div>
        </button>
      </div>
      {/* 경고 문구 */}
      <FormErrorMessage error={error} />
      <p className="text-body-3-regular mt-4 text-neutral-500">
        * 증거가 없더라도 고소는 가능합니다.
        <br />
        &nbsp;&nbsp;다만 이후 수사 과정에서 추가 자료 제출이 필요할 수 있습니다.
      </p>
    </section>
  );
});

EvidenceInfoSection.displayName = 'EvidenceInfoSection';

export default EvidenceInfoSection;
