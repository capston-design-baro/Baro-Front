import FormErrorMessage from '@/components/FormErrorMessage';
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
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  // UI 상태 관리
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // 다음 단계로 넘어가는 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 필수값 검증
    if (!name) {
      setError('필수 항목들을 모두 입력해주세요.');
      return;
    }

    const fullPhone = [phone1, phone2, phone3].join('').trim();

    onNext({ name, city, district, town, phone: fullPhone });
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
              person
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

        {/* 주소 */}
        <div className="flex flex-col gap-2">
          {/* 주소 라벨 */}
          {renderLabel('주소', false)}

          {/* 아이콘 + 주소 입력칸 3개 한 줄 */}
          <div className="flex items-center gap-4">
            {/* 아이콘 */}
            <span
              className="material-symbols-outlined text-primary-600/50"
              style={{ fontSize: '24px' }}
            >
              location_on
            </span>

            {/* 입력칸 3개 */}
            <div className="grid w-full grid-cols-3 gap-2">
              <input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={[
                  'rounded-200 w- h-10 flex-1 px-3 text-center',
                  'border border-neutral-300',
                  'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                ].join(' ')}
              />

              <input
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={[
                  'rounded-200 w- h-10 flex-1 px-3 text-center',
                  'border border-neutral-300',
                  'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                ].join(' ')}
              />

              <input
                id="town"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className={[
                  'rounded-200 w- h-10 flex-1 px-3 text-center',
                  'border border-neutral-300',
                  'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                ].join(' ')}
              />
            </div>
          </div>
        </div>

        {/* 전화번호 */}
        <div className="flex flex-col gap-2">
          {/* 전화번호 라벨 */}
          {renderLabel('전화번호', false)}

          {/* 아이콘 + 주소 입력칸 3개 한 줄 */}
          <div className="flex items-center gap-4">
            {/* 아이콘 */}
            <span
              className="material-symbols-outlined text-primary-600/50"
              style={{ fontSize: '24px' }}
            >
              phone_in_talk
            </span>

            {/* 입력칸 3개 */}
            <div className="grid w-full grid-cols-3 gap-2">
              <input
                id="phone1"
                maxLength={3}
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                className={[
                  'rounded-200 w- h-10 flex-1 px-3 text-center',
                  'border border-neutral-300',
                  'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                ].join(' ')}
              />

              <input
                id="phone2"
                maxLength={4}
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                className={[
                  'rounded-200 w- h-10 flex-1 px-3 text-center',
                  'border border-neutral-300',
                  'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                ].join(' ')}
              />

              <input
                id="phone3"
                maxLength={4}
                value={phone3}
                onChange={(e) => setPhone3(e.target.value)}
                className={[
                  'rounded-200 w- h-10 flex-1 px-3 text-center',
                  'border border-neutral-300',
                  'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                ].join(' ')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 경고 문구 */}
      <FormErrorMessage error={error} />

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() =>
            onBack({ name, city, district, town, phone: [phone1, phone2, phone3].join('').trim() })
          }
          className={[
            'h-12 flex-1 items-center justify-center',
            'rounded-200 border-primary-400 border',
            'text-body-3-bold text-primary-400 transition-colors',
          ].join(' ')}
        >
          이전
        </button>
        <button
          type="submit"
          className={[
            'h-12 flex-1 items-center justify-center',
            'rounded-200 text-body-3-bold text-neutral-0 transition-colors',
            !name
              ? 'bg-primary-400 cursor-not-allowed opacity-60'
              : 'bg-primary-400 hover:bg-primary-600',
          ].join(' ')}
        >
          회원가입
        </button>
      </div>
    </form>
  );
};

export default SignupProfileCard;
