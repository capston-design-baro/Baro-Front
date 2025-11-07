import { registerAccused } from '@/apis/complaints';
import FormErrorMessage from '@/components/FormErrorMessage';
import IntroHeader from '@/components/IntroHeader';
import type { AxiosError } from 'axios';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';

// 외부에서 save()를 호출할 수 있도록 노출
export type AccusedInfoSectionHandle = {
  save: () => Promise<void>;
};

type Props = {
  complaintId: number;
  onSaved?: () => void; // 저장 후 다음 단계로 이동 등
};

const AccusedInfoSection = forwardRef<AccusedInfoSectionHandle, Props>(
  ({ complaintId, onSaved }, ref) => {
    // 입력값
    const [name, setName] = useState('');
    const [addr1, setAddr1] = useState('');
    const [addr2, setAddr2] = useState('');
    const [addr3, setAddr3] = useState('');
    const [p1, setP1] = useState('');
    const [p2, setP2] = useState('');
    const [p3, setP3] = useState('');

    // 모름 토글
    const [unknownName, setUnknownName] = useState(false);
    const [unknownAddr, setUnknownAddr] = useState(false);
    const [unknownPhone, setUnknownPhone] = useState(false);

    // UI
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);

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
    const phone = useMemo(() => {
      if (unknownPhone) return '';
      if (!p1 && !p2 && !p3) return '';
      return [p1, p2, p3].join('-').replace(/--+/g, '-');
    }, [p1, p2, p3, unknownPhone]);

    // 입력 검증
    const invalidReason = useMemo(() => {
      if (!Number.isFinite(complaintId) || complaintId <= 0) return '잘못된 고소장 ID입니다.';
      if (!unknownName && !name.trim()) return '이름을 입력하거나 "모름"을 선택해주세요.';
      if (!unknownAddr && !address) return '주소를 입력하거나 "모름"을 선택해주세요.';
      if (!unknownPhone && (!p1 || !p2 || !p3)) return '연락처를 입력하거나 "모름"을 선택해주세요.';
      return null;
    }, [complaintId, unknownName, unknownAddr, unknownPhone, name, address, p1, p2, p3]);

    // 모름 체크 핸들러
    const handleCheckboxChange = (
      checked: boolean,
      setFlag: React.Dispatch<React.SetStateAction<boolean>>,
      ...setters: React.Dispatch<React.SetStateAction<string>>[]
    ) => {
      setFlag(checked);
      if (checked) setters.forEach((setter) => setter(''));
    };

    // 저장 처리
    const handleSave = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setErr(null);

      if (invalidReason) {
        setErr(invalidReason);
        return;
      }

      const payload = {
        accused_name: unknownName ? '모름' : name.trim(),
        accused_address: unknownAddr ? '모름' : address,
        accused_phone: unknownPhone ? '모름' : phone,
      };

      setLoading(true);
      try {
        await registerAccused(complaintId, payload);
        onSaved?.();
      } catch (e: unknown) {
        const ax = e as AxiosError | undefined;
        const status = ax?.response?.status;
        if (status === 422) setErr('입력값 형식을 확인해주세요.');
        else if (status === 401) setErr('로그인이 필요합니다.');
        else setErr('저장 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // 외부에서 save() 호출 가능하게
    useImperativeHandle(ref, () => ({
      save: async () => {
        if (formRef.current) {
          formRef.current.requestSubmit();
        } else {
          await handleSave();
        }
      },
    }));

    return (
      <section
        aria-busy={loading}
        className={[
          'flex flex-col items-center justify-between',
          'h-[620px] w-full max-w-[1000px]',
          'pb-6',
          'bg-neutral-0',
        ].join(' ')}
      >
        <IntroHeader
          title="고소장 작성하기"
          lines={[
            '상대방에 대한 기본 정보를 작성해주세요.',
            '알고 있는 범위 내에서만',
            '상대방 정보를 작성해도 괜찮아요.',
          ]}
          center
          showArrow
        />

        <form
          ref={formRef}
          onSubmit={handleSave}
          className="mt-6 flex w-[420px] flex-col gap-6"
        >
          {/* 입력 필드들 */}
          <div className="flex flex-1 flex-col justify-center gap-6 px-5">
            {/* 이름 */}
            <div className="flex flex-col gap-2">
              {renderLabel('이름', true)}
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-primary-600/50"
                  style={{ fontSize: '24px' }}
                >
                  person
                </span>

                <input
                  disabled={unknownName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={[
                    'rounded-200 h-10 flex-1 px-3',
                    'border border-neutral-300',
                    'disabled:bg-neutral-100 disabled:text-neutral-400',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  placeholder={unknownName ? '모름' : '이름 입력'}
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
                    checked={unknownName}
                    onChange={(e) =>
                      handleCheckboxChange(e.target.checked, setUnknownName, setName)
                    }
                  />
                  모름
                </label>
              </div>
            </div>

            {/* 주소 */}
            <div className="flex flex-col gap-2">
              {renderLabel('주소', true)}
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-primary-600/50"
                  style={{ fontSize: '24px' }}
                >
                  location_on
                </span>

                <div className="grid w-full grid-cols-3 gap-2">
                  <input
                    disabled={unknownAddr}
                    value={addr1}
                    onChange={(e) => setAddr1(e.target.value)}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'disabled:bg-neutral-100 disabled:text-neutral-400',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder={unknownAddr ? '모름' : '시/도'}
                    type="text"
                  />
                  <input
                    disabled={unknownAddr}
                    value={addr2}
                    onChange={(e) => setAddr2(e.target.value)}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'disabled:bg-neutral-100 disabled:text-neutral-400',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder={unknownAddr ? '모름' : '시/군/구'}
                    type="text"
                  />
                  <input
                    disabled={unknownAddr}
                    value={addr3}
                    onChange={(e) => setAddr3(e.target.value)}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'disabled:bg-neutral-100 disabled:text-neutral-400',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder={unknownAddr ? '모름' : '읍/면/동'}
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
                    checked={unknownAddr}
                    onChange={(e) =>
                      handleCheckboxChange(
                        e.target.checked,
                        setUnknownAddr,
                        setAddr1,
                        setAddr2,
                        setAddr3,
                      )
                    }
                  />
                  모름
                </label>
              </div>
            </div>

            {/* 연락처 */}
            <div className="flex flex-col gap-2">
              {renderLabel('전화번호', true)}
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-primary-600/50"
                  style={{ fontSize: '24px' }}
                >
                  phone_in_talk
                </span>

                <div className="grid w-full grid-cols-3 gap-2">
                  <input
                    disabled={unknownPhone}
                    value={p1}
                    onChange={(e) => setP1(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'disabled:bg-neutral-100 disabled:text-neutral-400',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder={unknownPhone ? '모름' : '010'}
                    inputMode="numeric"
                  />
                  <input
                    disabled={unknownPhone}
                    value={p2}
                    onChange={(e) => setP2(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'disabled:bg-neutral-100 disabled:text-neutral-400',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder={unknownPhone ? '모름' : '1234'}
                    inputMode="numeric"
                  />
                  <input
                    disabled={unknownPhone}
                    value={p3}
                    onChange={(e) => setP3(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'disabled:bg-neutral-100 disabled:text-neutral-400',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder={unknownPhone ? '모름' : '5678'}
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
                    checked={unknownPhone}
                    onChange={(e) =>
                      handleCheckboxChange(e.target.checked, setUnknownPhone, setP1, setP2, setP3)
                    }
                  />
                  모름
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

export default AccusedInfoSection;
