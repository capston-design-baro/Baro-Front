import React, { useCallback, useState } from 'react';

import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import Button from '@/shared/ui/common/Button';
import Input from '@/shared/ui/common/Input';

import AuthCard from '@/features/auth/components/AuthCard';
import type { LoginFormValues } from '@/features/auth/types/form';
import { mapAuthError } from '@/features/auth/utils/mapAuthError';

type LoginCardProps = {
  className?: string;
  onLogin: (values: LoginFormValues) => Promise<void> | void;
};

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
    } catch (error) {
      setError(mapAuthError(error));
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
    <AuthCard className={`gap-6 ${className}`}>
      <form className="flex flex-col gap-4">
        {/* 이메일 */}
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[22px] text-neutral-400">mail</span>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            fullWidth
            textAlign="left"
            placeholder="이메일 주소"
            className="text-detail-regular"
            value={values.email}
            onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
            disabled={loading}
            onKeyDown={blockEnterInInput}
          />
        </div>

        {/* 비밀번호 */}
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[22px] text-neutral-400">lock</span>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            fullWidth
            textAlign="left"
            placeholder="비밀번호"
            className="text-detail-regular"
            value={values.password}
            onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
            disabled={loading}
            onKeyDown={blockEnterInInput}
          />
        </div>
      </form>

      {/* 에러 메시지 */}
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
      <div className="flex items-center justify-center gap-1.5">
        <p className="text-detail-regular text-neutral-400">아직 회원이 아니신가요?</p>
        <a
          href={SIGNUP_HREF}
          className="text-detail-bold text-primary-400 hover:text-primary-500"
        >
          회원가입
        </a>
      </div>
    </AuthCard>
  );
};

export default LoginCard;
