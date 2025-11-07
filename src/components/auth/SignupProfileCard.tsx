import React, { useState } from 'react';

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
  onNext: (data: SignupProfileData) => void;
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

  // 다음 단계로 넘어가는 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 필수값 검증
    if (!name || !city) {
      setError('필수 항목들을 모두 입력해주세요.');
      return;
    }

    onNext({ name, city, district, town, phone });
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
    <form
      onSubmit={handleSubmit}
      className={[
        'rounded-300 border-primary-400 border',
        'px-8 py-10',
        'h-full',
        'flex flex-col',
      ].join(' ')}
    >
      {/* 제목 */}
      <h2 className="text-heading-1-bold text-primary-400 text-center">회원가입</h2>

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
              people
            </span>
            <input
              id="name"
              type="name"
              className={[
                'rounded-200 w- h-10 flex-1 px-3',
                'border border-neutral-300',
                'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
              ].join(' ')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="시/도"
            className="h-10 rounded-lg border px-3"
          />
          <input
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="구/군"
            className="h-10 rounded-lg border px-3"
          />
          <input
            value={town}
            onChange={(e) => setTown(e.target.value)}
            placeholder="동/면/읍"
            className="h-10 rounded-lg border px-3"
          />
        </div>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="전화번호"
          className="h-10 w-full rounded-lg border px-3"
        />
      </div>

      <div className="flex gap-3">
        {/* 경고 문구 */}
        <div
          aria-live="polite"
          className="mb-4 flex min-h-[24px] justify-center"
        >
          {error && <p className="text-body-3-regular text-warning-200">{error}</p>}
        </div>
        <button
          type="button"
          onClick={() => onBack({ name, city, district, town, phone })}
          className="h-12 flex-1 rounded-xl border border-blue-600 font-semibold text-blue-600"
        >
          이전
        </button>
        <button
          type="submit"
          className="h-12 flex-1 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700"
        >
          회원가입
        </button>
      </div>
    </form>
  );
};

export default SignupProfileCard;
