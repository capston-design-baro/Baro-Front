import { getMe } from '@/apis/auth';
import { createComplaint } from '@/apis/complaints';
import FormErrorMessage from '@/components/FormErrorMessage';
import IntroHeader from '@/components/IntroHeader';
import { splitAddressTo3FromString, splitPhoneKR } from '@/utils/krContact';
import type { AxiosError } from 'axios';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

// 부모 컴포넌트에서 save()를 직접 호출할 수 있도록 인터페이스 정의
type Props = { onLoaded?: () => void };

export type ComplainantInfoSectionHandle = {
  save: () => Promise<number>;
};

const ComplainantInfoSection = forwardRef<ComplainantInfoSectionHandle, Props>(
  ({ onLoaded }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    // 입력값 상태 관리
    const [name, setName] = useState('');
    const [addr1, setAddr1] = useState('');
    const [addr2, setAddr2] = useState('');
    const [addr3, setAddr3] = useState('');
    const [p1, setP1] = useState('');
    const [p2, setP2] = useState('');
    const [p3, setP3] = useState('');

    // UI 상태 관리
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null); // 에러 메시지만 유지

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

    // 내 정보 불러오기
    const handleLoadFromProfile = async () => {
      setErr(null);

      try {
        const me = await getMe();

        setName(me.name ?? '');
        const { a1, a2, a3 } = splitAddressTo3FromString(me.address);
        setAddr1(a1);
        setAddr2(a2);
        setAddr3(a3);

        const { p1: _1, p2: _2, p3: _3 } = splitPhoneKR(me.phone_number);
        setP1(_1);
        setP2(_2);
        setP3(_3);
      } catch (e: unknown) {
        const ax = e as AxiosError | undefined;
        const status = ax?.response?.status;
        if (status === 401) setErr('로그인이 필요합니다. 다시 로그인해주세요.');
        else if (status === 403) setErr('접근 권한이 없습니다.');
        else setErr('내 정보를 불러오지 못했어요.');
      }
    };

    // 저장 로직
    const doSave = async (): Promise<number> => {
      setErr(null);

      if (!name.trim()) throw new Error('이름을 입력해주세요.');
      const address = [addr1, addr2, addr3].filter(Boolean).join(' ').trim();
      const phone = [p1, p2, p3].join('-').replace(/--+/g, '-').trim();

      try {
        const res = await createComplaint({
          complainant_name: name.trim(),
          complainant_address: address,
          complainant_phone: phone,
        });

        onLoaded?.();
        const id = Number(res?.id);
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

    useImperativeHandle(ref, () => ({
      save: async () => {
        try {
          const id = await doSave();
          return id;
        } catch (e: unknown) {
          const msg = (e as { message?: string })?.message ?? '에러가 발생했습니다.';
          setErr(msg);
          throw e;
        }
      },
    }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      void doSave().catch((e) => {
        const msg = (e as { message?: string })?.message ?? '에러가 발생했습니다.';
        setErr(msg);
      });
    };

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
            '고소장을 작성하려면 내 정보를 적어야 해요.',
            '로그인 시 입력한 정보를 불러올 수도 있고,',
            '직접 입력할 수도 있어요.',
          ]}
          center
          showArrow
          arrowSize={24}
          arrowOpacity={0.5}
          arrowFrom="var(--color-neutral-700)"
          arrowTo="var(--color-primary-400)"
        />

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-6 flex w-[420px] flex-col gap-6"
        >
          {/* 내 정보 불러오기 버튼 */}
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={handleLoadFromProfile}
              className={[
                'rounded-200 inline-flex items-center border px-3 py-[9px]',
                'border-primary-400 bg-primary-0/50 hover:bg-primary-50/50',
                'text-detail-regular text-neutral-800',
              ].join(' ')}
            >
              내 정보 불러오기
            </button>
          </div>

          {/* 입력 필드들 */}
          <div className="flex flex-1 flex-col justify-center gap-6 px-5">
            {/* 이름 */}
            <div className="flex flex-col gap-2">
              {renderLabel('이름', true)}
              <div className="flex items-center gap-4">
                <span
                  className="material-symbols-outlined text-primary-600/50"
                  style={{ fontSize: '24px' }}
                >
                  people
                </span>
                <input
                  id="name"
                  type="text"
                  className={[
                    'rounded-200 h-10 flex-1 px-3',
                    'border border-neutral-300',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="홍길동"
                />
              </div>
            </div>

            {/* 주소 */}
            <div className="flex flex-col gap-2">
              {renderLabel('주소', false)}
              <div className="flex items-center gap-4">
                <span
                  className="material-symbols-outlined text-primary-600/50"
                  style={{ fontSize: '24px' }}
                >
                  location_on
                </span>
                <div className="grid w-full grid-cols-3 gap-2">
                  <input
                    id="addr1"
                    value={addr1}
                    onChange={(e) => setAddr1(e.target.value)}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder="시/도"
                  />
                  <input
                    id="addr2"
                    value={addr2}
                    onChange={(e) => setAddr2(e.target.value)}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder="시/군/구"
                  />
                  <input
                    id="addr3"
                    value={addr3}
                    onChange={(e) => setAddr3(e.target.value)}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder="읍/면/동"
                  />
                </div>
              </div>
            </div>

            {/* 연락처 */}
            <div className="flex flex-col gap-2">
              {renderLabel('전화번호', false)}
              <div className="flex items-center gap-4">
                <span
                  className="material-symbols-outlined text-primary-600/50"
                  style={{ fontSize: '24px' }}
                >
                  phone_in_talk
                </span>
                <div className="grid w-full grid-cols-3 gap-2">
                  <input
                    id="phone1"
                    maxLength={3}
                    value={p1}
                    onChange={(e) => setP1(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder="010"
                    inputMode="numeric"
                  />
                  <input
                    id="phone2"
                    maxLength={4}
                    value={p2}
                    onChange={(e) => setP2(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder="1234"
                    inputMode="numeric"
                  />
                  <input
                    id="phone3"
                    maxLength={4}
                    value={p3}
                    onChange={(e) => setP3(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className={[
                      'rounded-200 h-10 flex-1 px-3 text-center',
                      'border border-neutral-300',
                      'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                    ].join(' ')}
                    placeholder="5678"
                    inputMode="numeric"
                  />
                </div>
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
