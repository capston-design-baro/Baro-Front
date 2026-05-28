import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';

import DaumPostcodeButton from '@/shared/ui/DaumPostcodeButton';
import type { DaumPostcodeResult } from '@/shared/ui/DaumPostcodeButton';
import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import IntroHeader from '@/shared/ui/IntroHeader';

// 부모에서 사용할 타입
export type AccusedBasicInfo = {
  name: string;
  email: string;
  address: string | null;
  phone: string;
  unknownName: boolean;
  unknownEmail: boolean;
  unknownAddr: boolean;
  unknownPhone: boolean;
};

// 외부에서 save()를 호출할 수 있도록 노출
export type AccusedInfoSectionHandle = {
  save: () => Promise<AccusedBasicInfo>;
};

type Props = {
  complaintId: number;
};

const AccusedInfoSection = forwardRef<AccusedInfoSectionHandle, Props>(({ complaintId }, ref) => {
  // 입력값
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [addr3, setAddr3] = useState('');
  const [phone, setPhone] = useState('');

  // 모름 토글
  const [unknownName, setUnknownName] = useState(false);
  const [unknownEmail, setUnknownEmail] = useState(false);
  const [unknownAddr, setUnknownAddr] = useState(false);
  const [unknownPhone, setUnknownPhone] = useState(false);

  // UI
  const [err, setErr] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // 주소가 주소 찾기로 한 번이라도 세팅된 적 있는지
  const [hasAddress, setHasAddress] = useState(false);

  // 주소 선택 콜백
  const handleAddressSelect = (data: DaumPostcodeResult) => {
    setAddr1(data.sido);
    setAddr2(data.sigungu);
    setAddr3(data.bname);
    setHasAddress(true);
    setUnknownAddr(false);
    setErr(null);
  };

  // 전화번호 포맷팅
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const phoneDigits = phone.replace(/\D/g, '');

  // 공통 라벨 렌더러 (고소인 섹션과 동일 스타일)
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

  // 주소 문자열
  const address = useMemo(() => {
    if (unknownAddr) return '';
    return [addr1, addr2, addr3].filter(Boolean).join(' ').trim();
  }, [addr1, addr2, addr3, unknownAddr]);

  // 전화번호 문자열
  const phoneValue = useMemo(() => {
    if (unknownPhone) return '';
    return phoneDigits;
  }, [phoneDigits, unknownPhone]);

  // 유효성 검사 + 최종 객체 만들기
  const buildBasicInfo = (): AccusedBasicInfo => {
    if (!Number.isFinite(complaintId) || complaintId <= 0) {
      const msg = '잘못된 고소장 ID입니다.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownName && !name.trim()) {
      const msg = '이름을 입력하거나 "모름"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownEmail && !email.trim()) {
      const msg = '이메일을 입력하거나 "모름"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownAddr && !address) {
      const msg = '주소를 입력하거나 "모름"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownPhone && phoneDigits.length < 10) {
      const msg = '연락처를 입력하거나 "모름"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }

    setErr(null);

    return {
      name: unknownName ? ' ' : name.trim(),
      email: unknownEmail ? ' ' : email.trim(),
      address: unknownAddr ? null : address,
      phone: unknownPhone ? ' ' : phoneValue,
      unknownName,
      unknownEmail,
      unknownAddr,
      unknownPhone,
    };
  };

  // 모름 체크 핸들러
  const handleCheckboxChange = (
    checked: boolean,
    setFlag: React.Dispatch<React.SetStateAction<boolean>>,
    ...setters: React.Dispatch<React.SetStateAction<string>>[]
  ) => {
    setFlag(checked);
    if (checked) setters.forEach((setter) => setter(''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      buildBasicInfo();
    } catch {
      // 에러 메시지는 이미 setErr로 처리됨
    }
  };

  // 외부에서 save() 호출 가능하게
  useImperativeHandle(ref, () => ({
    save: async () => {
      const info = buildBasicInfo();
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
          '상대방에 대한 기본 정보를 작성해주세요.',
          '알고 있는 범위 내에서만 상대방 정보를 작성해도 괜찮아요.',
        ]}
        center
        showArrow
      />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-6 flex w-[420px] flex-1 flex-col justify-center gap-5"
      >
        {/* 입력 필드 카드 */}
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-300 w-full max-w-[520px] border border-neutral-200 bg-white shadow-sm">
            {/* 이름 */}
            <div className="flex flex-col gap-2 border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center justify-between">
                {renderLabel('이름', true)}
                <label className="text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer"
                    checked={unknownName}
                    onChange={(e) =>
                      handleCheckboxChange(e.target.checked, setUnknownName, setName)
                    }
                  />
                  모름
                </label>
              </div>
              <input
                disabled={unknownName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={[
                  'rounded-200 h-10 w-full px-3',
                  'border border-neutral-300',
                  'disabled:bg-neutral-100 disabled:text-neutral-400',
                  'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
                ].join(' ')}
                placeholder={unknownName ? '모름' : '이름 입력'}
                type="text"
              />
            </div>

            {/* 이메일 */}
            <div className="flex flex-col gap-2 border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center justify-between">
                {renderLabel('이메일', true)}
                <label className="text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer"
                    checked={unknownEmail}
                    onChange={(e) =>
                      handleCheckboxChange(e.target.checked, setUnknownEmail, setEmail)
                    }
                  />
                  모름
                </label>
              </div>
              <input
                disabled={unknownEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={[
                  'rounded-200 h-10 w-full px-3',
                  'border border-neutral-300',
                  'disabled:bg-neutral-100 disabled:text-neutral-400',
                  'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
                ].join(' ')}
                placeholder={unknownEmail ? '모름' : '이메일 입력'}
                type="text"
              />
            </div>

            {/* 주소 */}
            <div className="flex flex-col gap-2 border-b border-neutral-100 px-5 py-4">
              <div className="flex items-center justify-between">
                {renderLabel('주소', true)}
                <label className="text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer"
                    checked={unknownAddr}
                    onChange={(e) => {
                      handleCheckboxChange(
                        e.target.checked,
                        setUnknownAddr,
                        setAddr1,
                        setAddr2,
                        setAddr3,
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
              {unknownAddr ? (
                <div className="rounded-200 flex h-10 w-full items-center border border-neutral-300 bg-neutral-100 px-3 text-neutral-400">
                  모름
                </div>
              ) : (
                <DaumPostcodeButton
                  onSelect={handleAddressSelect}
                  address={hasAddress ? { city: addr1, district: addr2, town: addr3 } : undefined}
                />
              )}
            </div>

            {/* 전화번호 */}
            <div className="flex flex-col gap-2 px-5 py-4">
              <div className="flex items-center justify-between">
                {renderLabel('전화번호', true)}
                <label className="text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer"
                    checked={unknownPhone}
                    onChange={(e) => {
                      if (e.target.checked) setPhone('');
                      setUnknownPhone(e.target.checked);
                    }}
                  />
                  모름
                </label>
              </div>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder={unknownPhone ? '모름' : '010-1234-5678'}
                value={phone}
                onChange={handlePhoneChange}
                disabled={unknownPhone}
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

        {/* 에러 메시지 */}
        <FormErrorMessage error={err} />
      </form>
    </section>
  );
});

export default AccusedInfoSection;
