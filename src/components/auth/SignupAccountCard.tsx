import FormErrorMessage from '@/components/FormErrorMessage';
import React, { useState } from 'react';

type Props = {
  defaultValues?: {
    email?: string;
    password?: string;
  };
  onNext: (data: { email: string; password: string }) => void;
};

const SignupAccountCard: React.FC<Props> = ({ defaultValues, onNext }) => {
  // 사용자 입력값 상태 관리
  const [email, setEmail] = useState(defaultValues?.email ?? '');
  const [pw, setPw] = useState(defaultValues?.password ?? '');
  const [pwCheck, setPw2] = useState(defaultValues?.password ?? '');

  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);

  // UI 상태 관리
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // 다음 단계로 넘어가는 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 필수값 검증
    if (!email || !pw || !pwCheck) {
      setError('필수 항목들을 모두 입력해주세요.');
      return;
    }

    // 비밀번호 일치 여부 확인
    if (pw !== pwCheck) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    onNext({ email, password: pw });
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
        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          {renderLabel('이메일', true)}
          <div className="flex items-center gap-4">
            <span
              className="material-symbols-outlined text-primary-600/50"
              style={{ fontSize: '24px' }}
            >
              mail
            </span>
            <div className="flex w-full items-center gap-2">
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
              />

              {/* 중복 확인 버튼 */}
              <button
                type="button"
                onClick={() => {
                  // 여기에 이메일 중복 확인 로직 추가 예정임
                }}
                disabled={!email} // 이메일 입력 안 했으면 비활성화
                className={[
                  'rounded-200 text-detail-regular h-10 border px-3 transition-colors',
                  !email
                    ? 'cursor-not-allowed border-neutral-300 bg-neutral-100 text-neutral-400'
                    : 'border-primary-400 text-primary-400 hover:bg-primary-0/50',
                ].join(' ')}
              >
                중복 확인
              </button>
            </div>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          {renderLabel('비밀번호', true)}
          <div className="flex items-center gap-4">
            <span
              className="material-symbols-outlined text-primary-600/50"
              style={{ fontSize: '24px' }}
            >
              lock
            </span>
            <div className="relative flex-1">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                className={[
                  'rounded-200 h-10 w-full px-3 pr-10',
                  'border border-neutral-300',
                  'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                ].join(' ')}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="new-password"
              />

              {/* 눈 아이콘 버튼 */}
              <button
                type="button"
                onClick={() => setShowPw((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600"
                aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '20px' }}
                >
                  {showPw ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-4">
          {renderLabel('비밀번호 확인', true)}
          <div className="flex items-center gap-4">
            <span
              className="material-symbols-outlined text-primary-600/50"
              style={{ fontSize: '24px' }}
            >
              lock_reset
            </span>
            <div className="relative flex-1">
              <input
                id="password2"
                type={showPwCheck ? 'text' : 'password'}
                className={[
                  'rounded-200 h-10 w-full px-3 pr-10',
                  'border border-neutral-300',
                  'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
                ].join(' ')}
                value={pwCheck}
                onChange={(e) => setPw2(e.target.value)}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowPwCheck((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600"
                aria-label={showPwCheck ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '20px' }}
                >
                  {showPwCheck ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 경고 문구 */}
      <FormErrorMessage error={error} />

      {/* 다음 단계 버튼 */}
      <button
        type="submit"
        className={[
          'h-12 w-full items-center justify-center px-5',
          'rounded-200 text-body-3-bold text-neutral-0 transition-colors',
          !email || !pw || !pwCheck
            ? 'bg-primary-400 cursor-not-allowed opacity-60'
            : 'bg-primary-400 hover:bg-primary-600',
        ].join(' ')}
      >
        다음
      </button>
    </form>
  );
};

export default SignupAccountCard;
