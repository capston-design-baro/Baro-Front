import React, { useCallback, useState } from 'react';

import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import Button from '@/shared/ui/common/Button';
import Input from '@/shared/ui/common/Input';

import type { LoginCardProps, LoginFormValues } from '@/features/auth/types/auth';

const SIGNUP_HREF = '/terms';

const LoginCard: React.FC<LoginCardProps> = ({ className = '', onLogin }) => {
  const [values, setValues] = useState<LoginFormValues>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runLogin = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      await onLogin(values);
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  }, [onLogin, values]);

  const handleClickLogin = () => {
    if (loading) return;
    void runLogin();
  };

  const blockEnterInInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <section
      className={[
        'rounded-300 border-primary-400 border',
        'px-8 py-10',
        'h-full',
        'flex flex-col',
        className,
      ].join(' ')}
    >
      <h2 className="text-heading-1-bold text-primary-400 text-center">로그인</h2>

      <form className="mt-15 flex flex-1 flex-col justify-center gap-6 px-5">
        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            {/* 이메일 아이콘 */}
            <span
              className="material-symbols-outlined text-primary-600/50"
              style={{ fontSize: '24px' }}
            >
              mail
            </span>

            {/* 이메일 입력칸 */}
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              fullWidth
              textAlign="left"
              placeholder="이메일 주소"
              value={values.email}
              onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
              disabled={loading}
              onKeyDown={blockEnterInInput}
            />
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            {/* 비밀번호 아이콘 */}
            <span
              className="material-symbols-outlined text-primary-600/50"
              style={{ fontSize: '24px' }}
            >
              lock
            </span>

            {/* 비밀번호 입력칸 */}
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              fullWidth
              textAlign="left"
              placeholder="비밀번호"
              value={values.password}
              onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
              disabled={loading}
              onKeyDown={blockEnterInInput}
            />
          </div>
        </div>
      </form>

      {/* 경고 문구 */}
      <FormErrorMessage error={error} />

      {/* 로그인 버튼 */}
      <Button
        type="button"
        variant="primary"
        size="md"
        fullWidth
        disabled={loading}
        onClick={handleClickLogin}
      >
        {loading ? '로그인 중...' : '로그인'}
      </Button>

      {/* 회원가입 안내 */}
      <div className="mt-10 flex flex-col items-center gap-2">
        <p className="text-body-3-regular text-primary-400">아직 회원이 아니신가요?</p>
        <a
          href={SIGNUP_HREF}
          className="text-body-3-bold hover:text-primary-600 text-neutral-700 underline underline-offset-4"
        >
          회원가입 하러 가기
        </a>
      </div>
    </section>
  );
};

export default LoginCard;
