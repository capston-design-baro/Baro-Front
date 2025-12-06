import FormErrorMessage from '@/components/FormErrorMessage';
import IntroHeader from '@/components/IntroHeader';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';

// 피고소인 추가 정보 타입
export type AccusedExtraInfo = {
  occupation: string;
  officeAddress: string;
  officePhone: string;
  homePhone: string;
  unknownOccupation: boolean;
  unknownOfficePhone: boolean;
  unknownOfficeAddress: boolean;
  unknownHomePhone: boolean;
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

  const [officeP1, setOfficeP1] = useState('');
  const [officeP2, setOfficeP2] = useState('');
  const [officeP3, setOfficeP3] = useState('');

  const [homeP1, setHomeP1] = useState('');
  const [homeP2, setHomeP2] = useState('');
  const [homeP3, setHomeP3] = useState('');

  // 모름 토글
  const [unknownOccupation, setUnknownOccupation] = useState(false);
  const [unknownOfficePhone, setUnknownOfficePhone] = useState(false);
  const [unknownOfficeAddress, setUnknownOfficeAddress] = useState(false);
  const [unknownHomePhone, setUnknownHomePhone] = useState(false);

  // 에러
  const [err, setErr] = useState<string | null>(null);

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

  // 사무실 주소 문자열
  const officeAddress = useMemo(() => {
    if (unknownOfficeAddress) return '';
    return [officeAddr1, officeAddr2, officeAddr3].filter(Boolean).join(' ').trim();
  }, [officeAddr1, officeAddr2, officeAddr3, unknownOfficeAddress]);

  // 사무실 번호 문자열
  const officePhone = useMemo(() => {
    if (unknownOfficePhone) return '';
    if (!officeP1 && !officeP2 && !officeP3) return '';
    return [officeP1, officeP2, officeP3].join('-').replace(/--+/g, '-');
  }, [officeP1, officeP2, officeP3, unknownOfficePhone]);

  // 집 전화번호 문자열
  const homePhone = useMemo(() => {
    if (unknownHomePhone) return '';
    if (!homeP1 && !homeP2 && !homeP3) return '';
    return [homeP1, homeP2, homeP3].join('-').replace(/--+/g, '-');
  }, [homeP1, homeP2, homeP3, unknownHomePhone]);

  // 최종 객체 만들기 (유효성 검사는 안 하고 그대로 넘김)
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
    if (!unknownOfficePhone && !officePhone) {
      const msg = '사무실 전화번호를 입력하거나 "모름"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownHomePhone && !homePhone) {
      const msg = '자택 전화번호를 입력하거나 "모름"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }

    setErr(null);

    return {
      occupation: unknownOccupation ? '' : occupation.trim(),
      officeAddress: unknownOfficeAddress ? '' : officeAddress.trim(),
      officePhone: unknownOfficePhone ? '' : officePhone,
      homePhone: unknownHomePhone ? '' : homePhone,
      unknownOccupation,
      unknownOfficeAddress,
      unknownOfficePhone,
      unknownHomePhone,
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
      buildExtraInfo();
    } catch {
      // 에러 메시지는 이미 setErr로 처리됨
    }
  };

  // 외부에서 save() 호출 가능하게
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
        'h-[680px] w-full max-w-[1000px]',
        'pb-6',
        'bg-neutral-0',
      ].join(' ')}
    >
      <IntroHeader
        title="고소장 작성하기"
        lines={[
          '피고소인의 직업이나 사무실 정보 등을 알고 있다면',
          '아래에 추가로 작성해주세요.',
          '모르시는 항목은 비워두셔도 괜찮아요.',
        ]}
        center
        showArrow
      />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-6 flex w-[420px] flex-col gap-6"
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
                placeholder={unknownOccupation ? '' : '이름 입력'}
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
                모름
              </label>
            </div>
          </div>

          {/* 사무실 주소 */}
          <div className="flex flex-col gap-2">
            {renderLabel('사무실 주소', true)}
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
                  onChange={(e) => setOfficeAddr1(e.target.value)}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownOfficeAddress ? '' : '시/도'}
                  type="text"
                />
                <input
                  disabled={unknownOfficeAddress}
                  value={officeAddr2}
                  onChange={(e) => setOfficeAddr2(e.target.value)}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownOfficeAddress ? '' : '시/군/구'}
                  type="text"
                />
                <input
                  disabled={unknownOfficeAddress}
                  value={officeAddr3}
                  onChange={(e) => setOfficeAddr3(e.target.value)}
                  className={[
                    'rounded-200 h-10 flex-1 px-3 text-center',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownOfficeAddress ? '' : '읍/면/동'}
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
                  onChange={(e) =>
                    handleCheckboxChange(
                      e.target.checked,
                      setUnknownOfficeAddress,
                      setOfficeAddr1,
                      setOfficeAddr2,
                      setOfficeAddr3,
                    )
                  }
                />
                모름
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
                  placeholder={unknownOfficePhone ? '' : '010'}
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
                  placeholder={unknownOfficePhone ? '' : '1234'}
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
                  placeholder={unknownOfficePhone ? '' : '5678'}
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
                모름
              </label>
            </div>
          </div>

          {/* 집 전화번호 */}
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
                  placeholder={unknownHomePhone ? '' : '010'}
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
                  placeholder={unknownHomePhone ? '' : '1234'}
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
                  placeholder={unknownHomePhone ? '' : '5678'}
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
                모름
              </label>
            </div>
          </div>
        </div>

        <FormErrorMessage error={err} />
      </form>
    </section>
  );
});

export default AccusedExtraInfoSection;
