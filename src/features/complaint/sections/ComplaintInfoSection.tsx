import type { AxiosError } from 'axios';

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import DaumPostcodeButton from '@/shared/ui/DaumPostcodeButton';
import type { DaumPostcodeResult } from '@/shared/ui/DaumPostcodeButton';
import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import IntroHeader from '@/shared/ui/IntroHeader';
import Button from '@/shared/ui/common/Button';
import { splitAddressTo3FromString } from '@/shared/utils/krContact';

import { getMe } from '@/features/auth/apis/auth';

// 통합 타입
export type ComplainantFullInfo = {
  // basic
  name: string;
  email: string;
  address: string;
  phone: string;
  unknownName: boolean;
  unknownEmail: boolean;
  unknownAddr: boolean;
  unknownPhone: boolean;
  // extra
  occupation: string;
  officeAddress: string;
  officePhone: string;
  homePhone: string;
  unknownOccupation: boolean;
  unknownOfficeAddress: boolean;
  unknownOfficePhone: boolean;
  unknownHomePhone: boolean;
};

// 하위 호환을 위한 별칭
export type ComplaintBasicInfo = ComplainantFullInfo;

type Props = { onLoaded?: () => void };

export type ComplainantInfoSectionHandle = {
  save: () => Promise<ComplainantFullInfo>;
};

const ComplainantInfoSection = forwardRef<ComplainantInfoSectionHandle, Props>(
  ({ onLoaded }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    // 기본 정보 상태
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [addr1, setAddr1] = useState('');
    const [addr2, setAddr2] = useState('');
    const [addr3, setAddr3] = useState('');
    const [phone, setPhone] = useState('');
    const [hasAddress, setHasAddress] = useState(false);

    // 추가 정보 상태
    const [occupation, setOccupation] = useState('');
    const [officeAddr1, setOfficeAddr1] = useState('');
    const [officeAddr2, setOfficeAddr2] = useState('');
    const [officeAddr3, setOfficeAddr3] = useState('');
    const [officePhone, setOfficePhone] = useState('');
    const [homePhone, setHomePhone] = useState('');
    const [hasOfficeAddress, setHasOfficeAddress] = useState(false);

    // 비공개 토글
    const [unknownOccupation, setUnknownOccupation] = useState(false);
    const [unknownOfficeAddress, setUnknownOfficeAddress] = useState(false);
    const [unknownOfficePhone, setUnknownOfficePhone] = useState(false);
    const [unknownHomePhone, setUnknownHomePhone] = useState(false);

    const allExtraPrivate =
      unknownOccupation && unknownOfficeAddress && unknownOfficePhone && unknownHomePhone;

    const handleToggleAllExtra = (checked: boolean) => {
      setUnknownOccupation(checked);
      setUnknownOfficeAddress(checked);
      setUnknownOfficePhone(checked);
      setUnknownHomePhone(checked);
      if (checked) {
        setOccupation('');
        setOfficeAddr1('');
        setOfficeAddr2('');
        setOfficeAddr3('');
        setOfficePhone('');
        setHomePhone('');
        setHasOfficeAddress(false);
      }
    };

    // UI 상태
    const [err, setErr] = useState<string | null>(null);

    // 주소 선택 콜백 (기본)
    const handleAddressSelect = (data: DaumPostcodeResult) => {
      setAddr1(data.sido);
      setAddr2(data.sigungu);
      setAddr3(data.bname);
      setHasAddress(true);
      setErr(null);
    };

    // 주소 선택 콜백 (사무실)
    const handleOfficeAddressSelect = (data: DaumPostcodeResult) => {
      setOfficeAddr1(data.sido);
      setOfficeAddr2(data.sigungu);
      setOfficeAddr3(data.bname);
      setHasOfficeAddress(true);
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

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhone(formatPhone(e.target.value));
    };

    const handleOfficePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setOfficePhone(formatPhone(e.target.value));
    };

    const handleHomePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHomePhone(formatPhone(e.target.value));
    };

    const phoneDigits = phone.replace(/\D/g, '');
    const officePhoneDigits = officePhone.replace(/\D/g, '');

    // 입력값 변경 시 에러 자동 해제
    useEffect(() => {
      if (err) setErr(null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      name,
      email,
      phone,
      addr1,
      occupation,
      officePhone,
      homePhone,
      officeAddr1,
      unknownOccupation,
      unknownOfficeAddress,
      unknownOfficePhone,
      unknownHomePhone,
    ]);
    const homePhoneDigits = homePhone.replace(/\D/g, '');

    const handleCheckboxChange = (
      checked: boolean,
      setFlag: React.Dispatch<React.SetStateAction<boolean>>,
      ...setters: React.Dispatch<React.SetStateAction<string>>[]
    ) => {
      setFlag(checked);
      if (checked) setters.forEach((setter) => setter(''));
    };

    // 내 정보 불러오기
    const handleLoadFromProfile = async () => {
      setErr(null);

      try {
        const me = await getMe();

        setName(me.name ?? '');
        setEmail(me.email ?? '');

        const { a1, a2, a3 } = splitAddressTo3FromString(me.address);
        setAddr1(a1);
        setAddr2(a2);
        setAddr3(a3);

        setHasAddress(Boolean(a1));

        setPhone(formatPhone(me.phone_number ?? ''));
      } catch (e: unknown) {
        const ax = e as AxiosError | undefined;
        const status = ax?.response?.status;
        if (status === 401) setErr('로그인이 필요합니다. 다시 로그인해주세요.');
        else if (status === 403) setErr('접근 권한이 없습니다.');
        else setErr('내 정보를 불러오지 못했어요.');
      }
    };

    // 통합 정보 빌드
    const buildFullInfo = (): ComplainantFullInfo => {
      setErr(null);

      if (!name.trim()) {
        const msg = '이름을 입력해주세요.';
        setErr(msg);
        throw new Error(msg);
      }

      // 추가 정보 검증: 입력하거나 비공개 선택해야 함
      if (!unknownOccupation && !occupation.trim()) {
        const msg = '직업을 입력하거나 비공개를 선택해주세요.';
        setErr(msg);
        throw new Error(msg);
      }
      if (!unknownOfficeAddress && !officeAddr1) {
        const msg = '사무실 주소를 입력하거나 비공개를 선택해주세요.';
        setErr(msg);
        throw new Error(msg);
      }
      if (!unknownOfficePhone && officePhoneDigits.length < 9) {
        const msg = '사무실 전화번호를 입력하거나 비공개를 선택해주세요.';
        setErr(msg);
        throw new Error(msg);
      }
      if (!unknownHomePhone && homePhoneDigits.length < 9) {
        const msg = '자택 전화번호를 입력하거나 비공개를 선택해주세요.';
        setErr(msg);
        throw new Error(msg);
      }

      const address = [addr1, addr2, addr3].filter(Boolean).join(' ').trim();
      const officeAddress = unknownOfficeAddress
        ? '비공개'
        : [officeAddr1, officeAddr2, officeAddr3].filter(Boolean).join(' ').trim();

      return {
        // basic
        name: name.trim(),
        email: email.trim(),
        address,
        phone: phoneDigits,
        unknownName: false,
        unknownEmail: false,
        unknownAddr: false,
        unknownPhone: false,
        // extra
        occupation: unknownOccupation ? '비공개' : occupation.trim(),
        officeAddress,
        officePhone: unknownOfficePhone ? '비공개' : officePhoneDigits,
        homePhone: unknownHomePhone ? '비공개' : homePhoneDigits,
        unknownOccupation,
        unknownOfficeAddress,
        unknownOfficePhone,
        unknownHomePhone,
      };
    };

    useImperativeHandle(ref, () => ({
      save: async () => {
        try {
          const info = buildFullInfo();
          return info;
        } catch (e: unknown) {
          const msg = (e as { message?: string })?.message ?? '에러가 발생했습니다.';
          setErr(msg);
          throw e;
        }
      },
    }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const info = buildFullInfo();
        onLoaded?.();
        void info;
      } catch {
        // 에러는 buildFullInfo 안에서 setErr로 처리됨
      }
    };

    // ID 카드 미리보기용 헬퍼
    const renderIdCardField = (
      label: string,
      value: string,
      hasValue: boolean,
      isPrivate?: boolean,
    ) => (
      <div className="col-span-1">
        <p className="text-detail-regular text-neutral-400">{label}</p>
        {isPrivate ? (
          <p className="text-body-3-bold text-neutral-400 italic">비공개</p>
        ) : (
          <p
            className={`text-body-3-bold transition-colors ${hasValue ? 'text-neutral-900' : 'text-neutral-300'}`}
          >
            {value || '---'}
          </p>
        )}
      </div>
    );

    const inputClass = [
      'rounded-200 h-9 w-full px-3',
      'border border-neutral-300',
      'text-body-3-regular',
      'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
    ].join(' ');

    const disabledInputClass = [
      inputClass,
      'disabled:bg-neutral-100 disabled:text-neutral-400',
    ].join(' ');

    return (
      <section
        className={['flex flex-col items-center', 'w-full flex-1', 'pb-6', 'bg-neutral-0'].join(
          ' ',
        )}
      >
        <IntroHeader
          title="고소장 작성하기"
          lines={[
            '고소장을 작성하려면 내 정보를 적어야 해요.',
            '로그인 시 입력한 정보를 불러올 수도 있고, 직접 입력할 수도 있어요.',
          ]}
          center
          showArrow
        />

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-2 flex w-full flex-1 flex-col items-center justify-center gap-6"
        >
          {/* ID 카드 미리보기 */}
          <div className="w-full max-w-[520px]">
            <div className="border-primary-200 from-primary-0 overflow-hidden rounded-2xl border bg-gradient-to-br to-white shadow-sm">
              {/* 카드 상단 바 */}
              <div className="bg-primary-400 flex items-center justify-between px-5 py-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-white/80"
                    style={{ fontSize: '16px' }}
                  >
                    badge
                  </span>
                  <span className="text-detail-bold text-white/90">고소인 정보</span>
                </div>
              </div>

              {/* 카드 본문 - 기본 정보 */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-b border-neutral-100 px-5 py-4">
                {renderIdCardField('이름', name, Boolean(name))}
                {renderIdCardField('전화번호', phone, Boolean(phone))}
                {renderIdCardField('이메일', email, Boolean(email))}
                {renderIdCardField(
                  '주소',
                  hasAddress ? [addr1, addr2, addr3].filter(Boolean).join(' ') : '',
                  hasAddress,
                )}
              </div>

              {/* 카드 본문 - 추가 정보 */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-4">
                {renderIdCardField('직업', occupation, Boolean(occupation), unknownOccupation)}
                {renderIdCardField(
                  '사무실 전화번호',
                  officePhone,
                  Boolean(officePhone),
                  unknownOfficePhone,
                )}
                {renderIdCardField(
                  '사무실 주소',
                  hasOfficeAddress
                    ? [officeAddr1, officeAddr2, officeAddr3].filter(Boolean).join(' ')
                    : '',
                  hasOfficeAddress,
                  unknownOfficeAddress,
                )}
                {renderIdCardField(
                  '자택 전화번호',
                  homePhone,
                  Boolean(homePhone),
                  unknownHomePhone,
                )}
              </div>
            </div>
          </div>

          {/* 입력 폼 카드 */}
          <div className="w-full max-w-[520px]">
            <div className="max-h-[480px] overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
              {/* 기본 정보 서브헤더 */}
              <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-5 py-3">
                <span className="text-detail-bold text-neutral-500">기본 정보</span>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleLoadFromProfile}
                >
                  내 정보 불러오기
                </Button>
              </div>

              {/* 이름 */}
              <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
                <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">이름</span>
                <input
                  id="name"
                  type="text"
                  className={`flex-1 ${inputClass}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="홍길동"
                />
              </div>

              {/* 이메일 */}
              <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
                <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">이메일</span>
                <input
                  id="email"
                  type="email"
                  className={`flex-1 ${inputClass}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="example@email.com"
                />
              </div>

              {/* 전화번호 */}
              <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
                <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">전화번호</span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`flex-1 ${inputClass}`}
                  autoComplete="tel"
                />
              </div>

              {/* 주소 */}
              <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
                <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">주소</span>
                <div className="flex-1">
                  <DaumPostcodeButton
                    onSelect={handleAddressSelect}
                    address={hasAddress ? { city: addr1, district: addr2, town: addr3 } : undefined}
                  />
                </div>
              </div>

              {/* 추가 정보 구분선 */}
              <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-5 py-3">
                <span className="text-detail-bold text-neutral-500">추가 정보</span>
                <label className="text-detail-regular inline-flex cursor-pointer items-center gap-1.5 text-neutral-500">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 cursor-pointer"
                    checked={allExtraPrivate}
                    onChange={(e) => handleToggleAllExtra(e.target.checked)}
                  />
                  전체 비공개
                </label>
              </div>

              {/* 직업 */}
              <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
                <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">직업</span>
                <input
                  disabled={unknownOccupation}
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className={`flex-1 ${disabledInputClass}`}
                  placeholder={unknownOccupation ? '비공개' : '예: 회사원, 자영업자 등'}
                  type="text"
                />
                <label className="text-detail-regular inline-flex shrink-0 cursor-pointer items-center gap-1 text-neutral-500">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 cursor-pointer"
                    checked={unknownOccupation}
                    onChange={(e) =>
                      handleCheckboxChange(e.target.checked, setUnknownOccupation, setOccupation)
                    }
                  />
                  비공개
                </label>
              </div>

              {/* 사무실 주소 */}
              <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
                <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">사무실 주소</span>
                <div className="flex-1">
                  {unknownOfficeAddress ? (
                    <div className="rounded-200 flex h-9 w-full items-center border border-neutral-300 bg-neutral-100 px-3 text-neutral-400">
                      비공개
                    </div>
                  ) : (
                    <DaumPostcodeButton
                      onSelect={handleOfficeAddressSelect}
                      address={
                        hasOfficeAddress
                          ? { city: officeAddr1, district: officeAddr2, town: officeAddr3 }
                          : undefined
                      }
                    />
                  )}
                </div>
                <label className="text-detail-regular inline-flex shrink-0 cursor-pointer items-center gap-1 text-neutral-500">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 cursor-pointer"
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
                        setHasOfficeAddress(false);
                      }
                    }}
                  />
                  비공개
                </label>
              </div>

              {/* 사무실 전화번호 */}
              <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
                <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">사무실 번호</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder={unknownOfficePhone ? '비공개' : '02-1234-5678'}
                  value={officePhone}
                  onChange={handleOfficePhoneChange}
                  disabled={unknownOfficePhone}
                  className={`flex-1 ${disabledInputClass}`}
                  autoComplete="tel"
                />
                <label className="text-detail-regular inline-flex shrink-0 cursor-pointer items-center gap-1 text-neutral-500">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 cursor-pointer"
                    checked={unknownOfficePhone}
                    onChange={(e) => {
                      if (e.target.checked) setOfficePhone('');
                      setUnknownOfficePhone(e.target.checked);
                    }}
                  />
                  비공개
                </label>
              </div>

              {/* 자택 전화번호 */}
              <div className="flex items-center gap-4 px-5 py-3">
                <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">자택 번호</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder={unknownHomePhone ? '비공개' : '02-1234-5678'}
                  value={homePhone}
                  onChange={handleHomePhoneChange}
                  disabled={unknownHomePhone}
                  className={`flex-1 ${disabledInputClass}`}
                  autoComplete="tel"
                />
                <label className="text-detail-regular inline-flex shrink-0 cursor-pointer items-center gap-1 text-neutral-500">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 cursor-pointer"
                    checked={unknownHomePhone}
                    onChange={(e) => {
                      if (e.target.checked) setHomePhone('');
                      setUnknownHomePhone(e.target.checked);
                    }}
                  />
                  비공개
                </label>
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          <FormErrorMessage error={err} />
        </form>
      </section>
    );
  },
);

export default ComplainantInfoSection;
