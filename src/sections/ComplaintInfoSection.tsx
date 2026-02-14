import { getMe } from '@/apis/auth';
import DaumPostcodeButton from '@/components/DaumPostcodeButton';
import type { DaumPostcodeResult } from '@/components/DaumPostcodeButton';
import FormErrorMessage from '@/components/FormErrorMessage';
import IntroHeader from '@/components/IntroHeader';
import Button from '@/components/common/Button';
import { splitAddressTo3FromString, splitPhoneKR } from '@/utils/krContact';
import type { AxiosError } from 'axios';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

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
    const [p1, setP1] = useState('');
    const [p2, setP2] = useState('');
    const [p3, setP3] = useState('');

    // UI 상태 관리
    const [err, setErr] = useState<string | null>(null); // 에러 메시지만 유지

    const [hasAddress, setHasAddress] = useState(false);

    // 주소 필드 클릭 시 에러 띄우기
    const handleAddressFieldClick = () => {
      if (!hasAddress) {
        setErr('주소 찾기 버튼을 눌러 주소를 선택해주세요.');
      }
    };

    // 주소 선택 콜백 (다음 API에서 선택되면 호출)
    const handleAddressSelect = (data: DaumPostcodeResult) => {
      const { a1, a2, a3 } = splitAddressTo3FromString(data.roadAddress);
      setAddr1(a1);
      setAddr2(a2);
      setAddr3(a3);
      setHasAddress(true);
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

    // 기본 정보 객체 만들기
    const buildBasicInfo = (): ComplaintBasicInfo => {
      setErr(null);

      if (!name.trim()) {
        const msg = '필수 항목을 입력해주세요.';
        setErr(msg);
        throw new Error(msg);
      }

      const address = [addr1, addr2, addr3].filter(Boolean).join(' ').trim();
      const phone = [p1, p2, p3].join('-').replace(/--+/g, '-').trim();

      return {
        name: name.trim(),
        email: email.trim(),
        address,
        phone,
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
            '고소장을 작성하려면 내 정보를 적어야 해요.',
            '로그인 시 입력한 정보를 불러올 수도 있고,',
            '직접 입력할 수도 있어요.',
          ]}
          center
          showArrow
        />

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-2 flex w-[420px] flex-col gap-5"
        >
          {/* 내 정보 불러오기 버튼 */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadFromProfile}
            >
              내 정보 불러오기
            </Button>
          </div>

          {/* 입력 필드들 */}
          <div className="flex flex-1 flex-col justify-center gap-5 px-5">
            {/* 이름 */}
            <div className="flex flex-col gap-2">
              {renderLabel('이름', true)}
              <div className="flex items-center gap-4">
                <span
                  className="material-symbols-outlined text-primary-600/50"
                  style={{ fontSize: '24px' }}
                >
                  person
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

            {/* 이메일 */}
            <div className="flex flex-col gap-2">
              {renderLabel('이메일', false)} {/* 필수로 바꾸고 싶으면 true */}
              <div className="flex items-center gap-4">
                <span
                  className="material-symbols-outlined text-primary-600/50"
                  style={{ fontSize: '24px' }}
                >
                  email
                </span>
                <input
                  id="email"
                  type="email"
                  className={[
                    'rounded-200 h-10 flex-1 px-3',
                    'border border-neutral-300',
                    'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                  ].join(' ')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* 주소 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                {/* 주소 라벨 */}
                {renderLabel('주소', true)}

                {/* 주소 검색 버튼 */}
                <DaumPostcodeButton onSelect={handleAddressSelect} />
              </div>
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
                    readOnly
                    onClick={handleAddressFieldClick}
                    onFocus={handleAddressFieldClick}
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
                    readOnly
                    onClick={handleAddressFieldClick}
                    onFocus={handleAddressFieldClick}
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
                    readOnly
                    onClick={handleAddressFieldClick}
                    onFocus={handleAddressFieldClick}
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
              {renderLabel('전화번호', true)}
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
