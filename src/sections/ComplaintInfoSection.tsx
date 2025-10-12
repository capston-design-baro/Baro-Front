import { getMe } from '@/apis/auth';
import { createComplaint } from '@/apis/complaints';
import IntroHeader from '@/components/Common/IntroHeader';
import type { AxiosError } from 'axios';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

// 부모 컴포넌트에서 save()를 직접 호출할 수 있도록 인터페이스 정의
type Props = { onLoaded?: () => void };

export type ComplainantInfoSectionHandle = {
  save: () => Promise<number>;
};

// 한국 주소를 3등분: 시/도, 시/군/구, 읍/면/동
function splitAddressTo3FromString(addr: string | null | undefined) {
  const raw = (addr ?? '').trim();
  if (!raw) return { a1: '', a2: '', a3: '' };

  // 다양한 구분자를 공백으로 정규화
  const normalized = raw.replace(/[,\s/|\\-]+/g, ' ').trim();
  if (!normalized) return { a1: '', a2: '', a3: '' };

  // 도/시 정규식: 특별시, 광역시, 자치시, 도
  // 시는 서울시 때문에 임시로 넣어뒀는데, 나중에 백엔드에서 city, district, town api 만들어주면 변경할 예정 (무조건 서울특별시로 되게)
  // 예: 서울시, 경기도, 부산광역시, 강원자치도 등
  const sidoPattern = '(?:특별시|광역시|자치시|도|시)';

  // 시/군/구 정규식
  const sigunguPattern = '(?:시|군|구)';

  // 읍/면/동 정규식
  const eupMyeonDongPattern = '(?:읍|면|동)';

  // [도/시] [시/군/구] [읍/면/동]
  const pattern = new RegExp(
    `^([\\w가-힣]+${sidoPattern})\\s+([\\w가-힣]+${sigunguPattern})\\s+([\\w가-힣]+${eupMyeonDongPattern})$`,
  );

  // 정규식 매칭 시도
  const m = normalized.match(pattern);

  if (m) {
    // 매칭된 경우: 그룹별로 분리
    return {
      a1: m[1]?.trim() ?? '', // 시/도
      a2: m[2]?.trim() ?? '', // 시/군/구
      a3: m[3]?.trim() ?? '', // 읍/면/동
    };
  }

  // 매칭 안 되면 빈 값 리턴
  return { a1: '', a2: '', a3: '' };
}

// 전화번호 분할 -> 숫자 이외 제거 + 길이/지역번호(02) 케이스 처리
function splitPhoneKR(phoneRaw: unknown) {
  // 숫자만 남기고 나머지 문자 제거
  const d = String(phoneRaw ?? '').replace(/\D/g, '');
  if (!d) return { p1: '', p2: '', p3: '' };

  // 서울 국번(02)인 경우: 9자리 또는 10자리
  if (d.startsWith('02')) {
    if (d.length === 9) return { p1: d.slice(0, 2), p2: d.slice(2, 5), p3: d.slice(5, 9) };
    if (d.length === 10) return { p1: d.slice(0, 2), p2: d.slice(2, 6), p3: d.slice(6, 10) };
  }

  // 일반 휴대폰: 11자리 (010-XXXX-XXXX)
  if (d.length === 11) return { p1: d.slice(0, 3), p2: d.slice(3, 7), p3: d.slice(7, 11) };

  // 일반 전화: 10자리 (031-XXX-XXXX)
  if (d.length === 10) return { p1: d.slice(0, 3), p2: d.slice(3, 6), p3: d.slice(6, 10) };

  // 그 외: 앞에서부터 3-4-4로 잘라서 반환
  return { p1: d.slice(0, 3), p2: d.slice(3, 7), p3: d.slice(7, 11) };
}

// forwardRef 사용 -> 부모 컴포넌트에서 save()를 호출할 수 있게 함
const ComplainantInfoSection = forwardRef<ComplainantInfoSectionHandle, Props>(
  ({ onLoaded }, ref) => {
    const formRef = useRef<HTMLFormElement>(null); // 폼 참조

    // 입력값 상태 관리
    const [name, setName] = useState(''); // 이름
    const [addr1, setAddr1] = useState(''); // 시/도
    const [addr2, setAddr2] = useState(''); // 시/군/구
    const [addr3, setAddr3] = useState(''); // 읍/면/동
    const [p1, setP1] = useState(''); // 연락처 앞자리
    const [p2, setP2] = useState(''); // 연락처 중간자리
    const [p3, setP3] = useState(''); // 연락처 뒷자리

    // UI 상태 관리
    const [loading, setLoading] = useState(false); // 로딩 여부
    const [err, setErr] = useState<string | null>(null); // 에러 메시지
    const [ok, setOk] = useState<string | null>(null); // 성공 메시지

    // 내 정보 불러오기
    const handleLoadFromProfile = async () => {
      setErr(null);
      setOk(null);
      setLoading(true);
      try {
        const me = await getMe();

        setName(me.name ?? ''); // 이름 입력칸 채우기
        // 주소 3분할
        const { a1, a2, a3 } = splitAddressTo3FromString(me.address);
        setAddr1(a1);
        setAddr2(a2);
        setAddr3(a3);

        // 전화번호 분할
        const { p1: _1, p2: _2, p3: _3 } = splitPhoneKR(me.phone_number);
        setP1(_1);
        setP2(_2);
        setP3(_3);

        // 성공 메시지 표시
        setOk('내 정보를 불러왔어요.');
      } catch (e: unknown) {
        const ax = e as AxiosError | undefined;
        const status = ax?.response?.status;
        if (status === 401) setErr('로그인이 필요합니다. 다시 로그인해주세요.');
        else if (status === 403) setErr('접근 권한이 없습니다.');
        else setErr('내 정보를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    };

    // 저장 로직 (AxiosError 사용)
    const doSave = async (): Promise<number> => {
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
        const id = Number(res?.id); // ✅ 숫자로 보강
        if (!Number.isFinite(id) || id <= 0) {
          throw new Error('유효하지 않은 complaint id');
        }
        return id;
      } catch (e: unknown) {
        const ax = e as AxiosError | undefined;
        const status = ax?.response?.status;

        if (status === 422) throw new Error('입력값 형식을 확인해주세요.');
        if (status === 401) throw new Error('로그인이 필요해요. 다시 로그인 후 시도해주세요.');
        if (status === 403) throw new Error('접근 권한이 없어요.');
        if (status === 404) throw new Error('API 경로가 없어요.');
        throw new Error('저장 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    // 부모 컴포넌트에서 ref.save() 호출 가능하게 노출
    useImperativeHandle(ref, () => ({
      save: async () => {
        try {
          const id = await doSave();
          return id; // ⬅️ complaint.id 반환
        } catch (e: unknown) {
          const msg = (e as { message?: string })?.message ?? '에러가 발생했습니다.';
          setErr(msg);
          throw e;
        }
      },
    }));

    // 엔터 제출도 save()와 동일 동작
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      void doSave().catch(() => {
        // 에러 메시지는 위에서 setErr로 처리됨
      });
    };

    return (
      // 메인 섹션 컨테이너
      <section
        className="mx-auto flex h-[680px] w-[720px] flex-col items-center overflow-hidden px-[110px] py-[40px]"
        aria-busy={loading}
      >
        {/* 상단 안내 헤더 */}
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

        {/* 입력 폼 */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-6 flex w-[420px] flex-col items-end gap-6"
        >
          {/* 내 정보 불러오기 버튼 */}
          <div className="flex w-[420px] justify-end">
            <button
              type="button"
              onClick={handleLoadFromProfile}
              disabled={loading}
              className="inline-flex items-center rounded-lg border border-blue-600 bg-blue-50/70 px-7 py-[9px] text-sm font-medium text-[#333] hover:bg-blue-100 disabled:opacity-60"
            >
              {loading ? '불러오는 중…' : '내 정보 불러오기'}
            </button>
          </div>

          {/* 상태 메시지 (에러/성공) */}
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
            {/* 이름 입력 */}
            <label className="flex items-center justify-between gap-3">
              <span className="w-[50px] text-center text-sm font-medium text-gray-700">이름</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-80 rounded-lg border border-gray-300 px-3"
                placeholder="홍길동"
              />
            </label>

            {/* 주소 입력 */}
            <div className="flex items-center justify-between gap-3">
              <span className="w-[50px] text-center text-sm font-medium text-gray-700">주소</span>
              <div className="flex w-80 items-center justify-between gap-2">
                {/* 시/도 */}
                <input
                  value={addr1}
                  onChange={(e) => setAddr1(e.target.value)}
                  className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 text-center"
                  placeholder="시/도"
                />
                {/* 시/군/구 */}
                <input
                  value={addr2}
                  onChange={(e) => setAddr2(e.target.value)}
                  className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 text-center"
                  placeholder="시/군/구"
                />
                {/* 읍/면/동 */}
                <input
                  value={addr3}
                  onChange={(e) => setAddr3(e.target.value)}
                  className="h-12 w-[100px] rounded-lg border border-gray-300 px-3 text-center"
                  placeholder="읍/면/동"
                />
              </div>
            </div>

            {/* 연락처 입력 */}
            <div className="flex items-center justify-between gap-3">
              <span className="w-[50px] text-center text-sm font-medium text-gray-700">연락처</span>
              <div className="flex w-80 items-center justify-between gap-2">
                {/* 앞자리 */}
                <input
                  value={p1}
                  onChange={(e) => setP1(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="h-12 min-w-0 flex-[3_3_0%] rounded-lg border border-gray-300 px-3 text-center"
                  placeholder="010"
                  inputMode="numeric"
                />
                <span className="text-gray-500">-</span>
                {/* 중간자리 */}
                <input
                  value={p2}
                  onChange={(e) => setP2(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="h-12 min-w-0 flex-[4_4_0%] rounded-lg border border-gray-300 px-3 text-center"
                  placeholder="1234"
                  inputMode="numeric"
                />
                <span className="text-gray-500">-</span>
                {/* 뒷자리 */}
                <input
                  value={p3}
                  onChange={(e) => setP3(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="h-12 min-w-0 flex-[4_4_0%] rounded-lg border border-gray-300 px-3 text-center"
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
