// ComplaintInfoSection.tsx

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import IntroHeader from '@/components/Common/IntroHeader';
import { createComplaint } from '@/apis/complaints';
import { getMe } from '@/apis/auth';
import { useNavigate } from 'react-router-dom';

type Props = { onLoaded?: () => void };

// ⬇️ submit → save 로 변경 (Promise<void>를 리턴)
export type ComplainantInfoSectionHandle = { save: () => Promise<void> };

function splitAddressTo3(address: string) {
  const parts = address.trim().split(/\s+/);
  const a1 = parts[0] ?? '';
  const a2 = parts[1] ?? '';
  const a3 = parts.length > 2 ? parts.slice(2).join(' ') : '';
  return { a1, a2, a3 };
}
function splitPhoneKR(phoneRaw: string) {
  const d = phoneRaw.replace(/\D/g, '');
  if (d.startsWith('02')) {
    if (d.length === 9) return { p1: d.slice(0, 2), p2: d.slice(2, 5), p3: d.slice(5, 9) };
    if (d.length === 10) return { p1: d.slice(0, 2), p2: d.slice(2, 6), p3: d.slice(6, 10) };
  }
  if (d.length === 11) return { p1: d.slice(0, 3), p2: d.slice(3, 7), p3: d.slice(7, 11) };
  if (d.length === 10) return { p1: d.slice(0, 3), p2: d.slice(3, 6), p3: d.slice(6, 10) };
  return { p1: d.slice(0, 3), p2: d.slice(3, 7), p3: d.slice(7, 11) };
}

const ComplainantInfoSection = forwardRef<ComplainantInfoSectionHandle, Props>(
  ({ onLoaded }, ref) => {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);

    const [name, setName] = useState('');
    const [addr1, setAddr1] = useState('');
    const [addr2, setAddr2] = useState('');
    const [addr3, setAddr3] = useState('');
    const [p1, setP1] = useState('');
    const [p2, setP2] = useState('');
    const [p3, setP3] = useState('');

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [ok, setOk] = useState<string | null>(null);

    // 내 정보 불러오기
    const handleLoadFromProfile = async () => {
      setErr(null);
      setOk(null);
      try {
        const me = await getMe();
        setName(me.name ?? '');
        const { a1, a2, a3 } = splitAddressTo3(me.address ?? '');
        setAddr1(a1);
        setAddr2(a2);
        setAddr3(a3);
        const { p1: _1, p2: _2, p3: _3 } = splitPhoneKR(me.phone_number ?? '');
        setP1(_1);
        setP2(_2);
        setP3(_3);
        setOk('내 정보를 불러왔어요.');
      } catch {
        setErr('내 정보를 불러오지 못했어요. 로그인 상태/권한을 확인해주세요.');
      }
    };

    // ⬇️ 제출 로직을 함수로 분리하고, ref로 노출
    const doSave = async () => {
      setErr(null);
      setOk(null);

      if (!name.trim()) throw new Error('이름을 입력해주세요.');
      const address = [addr1, addr2, addr3].filter(Boolean).join(' ').trim();
      if (!address) throw new Error('주소를 입력해주세요.');
      if (!p1 || !p2 || !p3) throw new Error('연락처를 모두 입력해주세요.');
      const phone = [p1, p2, p3].join('-').replace(/--+/g, '-').trim();

      setLoading(true);
      try {
        const res = await createComplaint({
          complainant_name: name.trim(),
          complainant_address: address,
          complainant_phone: phone,
        });
        onLoaded?.();
        navigate(`/complaints/${res.id}/accused`);
      } catch (e: any) {
        console.error(
          '[createComplaint error]',
          e?.response?.status,
          e?.response?.data,
          e?.message,
        );

        if (e?.response?.status === 422) throw new Error('입력값 형식을 확인해주세요.');
        // 상태코드별로 좀 더 친절히
        if (e?.response?.status === 401)
          throw new Error('로그인이 필요해요. 다시 로그인 후 시도해주세요.');
        if (e?.response?.status === 403) throw new Error('접근 권한이 없어요.');
        if (e?.response?.status === 404)
          throw new Error('API 경로가 없어요. 프록시/경로 설정을 확인해주세요.');
        throw new Error('저장 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      save: async () => {
        try {
          await doSave();
        } catch (e: any) {
          setErr(e?.message ?? '에러가 발생했습니다.');
          throw e; // 부모도 실패를 인지할 수 있게
        }
      },
    }));

    // 폼의 onSubmit은 개발자 실수로 엔터 눌러도 동일 동작하도록 연결(선택)
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      doSave().catch(() => {}); // 에러는 위에서 setErr로 표시됨
    };

    return (
      <section className="mx-auto flex h-[680px] w-[720px] flex-col items-center overflow-hidden px-[110px] py-[40px]">
        <IntroHeader
          title="고소장 작성하기"
          lines={[
            '고소장을 작성하려면 내 정보를 적어야 해요.',
            '로그인 시 입력한 정보를 불러올 수도 있고,',
            '직접 입력할 수도 있어요.',
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
          onSubmit={handleSubmit}
          className="mt-6 flex w-[420px] flex-col items-end gap-6"
        >
          <div className="flex w-[420px] justify-end">
            <button
              type="button"
              onClick={handleLoadFromProfile}
              className="inline-flex items-center rounded-lg border border-blue-600 bg-blue-50/70 px-7 py-[9px] text-sm font-medium text-[#333] hover:bg-blue-100"
            >
              내 정보 불러오기
            </button>
          </div>

          <div
            aria-live="polite"
            className="min-h-[24px] w-full text-center"
          >
            {err && (
              <p className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                {err}
              </p>
            )}
            {!err && ok && (
              <p className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                {ok}
              </p>
            )}
          </div>

          {/* 입력 필드들 */}
          <div className="flex w-[420px] flex-col gap-5 px-3">
            <label className="flex items-center justify-between gap-3">
              <span className="w-[50px] text-center text-sm font-medium text-gray-700">이름</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-80 rounded-lg border border-gray-300 px-3"
                placeholder="홍길동"
              />
            </label>

            <div className="flex items-center justify-between gap-3">
              <span className="w-[50px] text-center text-sm font-medium text-gray-700">주소</span>
              <div className="flex w-80 items-center justify-between gap-2">
                <input
                  value={addr1}
                  onChange={(e) => setAddr1(e.target.value)}
                  className="h-12 w-[100px] rounded-lg border border-gray-300 px-3"
                  placeholder="도/시"
                />
                <input
                  value={addr2}
                  onChange={(e) => setAddr2(e.target.value)}
                  className="h-12 w-[100px] rounded-lg border border-gray-300 px-3"
                  placeholder="시/군/구"
                />
                <input
                  value={addr3}
                  onChange={(e) => setAddr3(e.target.value)}
                  className="h-12 w-[100px] rounded-lg border border-gray-300 px-3"
                  placeholder="상세"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="w-[50px] text-center text-sm font-medium text-gray-700">연락처</span>
              <div className="flex w-80 items-center justify-between gap-2">
                <input
                  value={p1}
                  onChange={(e) => setP1(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="h-12 w-[86px] rounded-lg border px-3 text-center"
                  placeholder="010"
                  inputMode="numeric"
                />
                <span className="text-gray-500">-</span>
                <input
                  value={p2}
                  onChange={(e) => setP2(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="h-12 w-[100px] rounded-lg border px-3 text-center"
                  placeholder="1234"
                  inputMode="numeric"
                />
                <span className="text-gray-500">-</span>
                <input
                  value={p3}
                  onChange={(e) => setP3(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="h-12 w-[100px] rounded-lg border px-3 text-center"
                  placeholder="5678"
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>
        </form>
      </section>
    );
  },
);

export default ComplainantInfoSection;
