import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import DaumPostcodeButton from '@/shared/ui/DaumPostcodeButton';
import type { DaumPostcodeResult } from '@/shared/ui/DaumPostcodeButton';
import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import IntroHeader from '@/shared/ui/IntroHeader';

// 통합 타입
export type AccusedFullInfo = {
  // basic
  name: string;
  email: string;
  address: string | null;
  phone: string;
  unknownName: boolean;
  unknownEmail: boolean;
  unknownAddr: boolean;
  unknownPhone: boolean;
  // extra
  occupation: string;
  officeAddress: string;
  etc: string;
  unknownOccupation: boolean;
  unknownOfficeAddress: boolean;
};

// 하위 호환
export type AccusedBasicInfo = AccusedFullInfo;

// 외부에서 save()를 호출할 수 있도록 노출
export type AccusedInfoSectionHandle = {
  save: () => Promise<AccusedFullInfo>;
};

type Props = {
  complaintId: number;
};

const AccusedInfoSection = forwardRef<AccusedInfoSectionHandle, Props>(({ complaintId }, ref) => {
  // === 기본 정보 ===
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [addr3, setAddr3] = useState('');
  const [phone, setPhone] = useState('');

  const [unknownName, setUnknownName] = useState(false);
  const [unknownEmail, setUnknownEmail] = useState(false);
  const [unknownAddr, setUnknownAddr] = useState(false);
  const [unknownPhone, setUnknownPhone] = useState(false);

  // === 추가 정보 ===
  const [occupation, setOccupation] = useState('');
  const [officeAddr1, setOfficeAddr1] = useState('');
  const [officeAddr2, setOfficeAddr2] = useState('');
  const [officeAddr3, setOfficeAddr3] = useState('');
  const [etc, setEtc] = useState('');

  const [unknownOccupation, setUnknownOccupation] = useState(false);
  const [unknownOfficeAddress, setUnknownOfficeAddress] = useState(false);

  // 전체 정보 없음 토글
  const allBasicUnknown = unknownName && unknownEmail && unknownAddr && unknownPhone;
  const allExtraUnknown = unknownOccupation && unknownOfficeAddress;

  const handleToggleAllBasic = (checked: boolean) => {
    setUnknownName(checked);
    setUnknownEmail(checked);
    setUnknownAddr(checked);
    setUnknownPhone(checked);
    if (checked) {
      setName('');
      setEmail('');
      setAddr1('');
      setAddr2('');
      setAddr3('');
      setPhone('');
      setHasAddress(false);
    }
  };

  const handleToggleAllExtra = (checked: boolean) => {
    setUnknownOccupation(checked);
    setUnknownOfficeAddress(checked);
    if (checked) {
      setOccupation('');
      setOfficeAddr1('');
      setOfficeAddr2('');
      setOfficeAddr3('');
      setHasOfficeAddress(false);
    }
  };

  // UI
  const [err, setErr] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [hasAddress, setHasAddress] = useState(false);
  const [hasOfficeAddress, setHasOfficeAddress] = useState(false);

  // 주소 선택 콜백
  const handleAddressSelect = (data: DaumPostcodeResult) => {
    setAddr1(data.sido);
    setAddr2(data.sigungu);
    setAddr3(data.bname);
    setHasAddress(true);
    setUnknownAddr(false);
    setErr(null);
  };

  const handleOfficeAddressSelect = (data: DaumPostcodeResult) => {
    setOfficeAddr1(data.sido);
    setOfficeAddr2(data.sigungu);
    setOfficeAddr3(data.bname);
    setHasOfficeAddress(true);
    setUnknownOfficeAddress(false);
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

  // 입력값 변경 시 에러 자동 해제
  useEffect(() => {
    if (err) setErr(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    name,
    email,
    phone,
    addr1,
    occupation,
    officeAddr1,
    etc,
    unknownName,
    unknownEmail,
    unknownAddr,
    unknownPhone,
    unknownOccupation,
    unknownOfficeAddress,
  ]);

  // 라벨 렌더러

  // 주소 문자열
  const address = useMemo(() => {
    if (unknownAddr) return '';
    return [addr1, addr2, addr3].filter(Boolean).join(' ').trim();
  }, [addr1, addr2, addr3, unknownAddr]);

  const officeAddress = useMemo(() => {
    if (unknownOfficeAddress) return '';
    return [officeAddr1, officeAddr2, officeAddr3].filter(Boolean).join(' ').trim();
  }, [officeAddr1, officeAddr2, officeAddr3, unknownOfficeAddress]);

  const phoneValue = useMemo(() => {
    if (unknownPhone) return '';
    return phoneDigits;
  }, [phoneDigits, unknownPhone]);

  // 정보 없음 체크 핸들러
  const handleCheckboxChange = (
    checked: boolean,
    setFlag: React.Dispatch<React.SetStateAction<boolean>>,
    ...setters: React.Dispatch<React.SetStateAction<string>>[]
  ) => {
    setFlag(checked);
    if (checked) setters.forEach((setter) => setter(''));
  };

  // 유효성 검사 + 객체 빌드
  const buildFullInfo = (): AccusedFullInfo => {
    if (!Number.isFinite(complaintId) || complaintId <= 0) {
      const msg = '잘못된 고소장 ID입니다.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownName && !name.trim()) {
      const msg = '이름을 입력하거나 "정보 없음"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownEmail && !email.trim()) {
      const msg = '이메일을 입력하거나 "정보 없음"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownAddr && !address) {
      const msg = '주소를 입력하거나 "정보 없음"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownPhone && phoneDigits.length < 10) {
      const msg = '연락처를 입력하거나 "정보 없음"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownOccupation && !occupation.trim()) {
      const msg = '직업을 입력하거나 "정보 없음"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }
    if (!unknownOfficeAddress && !officeAddress.trim()) {
      const msg = '사무실 주소를 입력하거나 "정보 없음"을 선택해주세요.';
      setErr(msg);
      throw new Error(msg);
    }

    setErr(null);

    return {
      name: unknownName ? ' ' : name.trim(),
      email: unknownEmail ? ' ' : email.trim(),
      address: unknownAddr ? null : address,
      phone: unknownPhone ? ' ' : phoneValue,
      unknownName,
      unknownEmail,
      unknownAddr,
      unknownPhone,
      occupation: unknownOccupation ? ' ' : occupation.trim(),
      officeAddress: unknownOfficeAddress ? ' ' : officeAddress.trim(),
      etc: etc.trim(),
      unknownOccupation,
      unknownOfficeAddress,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      buildFullInfo();
    } catch {
      // 에러 메시지는 이미 setErr로 처리됨
    }
  };

  useImperativeHandle(ref, () => ({
    save: async () => {
      const info = buildFullInfo();
      return info;
    },
  }));

  return (
    <section
      className={['flex flex-col items-center', 'w-full flex-1', 'pb-6', 'bg-neutral-0'].join(' ')}
    >
      <IntroHeader
        title="고소장 작성하기"
        lines={[
          '상대방에 대한 정보를 작성해주세요.',
          '알고 있는 범위 내에서만 상대방 정보를 작성해도 괜찮아요.',
        ]}
        center
        showArrow
      />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mt-2 flex w-full flex-1 flex-col items-center justify-center gap-6"
      >
        {/* ID 카드 미리보기 */}
        <div className="w-full max-w-[520px]">
          <div className="overflow-hidden rounded-2xl border border-neutral-300 bg-gradient-to-br from-neutral-50 to-white shadow-sm">
            <div className="flex items-center gap-2 bg-neutral-700 px-5 py-2.5">
              <span
                className="material-symbols-outlined text-white/80"
                style={{ fontSize: '16px' }}
              >
                person_search
              </span>
              <span className="text-detail-bold text-white/90">피고소인 정보</span>
            </div>
            {/* Top row: basic */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-4">
              <div>
                <p className="text-detail-regular text-neutral-400">이름</p>
                <p
                  className={`text-body-3-bold transition-colors ${unknownName ? 'text-neutral-300 italic' : name ? 'text-neutral-900' : 'text-neutral-300'}`}
                >
                  {unknownName ? '정보 없음' : name || '---'}
                </p>
              </div>
              <div>
                <p className="text-detail-regular text-neutral-400">전화번호</p>
                <p
                  className={`text-body-3-bold transition-colors ${unknownPhone ? 'text-neutral-300 italic' : phone ? 'text-neutral-900' : 'text-neutral-300'}`}
                >
                  {unknownPhone ? '정보 없음' : phone || '---'}
                </p>
              </div>
              <div>
                <p className="text-detail-regular text-neutral-400">이메일</p>
                <p
                  className={`text-body-3-bold transition-colors ${unknownEmail ? 'text-neutral-300 italic' : email ? 'text-neutral-900' : 'text-neutral-300'}`}
                >
                  {unknownEmail ? '정보 없음' : email || '---'}
                </p>
              </div>
              <div>
                <p className="text-detail-regular text-neutral-400">주소</p>
                <p
                  className={`text-body-3-bold transition-colors ${unknownAddr ? 'text-neutral-300 italic' : hasAddress ? 'text-neutral-900' : 'text-neutral-300'}`}
                >
                  {unknownAddr
                    ? '정보 없음'
                    : hasAddress
                      ? [addr1, addr2, addr3].filter(Boolean).join(' ')
                      : '---'}
                </p>
              </div>
            </div>
            {/* Bottom row: extra */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-neutral-200 px-5 py-4">
              <div>
                <p className="text-detail-regular text-neutral-400">직업</p>
                <p
                  className={`text-body-3-bold transition-colors ${unknownOccupation ? 'text-neutral-300 italic' : occupation ? 'text-neutral-900' : 'text-neutral-300'}`}
                >
                  {unknownOccupation ? '정보 없음' : occupation || '---'}
                </p>
              </div>
              <div>
                <p className="text-detail-regular text-neutral-400">사무실 주소</p>
                <p
                  className={`text-body-3-bold transition-colors ${unknownOfficeAddress ? 'text-neutral-300 italic' : hasOfficeAddress ? 'text-neutral-900' : 'text-neutral-300'}`}
                >
                  {unknownOfficeAddress
                    ? '정보 없음'
                    : hasOfficeAddress
                      ? [officeAddr1, officeAddr2, officeAddr3].filter(Boolean).join(' ')
                      : '---'}
                </p>
              </div>
              <div>
                <p className="text-detail-regular text-transparent">-</p>
                <p className="text-body-3-bold text-transparent">-</p>
              </div>
              <div>
                <p className="text-detail-regular text-transparent">-</p>
                <p className="text-body-3-bold text-transparent">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* 입력 폼 카드 */}
        <div className="w-full max-w-[520px]">
          <div className="max-h-[480px] overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {/* 기본 정보 서브헤더 */}
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-5 py-3">
              <span className="text-detail-bold text-neutral-500">기본 정보</span>
              <label className="text-detail-regular inline-flex cursor-pointer items-center gap-1.5 text-neutral-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer"
                  checked={allBasicUnknown}
                  onChange={(e) => handleToggleAllBasic(e.target.checked)}
                />
                전체 정보 없음
              </label>
            </div>

            {/* 이름 */}
            <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
              <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">이름</span>
              <input
                disabled={unknownName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-200 text-body-3-regular focus:border-primary-400 focus:ring-primary-400 h-9 flex-1 border border-neutral-300 px-3 outline-none focus:ring-2 disabled:bg-neutral-100 disabled:text-neutral-400"
                placeholder={unknownName ? '정보 없음' : '이름 입력'}
                type="text"
              />
              <label className="text-detail-regular inline-flex shrink-0 cursor-pointer items-center gap-1 text-neutral-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer"
                  checked={unknownName}
                  onChange={(e) => handleCheckboxChange(e.target.checked, setUnknownName, setName)}
                />
                정보 없음
              </label>
            </div>

            {/* 이메일 */}
            <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
              <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">이메일</span>
              <input
                disabled={unknownEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-200 text-body-3-regular focus:border-primary-400 focus:ring-primary-400 h-9 flex-1 border border-neutral-300 px-3 outline-none focus:ring-2 disabled:bg-neutral-100 disabled:text-neutral-400"
                placeholder={unknownEmail ? '정보 없음' : '이메일 입력'}
                type="text"
              />
              <label className="text-detail-regular inline-flex shrink-0 cursor-pointer items-center gap-1 text-neutral-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer"
                  checked={unknownEmail}
                  onChange={(e) =>
                    handleCheckboxChange(e.target.checked, setUnknownEmail, setEmail)
                  }
                />
                정보 없음
              </label>
            </div>

            {/* 전화번호 */}
            <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
              <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">전화번호</span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder={unknownPhone ? '정보 없음' : '010-1234-5678'}
                value={phone}
                onChange={handlePhoneChange}
                disabled={unknownPhone}
                className="rounded-200 text-body-3-regular focus:border-primary-400 focus:ring-primary-400 h-9 flex-1 border border-neutral-300 px-3 outline-none focus:ring-2 disabled:bg-neutral-100 disabled:text-neutral-400"
                autoComplete="tel"
              />
              <label className="text-detail-regular inline-flex shrink-0 cursor-pointer items-center gap-1 text-neutral-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer"
                  checked={unknownPhone}
                  onChange={(e) => {
                    if (e.target.checked) setPhone('');
                    setUnknownPhone(e.target.checked);
                  }}
                />
                정보 없음
              </label>
            </div>

            {/* 주소 */}
            <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
              <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">주소</span>
              <div className="flex-1">
                {unknownAddr ? (
                  <div className="rounded-200 flex h-9 w-full items-center border border-neutral-300 bg-neutral-100 px-3 text-neutral-400">
                    정보 없음
                  </div>
                ) : (
                  <DaumPostcodeButton
                    onSelect={handleAddressSelect}
                    address={hasAddress ? { city: addr1, district: addr2, town: addr3 } : undefined}
                  />
                )}
              </div>
              <label className="text-detail-regular inline-flex shrink-0 cursor-pointer items-center gap-1 text-neutral-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer"
                  checked={unknownAddr}
                  onChange={(e) => {
                    handleCheckboxChange(
                      e.target.checked,
                      setUnknownAddr,
                      setAddr1,
                      setAddr2,
                      setAddr3,
                    );
                    if (e.target.checked) {
                      setErr(null);
                      setHasAddress(false);
                    }
                  }}
                />
                정보 없음
              </label>
            </div>

            {/* 추가 정보 서브헤더 */}
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-5 py-3">
              <span className="text-detail-bold text-neutral-500">추가 정보</span>
              <label className="text-detail-regular inline-flex cursor-pointer items-center gap-1.5 text-neutral-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer"
                  checked={allExtraUnknown}
                  onChange={(e) => handleToggleAllExtra(e.target.checked)}
                />
                전체 정보 없음
              </label>
            </div>

            {/* 직업 */}
            <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
              <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">직업</span>
              <input
                disabled={unknownOccupation}
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="rounded-200 text-body-3-regular focus:border-primary-400 focus:ring-primary-400 h-9 flex-1 border border-neutral-300 px-3 outline-none focus:ring-2 disabled:bg-neutral-100 disabled:text-neutral-400"
                placeholder={unknownOccupation ? '정보 없음' : '예: 회사원, 자영업자 등'}
                type="text"
              />
              <label className="text-detail-regular inline-flex shrink-0 cursor-pointer items-center gap-1 text-neutral-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer"
                  checked={unknownOccupation}
                  onChange={(e) =>
                    handleCheckboxChange(e.target.checked, setUnknownOccupation, setOccupation)
                  }
                />
                정보 없음
              </label>
            </div>

            {/* 사무실 주소 */}
            <div className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3">
              <span className="text-body-3-bold w-20 shrink-0 text-neutral-600">사무실 주소</span>
              <div className="flex-1">
                {unknownOfficeAddress ? (
                  <div className="rounded-200 flex h-9 w-full items-center border border-neutral-300 bg-neutral-100 px-3 text-neutral-400">
                    정보 없음
                  </div>
                ) : (
                  <DaumPostcodeButton
                    onSelect={handleOfficeAddressSelect}
                    address={
                      hasOfficeAddress
                        ? { city: officeAddr1, district: officeAddr2, town: officeAddr3 }
                        : undefined
                    }
                  />
                )}
              </div>
              <label className="text-detail-regular inline-flex shrink-0 cursor-pointer items-center gap-1 text-neutral-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer"
                  checked={unknownOfficeAddress}
                  onChange={(e) => {
                    handleCheckboxChange(
                      e.target.checked,
                      setUnknownOfficeAddress,
                      setOfficeAddr1,
                      setOfficeAddr2,
                      setOfficeAddr3,
                    );
                    if (e.target.checked) {
                      setErr(null);
                      setHasOfficeAddress(false);
                    }
                  }}
                />
                정보 없음
              </label>
            </div>

            {/* 기타 정보 */}
            <div className="flex items-start gap-4 px-5 py-3">
              <span className="text-body-3-bold w-20 shrink-0 pt-2 text-neutral-600">
                기타 정보
              </span>
              <textarea
                value={etc}
                onChange={(e) => setEtc(e.target.value)}
                className="rounded-200 text-body-3-regular focus:border-primary-400 focus:ring-primary-400 min-h-[100px] flex-1 resize-y border border-neutral-300 px-3 py-2 outline-none focus:ring-2"
                placeholder="계좌 번호, 관계 등 특정할 수 있는 정보"
              />
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        <FormErrorMessage error={err} />
      </form>
    </section>
  );
});

export default AccusedInfoSection;
