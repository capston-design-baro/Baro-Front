import React, { useState } from 'react';

import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import Button from '@/shared/ui/common/Button';

import { checkEmailAvailability } from '@/features/auth/apis/auth';
import AuthCard from '@/features/auth/components/AuthCard';
import { mapAuthError } from '@/features/auth/utils/mapAuthError';

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

  // 중복 확인이 완료된 이메일을 기억 → 수정하지 않는 한 success 유지
  const [checkedEmail, setCheckedEmail] = useState(defaultValues?.email ?? '');
  const [emailCheckState, setEmailCheckState] = useState<'idle' | 'checking' | 'error'>('idle');
  const emailCheckStatus: 'idle' | 'checking' | 'success' | 'error' =
    checkedEmail && email.trim() === checkedEmail ? 'success' : emailCheckState;

  // UI 상태 관리
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // 다음 단계로 넘어가는 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 이메일 중복 확인 여부 검증 추가
    if (emailCheckStatus !== 'success') {
      setError('이메일 중복 확인을 먼저 진행해주세요.');
      return;
    }

    // 필수값 검증
    if (!email || !pw || !pwCheck) {
      setError('필수 항목들을 모두 입력해주세요.');
      return;
    }

    // 비밀번호 길이 검증
    if (pw.length < 8 || pw.length > 72) {
      setError('비밀번호는 8자 이상 72자 이하여야 합니다.');
      return;
    }

    // 비밀번호 일치 여부 확인
    if (pw !== pwCheck) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    onNext({ email, password: pw });
  };

  const handleEmailCheck = async () => {
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError('이메일을 먼저 입력해주세요.');
      return;
    }

    // 간단한 이메일 형식 체크 (프론트 유효성용)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      setEmailCheckState('checking');
      const res = await checkEmailAvailability(trimmed);

      if (res.available) {
        setCheckedEmail(trimmed);
        setEmailCheckState('idle');
        setError(null);
      } else {
        setCheckedEmail('');
        setEmailCheckState('error');
        setError(res.message);
      }
    } catch (e) {
      console.error('failed to check email', e);
      setCheckedEmail('');
      setEmailCheckState('error');
      setError(mapAuthError(e));
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

  const isNextDisabled = !email || !pw || !pwCheck || emailCheckStatus !== 'success';

  return (
    <AuthCard
      as="form"
      onSubmit={handleSubmit}
      className="gap-6"
    >
      {/* 입력 폼 */}
      <div className="flex flex-col gap-5">
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
            <div className="relative flex-1">
              <input
                id="email"
                type="email"
                className={[
                  'rounded-200 h-8 w-full px-3',
                  emailCheckStatus === 'success'
                    ? 'border-positive-200 bg-positive-0/30 border'
                    : 'border border-neutral-300',
                  emailCheckStatus === 'success'
                    ? 'focus:border-positive-200 focus:ring-positive-200 outline-none focus:ring-2'
                    : 'focus:border-primary-400 focus:ring-primary-400 outline-none focus:ring-2',
                  emailCheckStatus === 'success' ? 'pr-8' : '',
                ].join(' ')}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailCheckState('idle');
                }}
                autoComplete="email"
              />
              {emailCheckStatus === 'success' && (
                <span
                  className="material-symbols-outlined text-positive-200 absolute top-1/2 right-2 -translate-y-1/2"
                  style={{ fontSize: '18px' }}
                >
                  check_circle
                </span>
              )}
            </div>
            {emailCheckStatus !== 'success' && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={emailCheckState === 'checking'}
                onClick={handleEmailCheck}
              >
                {emailCheckState === 'checking' ? '확인 중...' : '중복 확인'}
              </Button>
            )}
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
                  'rounded-200 h-8 w-full px-3 pr-10',
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
                  'rounded-200 h-8 w-full px-3 pr-10',
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
      <Button
        variant="primary"
        size="md"
        fullWidth
        disabled={isNextDisabled}
        type="submit"
        aria-disabled={isNextDisabled}
      >
        다음
      </Button>
    </AuthCard>
  );
};

export default SignupAccountCard;
