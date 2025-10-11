import React, { useMemo, useState } from 'react';

import InfoBubble from '@/components/Common/InfoBubble';
import IntroHeader from '@/components/Common/IntroHeader';
import { registerAccused } from '@/apis/complaints';

type Props = {
  complaintId: number;
  onSaved?: () => void; // 저장 후 다음 단계로 이동 등
};

const AccusedInfoSection: React.FC<Props> = ({ complaintId, onSaved }) => {
  // 입력값
  const [name, setName] = useState('');
  const [addr1, setAddr1] = useState(''); // 도/시
  const [addr2, setAddr2] = useState(''); // 시/군/구
  const [addr3, setAddr3] = useState(''); // 상세
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');

  // 모름 토글
  const [unknownName, setUnknownName] = useState(false);
  const [unknownAddr, setUnknownAddr] = useState(false);
  const [unknownPhone, setUnknownPhone] = useState(false);

  // UI
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  // 주소/전화 포맷
  const address = useMemo(() => {
    if (unknownAddr) return '';
    return [addr1, addr2, addr3].filter(Boolean).join(' ').trim();
  }, [addr1, addr2, addr3, unknownAddr]);

  const phone = useMemo(() => {
    if (unknownPhone) return '';
    if (!p1 && !p2 && !p3) return '';
    return [p1, p2, p3].join('-').replace(/--+/g, '-');
  }, [p1, p2, p3, unknownPhone]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);

    // 간단 검증(모름이 아닌 경우만)
    if (!unknownName && !name.trim()) return setErr('이름을 입력하거나 "모름"을 선택해주세요.');
    if (!unknownAddr && !address) return setErr('주소를 입력하거나 "모름"을 선택해주세요.');
    if (!unknownPhone && (!p1 || !p2 || !p3))
      return setErr('연락처를 입력하거나 "모름"을 선택해주세요.');

    setLoading(true);
    try {
      await registerAccused(complaintId, {
        accused_name: unknownName ? '' : name.trim(),
        accused_address: unknownAddr ? '' : address,
        accused_phone: unknownPhone ? '' : phone,
      });
      setOk('저장되었습니다.');
      onSaved?.();
    } catch (e: any) {
      setErr(
        e?.response?.status === 422
          ? '입력값 형식을 확인해주세요.'
          : '저장 중 문제가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex h-[680px] w-[720px] flex-col items-center justify-between overflow-hidden px-[110px] py-[60px]">
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
        onSubmit={handleSave}
        className="mt-2 flex w-[420px] flex-col gap-6"
      >
        {/* 알림 영역 */}
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

        {/* 이름 */}
        <div className="flex items-center justify-between gap-3 px-3">
          <div className="flex items-center gap-1">
            <span className="w-[50px] text-center text-base font-medium text-gray-700">이름</span>
            <InfoBubble
              title="힌트"
              side="right"
            >
              상대방 이름을 정확히 모르면 비워두셔도 됩니다. 이후 수사 과정에서 보완 가능합니다.
            </InfoBubble>
          </div>

          <div className="flex items-center gap-2">
            <input
              disabled={unknownName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-80 rounded-lg border border-gray-300 px-3 disabled:bg-gray-100 disabled:text-gray-400"
              placeholder={unknownName ? '모름' : '이름 입력'}
            />
          </div>
        </div>

        {/* 주소 */}
        <div className="flex items-center justify-between gap-3 px-3">
          <div className="flex items-center gap-1">
            <span className="w-[50px] text-center text-base font-medium text-gray-700">주소</span>
            <InfoBubble
              title="주소 작성 가이드"
              side="right"
            >
              알고 있는 범위 내에서만 입력하세요. 예: “서울 강남구”처럼 대략적인 정보만 작성해도
              됩니다.
            </InfoBubble>
          </div>

          <div className="flex w-80 items-center justify-between gap-2">
            <input
              disabled={unknownAddr}
              value={addr1}
              onChange={(e) => setAddr1(e.target.value)}
              className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 disabled:bg-gray-100 disabled:text-gray-400"
              placeholder={unknownAddr ? '모름' : '도/시'}
            />
            <input
              disabled={unknownAddr}
              value={addr2}
              onChange={(e) => setAddr2(e.target.value)}
              className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 disabled:bg-gray-100 disabled:text-gray-400"
              placeholder={unknownAddr ? '모름' : '시/군/구'}
            />
            <input
              disabled={unknownAddr}
              value={addr3}
              onChange={(e) => setAddr3(e.target.value)}
              className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 disabled:bg-gray-100 disabled:text-gray-400"
              placeholder={unknownAddr ? '모름' : '상세'}
            />
          </div>
        </div>

        {/* 연락처 */}
        <div className="flex items-center justify-between gap-3 px-3">
          <div className="flex items-center gap-1">
            <span className="w-[50px] text-center text-base font-medium text-gray-700">연락처</span>
            <InfoBubble
              title="연락처"
              side="right"
            >
              번호 전체를 모르시면 비워두셔도 됩니다. 알고 있는 일부만 기입해도 괜찮아요.
            </InfoBubble>
          </div>

          <div className="flex w-80 items-center justify-between gap-2">
            <input
              disabled={unknownPhone}
              value={p1}
              onChange={(e) => setP1(e.target.value.replace(/\D/g, '').slice(0, 3))}
              className="h-12 w-[86px] rounded-lg border border-gray-300 px-3 text-center disabled:bg-gray-100 disabled:text-gray-400"
              placeholder={unknownPhone ? '모름' : '010'}
              inputMode="numeric"
            />
            <span className="text-gray-500">-</span>
            <input
              disabled={unknownPhone}
              value={p2}
              onChange={(e) => setP2(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 text-center disabled:bg-gray-100 disabled:text-gray-400"
              placeholder={unknownPhone ? '모름' : '1234'}
              inputMode="numeric"
            />
            <span className="text-gray-500">-</span>
            <input
              disabled={unknownPhone}
              value={p3}
              onChange={(e) => setP3(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 text-center disabled:bg-gray-100 disabled:text-gray-400"
              placeholder={unknownPhone ? '모름' : '5678'}
              inputMode="numeric"
            />
          </div>
        </div>

        {/* 모름 토글들 */}
        <div className="mt-1 flex flex-col gap-2 px-3">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={unknownName}
              onChange={(e) => {
                setUnknownName(e.target.checked);
                if (e.target.checked) setName('');
              }}
              className="h-4 w-4"
            />
            이름 모름
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={unknownAddr}
              onChange={(e) => {
                setUnknownAddr(e.target.checked);
                if (e.target.checked) {
                  setAddr1('');
                  setAddr2('');
                  setAddr3('');
                }
              }}
              className="h-4 w-4"
            />
            주소 모름
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={unknownPhone}
              onChange={(e) => {
                setUnknownPhone(e.target.checked);
                if (e.target.checked) {
                  setP1('');
                  setP2('');
                  setP3('');
                }
              }}
              className="h-4 w-4"
            />
            연락처 모름
          </label>
        </div>

        {/* 제출 */}
        <div className="px-3">
          <button
            type="submit"
            disabled={loading}
            className="ml-auto block h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AccusedInfoSection;
