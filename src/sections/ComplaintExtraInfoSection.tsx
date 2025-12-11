import DaumPostcodeButton from '@/components/DaumPostcodeButton';
import type { DaumPostcodeResult } from '@/components/DaumPostcodeButton';
import FormErrorMessage from '@/components/FormErrorMessage';
import IntroHeader from '@/components/IntroHeader';
import { splitAddressTo3FromString } from '@/utils/krContact';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';

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

  const [officeP1, setOfficeP1] = useState('');
  const [officeP2, setOfficeP2] = useState('');
  const [officeP3, setOfficeP3] = useState('');

  const [homeP1, setHomeP1] = useState('');
  const [homeP2, setHomeP2] = useState('');
  const [homeP3, setHomeP3] = useState('');

  // 비공개 토글
  const [unknownOccupation, setUnknownOccupation] = useState(false);
  const [unknownOfficeAddress, setUnknownOfficeAddress] = useState(false);
  const [unknownOfficePhone, setUnknownOfficePhone] = useState(false);
  const [unknownHomePhone, setUnknownHomePhone] = useState(false);

  const [err, setErr] = useState<string | null>(null);

  // 주소가 주소 찾기로 한 번이라도 세팅된 적 있는지
  const [hasAddress, setHasAddress] = useState(false);

  // 주소 필드 클릭 시: 아직 검색 안했으면 에러만 보여주기
  const handleAddressFieldClick = () => {
    // "모름"이면 그냥 아무것도 하지 않음
    if (unknownOfficeAddress) return;

    // 주소가 비어 있고, 주소 찾기도 안 한 상태면 에러
    if (!hasAddress && !officeAddr1 && !officeAddr2 && !officeAddr3) {
      setErr('주소 찾기 버튼을 눌러 주소를 검색해주세요.');
    }
  };

  // 주소 선택 콜백 (다음 API에서 선택되면 호출)
  const handleAddressSelect = (data: DaumPostcodeResult) => {
    const { a1, a2, a3 } = splitAddressTo3FromString(data.roadAddress);
    setOfficeAddr1(a1);
    setOfficeAddr2(a2);
    setOfficeAddr3(a3);
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

  const officePhone = useMemo(() => {
    if (unknownOfficePhone) return '';
    if (!officeP1 && !officeP2 && !officeP3) return '';
    return [officeP1, officeP2, officeP3].join('-').replace(/--+/g, '-');
  }, [officeP1, officeP2, officeP3, unknownOfficePhone]);

  const homePhone = useMemo(() => {
    if (unknownHomePhone) return '';
    if (!homeP1 && !homeP2 && !homeP3) return '';
    return [homeP1, homeP2, homeP3].join('-').replace(/--+/g, '-');
  }, [homeP1, homeP2, homeP3, unknownHomePhone]);

  const handleCheckboxChange = (
    checked: boolean,
    setFlag: React.Dispatch<React.SetStateAction<boolean>>,
    ...setters: React.Dispatch<React.SetStateAction<string>>[]
  ) => {
    setFlag(checked);
    if (checked) setters.forEach((setter) => setter(''));
  };

  // 최종 객체 만들기 (유효성 검사는 안 하고 그대로 넘김)
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
    if (!unknownOfficePhone && !officePhone) {
      const msg = '사무실 전화번호를 입력하거나 "비공개"를 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownHomePhone && !homePhone) {
      const msg = '자택 전화번호를 입력하거나 "비공개"를 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }

    setErr(null);

    return {
      occupation: unknownOccupation ? '비공개' : occupation.trim(),
      officeAddress: unknownOfficeAddress ? '비공개' : officeAddress.trim(),
      officePhone: unknownOfficePhone ? '비공개' : officePhone,
      homePhone: unknownHomePhone ? '비공개' : homePhone,
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
      className={[
        'flex flex-col items-center justify-between',
        'h-[600px] w-full max-w-[1000px]',
        'pb-6',
        'bg-neutral-0',
      ].join(' ')}
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
        className="mt-6 flex w-[420px] flex-col gap-5"
      >
        <div className="flex flex-1 flex-col justify-center gap-6 px-5">
          {/* 직업 */}
          <div className="flex flex-col gap-2">
            {renderLabel('직업', true)}
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-primary-600/50"
                style={{ fontSize: '24px' }}
              >
                work
              </span>
              <input
                disabled={unknownOccupation}
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className={[
                  'rounded-200 h-10 flex-1 px-3',
                  'border border-neutral-300',
                  'disabled:bg-neutral-100 disabled:text-neutral-400',
                  'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                ].join(' ')}
                placeholder={unknownOccupation ? '비공개' : '예: 회사원, 자영업자 등'}
                type="text"
              />
              <label
                className={[
                  'text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700',
                  'shrink-0 whitespace-nowrap',
                ].join(' ')}
              >
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
          </div>

          {/* 사무실 주소 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              {/* 주소 라벨 */}
              {renderLabel('사무실 주소', true)}

              {/* 주소 검색 버튼 */}
              <DaumPostcodeButton onSelect={handleAddressSelect} />
            </div>
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-primary-600/50"
                style={{ fontSize: '24px' }}
              >
                location_city
              </span>
              <div className="grid w-full grid-cols-3 gap-2">
                <input
                  disabled={unknownOfficeAddress}
                  value={officeAddr1}
                  readOnly
                  onClick={handleAddressFieldClick}
                  onFocus={handleAddressFieldClick}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownOfficeAddress ? '비공개' : '시/도'}
                  type="text"
                />
                <input
                  disabled={unknownOfficeAddress}
                  value={officeAddr2}
                  readOnly
                  onClick={handleAddressFieldClick}
                  onFocus={handleAddressFieldClick}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownOfficeAddress ? '비공개' : '시/군/구'}
                  type="text"
                />
                <input
                  disabled={unknownOfficeAddress}
                  value={officeAddr3}
                  readOnly
                  onClick={handleAddressFieldClick}
                  onFocus={handleAddressFieldClick}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownOfficeAddress ? '비공개' : '읍/면/동'}
                  type="text"
                />
              </div>
              <label
                className={[
                  'text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700',
                  'shrink-0 whitespace-nowrap',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer"
                  checked={unknownOfficeAddress}
                  onChange={(e) => {
                    const checked = e.target.checked;

                    handleCheckboxChange(
                      checked,
                      setUnknownOfficeAddress,
                      setOfficeAddr1,
                      setOfficeAddr2,
                      setOfficeAddr3,
                    );

                    if (checked) {
                      // "주소 모름"으로 바꾸면 주소 관련 에러는 지워준다
                      setErr(null);
                      setHasAddress(false); // 선택사항: 모름이면 hasAddress도 false로
                    }
                  }}
                />
                비공개
              </label>
            </div>
          </div>

          {/* 사무실 전화번호 */}
          <div className="flex flex-col gap-2">
            {renderLabel('사무실 전화번호', true)}
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-primary-600/50"
                style={{ fontSize: '24px' }}
              >
                call
              </span>
              <div className="grid w-full grid-cols-3 gap-2">
                <input
                  disabled={unknownOfficePhone}
                  value={officeP1}
                  onChange={(e) => setOfficeP1(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownOfficePhone ? '비공개' : '02'}
                  inputMode="numeric"
                />
                <input
                  disabled={unknownOfficePhone}
                  value={officeP2}
                  onChange={(e) => setOfficeP2(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownOfficePhone ? '비공개' : '1234'}
                  inputMode="numeric"
                />
                <input
                  disabled={unknownOfficePhone}
                  value={officeP3}
                  onChange={(e) => setOfficeP3(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownOfficePhone ? '비공개' : '5678'}
                  inputMode="numeric"
                />
              </div>
              <label
                className={[
                  'text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700',
                  'shrink-0 whitespace-nowrap',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer"
                  checked={unknownOfficePhone}
                  onChange={(e) =>
                    handleCheckboxChange(
                      e.target.checked,
                      setUnknownOfficePhone,
                      setOfficeP1,
                      setOfficeP2,
                      setOfficeP3,
                    )
                  }
                />
                비공개
              </label>
            </div>
          </div>

          {/* 자택 전화번호 */}
          <div className="flex flex-col gap-2">
            {renderLabel('자택 전화번호', true)}
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-primary-600/50"
                style={{ fontSize: '24px' }}
              >
                home
              </span>
              <div className="grid w-full grid-cols-3 gap-2">
                <input
                  disabled={unknownHomePhone}
                  value={homeP1}
                  onChange={(e) => setHomeP1(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownHomePhone ? '비공개' : '02'}
                  inputMode="numeric"
                />
                <input
                  disabled={unknownHomePhone}
                  value={homeP2}
                  onChange={(e) => setHomeP2(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownHomePhone ? '비공개' : '1234'}
                  inputMode="numeric"
                />
                <input
                  disabled={unknownHomePhone}
                  value={homeP3}
                  onChange={(e) => setHomeP3(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownHomePhone ? '비공개' : '5678'}
                  inputMode="numeric"
                />
              </div>
              <label
                className={[
                  'text-detail-regular inline-flex cursor-pointer items-center gap-2 text-neutral-700',
                  'shrink-0 whitespace-nowrap',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer"
                  checked={unknownHomePhone}
                  onChange={(e) =>
                    handleCheckboxChange(
                      e.target.checked,
                      setUnknownHomePhone,
                      setHomeP1,
                      setHomeP2,
                      setHomeP3,
                    )
                  }
                />
                비공개
              </label>
            </div>
          </div>
        </div>

        <FormErrorMessage error={err} />
      </form>
    </section>
  );
});

export default ComplainantExtraInfoSection;
