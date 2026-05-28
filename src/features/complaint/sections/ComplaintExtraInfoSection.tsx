import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';

import DaumPostcodeButton from '@/shared/ui/DaumPostcodeButton';
import type { DaumPostcodeResult } from '@/shared/ui/DaumPostcodeButton';
import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import IntroHeader from '@/shared/ui/IntroHeader';

// 고소인 추가 정보 타입
export type ComplainantExtraInfo = {
  occupation: string;
  officeAddress: string;
  officePhone: string;
  homePhone: string;
  unknownOccupation: boolean;
  unknownOfficePhone: boolean;
  unknownOfficeAddress: boolean;
  unknownHomePhone: boolean;
};

export type ComplainantExtraInfoSectionHandle = {
  save: () => Promise<ComplainantExtraInfo>;
};

const ComplainantExtraInfoSection = forwardRef<ComplainantExtraInfoSectionHandle>((_props, ref) => {
  const formRef = useRef<HTMLFormElement>(null);

  // 입력값 상태
  const [occupation, setOccupation] = useState('');
  const [officeAddr1, setOfficeAddr1] = useState('');
  const [officeAddr2, setOfficeAddr2] = useState('');
  const [officeAddr3, setOfficeAddr3] = useState('');
  const [officePhone, setOfficePhone] = useState('');
  const [homePhone, setHomePhone] = useState('');

  // 비공개 토글
  const [unknownOccupation, setUnknownOccupation] = useState(false);
  const [unknownOfficeAddress, setUnknownOfficeAddress] = useState(false);
  const [unknownOfficePhone, setUnknownOfficePhone] = useState(false);
  const [unknownHomePhone, setUnknownHomePhone] = useState(false);

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

  // 전화번호 포맷팅
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const officePhoneDigits = officePhone.replace(/\D/g, '');
  const homePhoneDigits = homePhone.replace(/\D/g, '');

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

  const officePhoneValue = useMemo(() => {
    if (unknownOfficePhone) return '';
    return officePhoneDigits;
  }, [officePhoneDigits, unknownOfficePhone]);

  const homePhoneValue = useMemo(() => {
    if (unknownHomePhone) return '';
    return homePhoneDigits;
  }, [homePhoneDigits, unknownHomePhone]);

  const handleCheckboxChange = (
    checked: boolean,
    setFlag: React.Dispatch<React.SetStateAction<boolean>>,
    ...setters: React.Dispatch<React.SetStateAction<string>>[]
  ) => {
    setFlag(checked);
    if (checked) setters.forEach((setter) => setter(''));
  };

  const buildExtraInfo = (): ComplainantExtraInfo => {
    if (!unknownOccupation && !occupation.trim()) {
      const msg = '직업을 입력하거나 "비공개"를 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownOfficeAddress && !officeAddress.trim()) {
      const msg = '사무실 주소를 입력하거나 "비공개"를 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownOfficePhone && officePhoneDigits.length < 9) {
      const msg = '사무실 전화번호를 입력하거나 "비공개"를 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownHomePhone && homePhoneDigits.length < 9) {
      const msg = '자택 전화번호를 입력하거나 "비공개"를 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }

    setErr(null);

    return {
      occupation: unknownOccupation ? '비공개' : occupation.trim(),
      officeAddress: unknownOfficeAddress ? '비공개' : officeAddress.trim(),
      officePhone: unknownOfficePhone ? '비공개' : officePhoneValue,
      homePhone: unknownHomePhone ? '비공개' : homePhoneValue,
      unknownOccupation,
      unknownOfficeAddress,
      unknownOfficePhone,
      unknownHomePhone,
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
          '내 직업이나 사무실 정보 등을 추가로 작성해주세요.',
          '공개를 원치 않는 항목은 비워두셔도 괜찮아요.',
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
                  비공개
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
                placeholder={unknownOccupation ? '비공개' : '예: 회사원, 자영업자 등'}
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
                  비공개
                </label>
              </div>
              {unknownOfficeAddress ? (
                <div className="rounded-200 flex h-10 w-full items-center border border-neutral-300 bg-neutral-100 px-3 text-neutral-400">
                  비공개
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

            {/* 사무실 전화번호 */}
            <div className="flex flex-col gap-2 border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center justify-between">
                {renderLabel('사무실 전화번호', true)}
                <label className="text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer"
                    checked={unknownOfficePhone}
                    onChange={(e) => {
                      if (e.target.checked) setOfficePhone('');
                      setUnknownOfficePhone(e.target.checked);
                    }}
                  />
                  비공개
                </label>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                placeholder={unknownOfficePhone ? '비공개' : '02-1234-5678'}
                value={officePhone}
                onChange={(e) => setOfficePhone(formatPhone(e.target.value))}
                disabled={unknownOfficePhone}
                className={[
                  'rounded-200 h-10 w-full px-3',
                  'border border-neutral-300',
                  'disabled:bg-neutral-100 disabled:text-neutral-400',
                  'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
                ].join(' ')}
                autoComplete="tel"
              />
            </div>

            {/* 자택 전화번호 */}
            <div className="flex flex-col gap-2 px-5 py-4">
              <div className="flex items-center justify-between">
                {renderLabel('자택 전화번호', true)}
                <label className="text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer"
                    checked={unknownHomePhone}
                    onChange={(e) => {
                      if (e.target.checked) setHomePhone('');
                      setUnknownHomePhone(e.target.checked);
                    }}
                  />
                  비공개
                </label>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                placeholder={unknownHomePhone ? '비공개' : '02-1234-5678'}
                value={homePhone}
                onChange={(e) => setHomePhone(formatPhone(e.target.value))}
                disabled={unknownHomePhone}
                className={[
                  'rounded-200 h-10 w-full px-3',
                  'border border-neutral-300',
                  'disabled:bg-neutral-100 disabled:text-neutral-400',
                  'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
                ].join(' ')}
                autoComplete="tel"
              />
            </div>
          </div>
        </div>

        <FormErrorMessage error={err} />
      </form>
    </section>
  );
});

export default ComplainantExtraInfoSection;
