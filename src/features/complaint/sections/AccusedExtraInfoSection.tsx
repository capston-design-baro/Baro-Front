import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';

import DaumPostcodeButton from '@/shared/ui/DaumPostcodeButton';
import type { DaumPostcodeResult } from '@/shared/ui/DaumPostcodeButton';
import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import IntroHeader from '@/shared/ui/IntroHeader';

// 피고소인 추가 정보 타입
export type AccusedExtraInfo = {
  occupation: string;
  officeAddress: string;
  etc: string;
  unknownOccupation: boolean;
  unknownOfficeAddress: boolean;
};

export type AccusedExtraInfoSectionHandle = {
  save: () => Promise<AccusedExtraInfo>;
};

type Props = {
  complaintId: number;
};

const AccusedExtraInfoSection = forwardRef<AccusedExtraInfoSectionHandle, Props>((_props, ref) => {
  const formRef = useRef<HTMLFormElement>(null);

  // 입력값 상태
  const [occupation, setOccupation] = useState('');
  const [officeAddr1, setOfficeAddr1] = useState('');
  const [officeAddr2, setOfficeAddr2] = useState('');
  const [officeAddr3, setOfficeAddr3] = useState('');
  const [etc, setEtc] = useState('');

  // 모름 토글
  const [unknownOccupation, setUnknownOccupation] = useState(false);
  const [unknownOfficeAddress, setUnknownOfficeAddress] = useState(false);

  // 에러
  const [err, setErr] = useState<string | null>(null);
  const [hasAddress, setHasAddress] = useState(false);

  // 주소 선택 콜백
  const handleAddressSelect = (data: DaumPostcodeResult) => {
    setOfficeAddr1(data.sido);
    setOfficeAddr2(data.sigungu);
    setOfficeAddr3(data.bname);
    setHasAddress(true);
    setUnknownOfficeAddress(false);
    setErr(null);
  };

  const renderLabel = (text: string, required: boolean) => {
    const labelText = required ? '(필수)' : '(선택)';
    return (
      <label className="text-body-3-regular text-neutral-900">
        <span
          className={
            required
              ? 'text-detail-bold text-positive-200 mr-4'
              : 'text-detail-bold mr-2 text-neutral-500'
          }
        >
          {labelText}
        </span>
        {text}
      </label>
    );
  };

  const officeAddress = useMemo(() => {
    if (unknownOfficeAddress) return '';
    return [officeAddr1, officeAddr2, officeAddr3].filter(Boolean).join(' ').trim();
  }, [officeAddr1, officeAddr2, officeAddr3, unknownOfficeAddress]);

  const handleCheckboxChange = (
    checked: boolean,
    setFlag: React.Dispatch<React.SetStateAction<boolean>>,
    ...setters: React.Dispatch<React.SetStateAction<string>>[]
  ) => {
    setFlag(checked);
    if (checked) setters.forEach((setter) => setter(''));
  };

  const buildExtraInfo = (): AccusedExtraInfo => {
    if (!unknownOccupation && !occupation.trim()) {
      const msg = '직업을 입력하거나 "모름"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownOfficeAddress && !officeAddress.trim()) {
      const msg = '사무실 주소를 입력하거나 "모름"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }

    setErr(null);

    return {
      occupation: unknownOccupation ? ' ' : occupation.trim(),
      officeAddress: unknownOfficeAddress ? ' ' : officeAddress.trim(),
      etc: etc.trim(),
      unknownOccupation,
      unknownOfficeAddress,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      buildExtraInfo();
    } catch {
      // setErr로 처리됨
    }
  };

  useImperativeHandle(ref, () => ({
    save: async () => {
      const info = buildExtraInfo();
      return info;
    },
  }));

  return (
    <section
      className={['flex flex-col items-center', 'w-full flex-1', 'pb-6', 'bg-neutral-0'].join(' ')}
    >
      <IntroHeader
        title="고소장 작성하기"
        lines={[
          '피고소인의 직업이나 사무실 정보 등을 알고 있다면 아래에 추가로 작성해주세요.',
          '모르시는 항목은 비워두셔도 괜찮아요.',
        ]}
        center
        showArrow
      />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-2 flex w-full flex-1 flex-col justify-center gap-5"
      >
        {/* 입력 필드 카드 */}
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-300 w-full max-w-[520px] border border-neutral-200 bg-white shadow-sm">
            {/* 직업 */}
            <div className="flex flex-col gap-2 border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center justify-between">
                {renderLabel('직업', true)}
                <label className="text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer"
                    checked={unknownOccupation}
                    onChange={(e) =>
                      handleCheckboxChange(e.target.checked, setUnknownOccupation, setOccupation)
                    }
                  />
                  모름
                </label>
              </div>
              <input
                disabled={unknownOccupation}
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className={[
                  'rounded-200 h-10 w-full px-3',
                  'border border-neutral-300',
                  'disabled:bg-neutral-100 disabled:text-neutral-400',
                  'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
                ].join(' ')}
                placeholder={unknownOccupation ? '모름' : '예: 회사원, 자영업자 등'}
                type="text"
              />
            </div>

            {/* 사무실 주소 */}
            <div className="flex flex-col gap-2 border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center justify-between">
                {renderLabel('사무실 주소', true)}
                <label className="text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer"
                    checked={unknownOfficeAddress}
                    onChange={(e) => {
                      handleCheckboxChange(
                        e.target.checked,
                        setUnknownOfficeAddress,
                        setOfficeAddr1,
                        setOfficeAddr2,
                        setOfficeAddr3,
                      );
                      if (e.target.checked) {
                        setErr(null);
                        setHasAddress(false);
                      }
                    }}
                  />
                  모름
                </label>
              </div>
              {unknownOfficeAddress ? (
                <div className="rounded-200 flex h-10 w-full items-center border border-neutral-300 bg-neutral-100 px-3 text-neutral-400">
                  모름
                </div>
              ) : (
                <DaumPostcodeButton
                  onSelect={handleAddressSelect}
                  address={
                    hasAddress
                      ? { city: officeAddr1, district: officeAddr2, town: officeAddr3 }
                      : undefined
                  }
                />
              )}
            </div>

            {/* 기타 정보 */}
            <div className="flex flex-col gap-2 px-5 py-4">
              {renderLabel('기타 정보', false)}
              <textarea
                value={etc}
                onChange={(e) => setEtc(e.target.value)}
                className={[
                  'rounded-200 w-full px-3 py-2',
                  'border border-neutral-300',
                  'min-h-[120px] resize-y',
                  'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
                ].join(' ')}
                placeholder="피고소인의 계좌 번호, 피고소인과의 관계 등 피고소인을 특정할 수 있는 정보를 알려주세요."
              />
            </div>
          </div>
        </div>

        <FormErrorMessage error={err} />
      </form>
    </section>
  );
});

export default AccusedExtraInfoSection;
