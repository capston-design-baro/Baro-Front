import type { AxiosError } from 'axios';

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import DaumPostcodeButton from '@/shared/ui/DaumPostcodeButton';
import type { DaumPostcodeResult } from '@/shared/ui/DaumPostcodeButton';
import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import IntroHeader from '@/shared/ui/IntroHeader';
import Button from '@/shared/ui/common/Button';
import { splitAddressTo3FromString } from '@/shared/utils/krContact';

import { getMe } from '@/features/auth/apis/auth';

// 부모에서 사용할 타입
export type ComplaintBasicInfo = {
  name: string;
  email: string;
  address: string;
  phone: string;
  unknownName: boolean;
  unknownEmail: boolean;
  unknownAddr: boolean;
  unknownPhone: boolean;
};

// 부모 컴포넌트에서 save()를 직접 호출할 수 있도록 인터페이스 정의
type Props = { onLoaded?: () => void };

export type ComplainantInfoSectionHandle = {
  save: () => Promise<ComplaintBasicInfo>;
};

const ComplainantInfoSection = forwardRef<ComplainantInfoSectionHandle, Props>(
  ({ onLoaded }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    // 입력값 상태 관리
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [addr1, setAddr1] = useState('');
    const [addr2, setAddr2] = useState('');
    const [addr3, setAddr3] = useState('');
    const [phone, setPhone] = useState('');

    // UI 상태 관리
    const [err, setErr] = useState<string | null>(null); // 에러 메시지만 유지

    const [hasAddress, setHasAddress] = useState(false);

    // 주소 선택 콜백
    const handleAddressSelect = (data: DaumPostcodeResult) => {
      setAddr1(data.sido);
      setAddr2(data.sigungu);
      setAddr3(data.bname);
      setHasAddress(true);
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

    // 기본 정보 객체 만들기
    const buildBasicInfo = (): ComplaintBasicInfo => {
      setErr(null);

      if (!name.trim()) {
        const msg = '필수 항목을 입력해주세요.';
        setErr(msg);
        throw new Error(msg);
      }

      const address = [addr1, addr2, addr3].filter(Boolean).join(' ').trim();

      return {
        name: name.trim(),
        email: email.trim(),
        address,
        phone: phoneDigits,
        // 아직 "모름/비공개" 체크 UI가 없으니 기본값은 false
        unknownName: false,
        unknownEmail: false,
        unknownAddr: false,
        unknownPhone: false,
      };
    };

    useImperativeHandle(ref, () => ({
      save: async () => {
        try {
          const info = buildBasicInfo();
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
        const info = buildBasicInfo();
        // 이 폼에서 직접 submit 버튼 눌렀을 때도 onLoaded 호출할지 여부는 선택
        onLoaded?.();
        // submit 시에는 그냥 검증 성공만 해도 되기 때문에 추가 동작은 선택사항
        void info; // eslint 안 쓰게 한줄
      } catch {
        // 에러는 buildBasicInfo 안에서 setErr로 처리됨
      }
    };

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
          className="mt-2 flex w-[420px] flex-1 flex-col justify-center gap-5"
        >
          {/* 입력 필드 카드 */}
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-300 w-full max-w-[520px] border border-neutral-200 bg-white shadow-sm">
              {/* 카드 헤더 */}
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
                <span className="text-body-3-bold text-neutral-700">내 정보</span>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleLoadFromProfile}
                >
                  불러오기
                </Button>
              </div>

              {/* 이름 */}
              <div className="flex flex-col gap-2 border-b border-neutral-100 px-5 py-4">
                {renderLabel('이름', true)}
                <input
                  id="name"
                  type="text"
                  className={[
                    'rounded-200 h-10 w-full px-3',
                    'border border-neutral-300',
                    'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
                  ].join(' ')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="홍길동"
                />
              </div>

              {/* 이메일 */}
              <div className="flex flex-col gap-2 border-b border-neutral-100 px-5 py-4">
                {renderLabel('이메일', false)}
                <input
                  id="email"
                  type="email"
                  className={[
                    'rounded-200 h-10 w-full px-3',
                    'border border-neutral-300',
                    'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
                  ].join(' ')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="example@email.com"
                />
              </div>

              {/* 주소 */}
              <div className="flex flex-col gap-2 border-b border-neutral-100 px-5 py-4">
                {renderLabel('주소', true)}
                <DaumPostcodeButton
                  onSelect={handleAddressSelect}
                  address={hasAddress ? { city: addr1, district: addr2, town: addr3 } : undefined}
                />
              </div>

              {/* 전화번호 */}
              <div className="flex flex-col gap-2 px-5 py-4">
                {renderLabel('전화번호', true)}
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={[
                    'rounded-200 h-10 w-full px-3',
                    'border border-neutral-300',
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
  },
);

export default ComplainantInfoSection;
