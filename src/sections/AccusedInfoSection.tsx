import { registerAccused } from '@/apis/complaints';
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
    const [ok, setOk] = useState<string | null>(null);

    const formRef = useRef<HTMLFormElement>(null);

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

    // 저장 처리
    const handleSave = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setErr(null);
      setOk(null);

      if (invalidReason) {
        setErr(invalidReason);
        return;
      }

      const payload = {
        accused_name: unknownName ? '모름' : name.trim(),
        accused_address: unknownAddr ? '모름' : address,
        accused_phone: unknownPhone ? '모름' : phone,
      };

      try {
        await registerAccused(complaintId, payload);
        setOk('저장되었습니다.');
        onSaved?.();
      } catch (e: unknown) {
        const err = e as AxiosError;
        const status = err.response?.status;
        if (status === 422) setErr('입력값 형식을 확인해주세요.');
        else if (status === 401) setErr('로그인이 필요합니다.');
        else setErr('저장 중 문제가 발생했습니다.');
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

    // 모름 체크 핸들러
    const handleCheckboxChange = (
      checked: boolean,
      setFlag: React.Dispatch<React.SetStateAction<boolean>>,
      ...setters: React.Dispatch<React.SetStateAction<string>>[]
    ) => {
      setFlag(checked);
      if (checked) setters.forEach((setter) => setter(''));
    };

    return (
      <section className="mx-auto flex h-[680px] w-[720px] flex-col items-center gap-14 overflow-hidden px-[110px] py-[60px]">
        <IntroHeader
          title="고소장 작성하기"
          lines={[
            '상대방에 대한 기본 정보를 작성해주세요.',
            '알고 있는 범위 내에서만',
            '상대방 정보를 작성해도 괜찮아요.',
          ]}
          center
          showArrow
          arrowSize={24}
          arrowOpacity={0.5}
          arrowFrom="#333333"
          arrowTo="#2563EB"
        />

        <form
          ref={formRef}
          onSubmit={handleSave}
          className="mt-2 flex w-[476px] flex-col gap-6"
        >
          {/* 알림 */}
          <div
            aria-live="polite"
            className="min-h-[24px] w-full text-center"
          >
            {err && (
              <p className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden
                >
                  cancel
                </span>
                {err}
              </p>
            )}
            {!err && ok && (
              <p className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                <span
                  className="material-symbols-outlined text-[18px]"
                  aria-hidden
                >
                  check_circle
                </span>
                {ok}
              </p>
            )}
          </div>

          {/* 입력 필드 */}
          <div className="flex flex-col gap-5 px-3">
            {/* 이름 */}
            <div className="flex items-center justify-between gap-3">
              <span className="w-[50px] text-center text-sm font-medium text-gray-700">이름</span>
              <input
                disabled={unknownName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-80 rounded-lg border border-gray-300 px-3 disabled:bg-gray-100 disabled:text-gray-400"
                placeholder={unknownName ? '모름' : '이름 입력'}
                type="text"
              />
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer"
                  checked={unknownName}
                  onChange={(e) => handleCheckboxChange(e.target.checked, setUnknownName, setName)}
                />
                모름
              </label>
            </div>

            {/* 주소 */}
            <div className="flex items-center justify-between gap-3">
              <span className="w-[50px] text-center text-sm font-medium text-gray-700">주소</span>
              <div className="flex w-80 items-center justify-between gap-2">
                <input
                  disabled={unknownAddr}
                  value={addr1}
                  onChange={(e) => setAddr1(e.target.value)}
                  className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 text-center disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder={unknownAddr ? '모름' : '도/시'}
                  type="text"
                />
                <input
                  disabled={unknownAddr}
                  value={addr2}
                  onChange={(e) => setAddr2(e.target.value)}
                  className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 text-center disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder={unknownAddr ? '모름' : '시/군/구'}
                  type="text"
                />
                <input
                  disabled={unknownAddr}
                  value={addr3}
                  onChange={(e) => setAddr3(e.target.value)}
                  className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 text-center disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder={unknownAddr ? '모름' : '읍/면/동'}
                  type="text"
                />
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
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

            {/* 연락처 */}
            <div className="flex items-center justify-between gap-3">
              <span className="w-[50px] text-center text-sm font-medium text-gray-700">연락처</span>
              <div className="flex w-80 items-center justify-between gap-2">
                <input
                  disabled={unknownPhone}
                  value={p1}
                  onChange={(e) => setP1(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="h-12 min-w-0 flex-[3_3_0%] rounded-lg border border-gray-300 px-3 text-center"
                  placeholder={unknownPhone ? '모름' : '010'}
                  inputMode="numeric"
                />
                <span className="text-gray-500">-</span>
                <input
                  disabled={unknownPhone}
                  value={p2}
                  onChange={(e) => setP2(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="h-12 min-w-0 flex-[4_4_0%] rounded-lg border border-gray-300 px-3 text-center"
                  placeholder={unknownPhone ? '모름' : '1234'}
                  inputMode="numeric"
                />
                <span className="text-gray-500">-</span>
                <input
                  disabled={unknownPhone}
                  value={p3}
                  onChange={(e) => setP3(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="h-12 min-w-0 flex-[4_4_0%] rounded-lg border border-gray-300 px-3 text-center"
                  placeholder={unknownPhone ? '모름' : '5678'}
                  inputMode="numeric"
                />
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
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
        </form>
      </section>
    );
  },
);

export default AccusedInfoSection;
