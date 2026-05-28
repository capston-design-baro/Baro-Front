import React, { useState } from 'react';

import DaumPostcodeButton from '@/shared/ui/DaumPostcodeButton';
import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import Button from '@/shared/ui/common/Button';

import AuthCard from '@/features/auth/components/AuthCard';
import { mapAuthError } from '@/features/auth/utils/mapAuthError';

type SignupProfileData = {
  name: string;
  city: string;
  district: string;
  town: string;
  phone: string;
};

type Props = {
  defaultValues: SignupProfileData;
  onBack: (data?: SignupProfileData) => void;
  onNext: (data: SignupProfileData) => Promise<void> | void;
};

const SignupProfileCard: React.FC<Props> = ({ defaultValues, onBack, onNext }) => {
  // 사용자 입력 상태 관리
  const [name, setName] = useState(defaultValues.name);
  const [city, setCity] = useState(defaultValues.city);
  const [district, setDistrict] = useState(defaultValues.district);
  const [town, setTown] = useState(defaultValues.town);
  const [phone, setPhone] = useState(defaultValues.phone);

  // UI 상태 관리
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // 주소가 검색으로 세팅된 적 있는지
  const [hasAddress, setHasAddress] = useState(
    !!(defaultValues.city || defaultValues.district || defaultValues.town),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 전화번호 포맷팅 (숫자만 추출 → 010-1234-5678 형태로 변환)
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

  // 주소 선택 결과 수신
  const handleAddressSelect = (data: { sido: string; sigungu: string; bname: string }) => {
    setCity(data.sido || '');
    setDistrict(data.sigungu || '');
    setTown(data.bname || '');
    setHasAddress(true);
    setError(null); // 이전 에러가 있으면 지우기
  };

  // 다음 단계로 넘어가는 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // 중복 클릭 방지

    setError(null);

    // 필수값 검증
    if (!name || !city || !district || !town || phoneDigits.length < 10) {
      setError('필수 항목들을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onNext({ name, city, district, town, phone: phoneDigits });
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <AuthCard
      as="form"
      onSubmit={handleSubmit}
      className="gap-6"
    >
      {/* 제목 + 이전 버튼 */}
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={() => onBack({ name, city, district, town, phone: phoneDigits })}
          className="absolute left-0 flex items-center text-neutral-400 hover:text-neutral-600"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '28px' }}
          >
            chevron_left
          </span>
        </button>
        <h2 className="text-heading-1-bold text-primary-400 text-center">회원가입</h2>
      </div>

      {/* 입력 폼 */}
      <div className="mt-15 flex flex-1 flex-col justify-center gap-6 px-5">
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
              placeholder="홍길동"
              type="name"
              className={[
                'rounded-200 w- h-8 flex-1 px-3',
                'border border-neutral-300',
                'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
              ].join(' ')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
        </div>

        {/* 주소 */}
        <div className="flex flex-col gap-2">
          {renderLabel('주소', true)}
          <div className="flex items-center gap-4">
            <span
              className="material-symbols-outlined text-primary-600/50"
              style={{ fontSize: '24px' }}
            >
              location_on
            </span>
            <DaumPostcodeButton
              onSelect={handleAddressSelect}
              address={hasAddress ? { city, district, town } : undefined}
            />
          </div>
        </div>

        {/* 전화번호 */}
        <div className="flex flex-col gap-2">
          {renderLabel('전화번호', true)}
          <div className="flex items-center gap-4">
            <span
              className="material-symbols-outlined text-primary-600/50"
              style={{ fontSize: '24px' }}
            >
              phone_in_talk
            </span>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="010-1234-5678"
              value={phone}
              onChange={handlePhoneChange}
              className={[
                'rounded-200 h-8 flex-1 px-3',
                'border border-neutral-300',
                'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
              ].join(' ')}
              autoComplete="tel"
            />
          </div>
        </div>
      </div>

      {/* 경고 문구 */}
      <FormErrorMessage error={error} />

      <Button
        variant="primary"
        size="md"
        fullWidth
        disabled={isSubmitting || !name || !city || !district || !town || phoneDigits.length < 10}
      >
        {isSubmitting ? '회원가입 진행중...' : '회원가입'}
      </Button>
    </AuthCard>
  );
};

export default SignupProfileCard;
