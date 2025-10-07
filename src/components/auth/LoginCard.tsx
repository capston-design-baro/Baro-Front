import type { LoginCardProps } from '@/components/auth/LoginCard.types';
import React, { useState } from 'react';

const SIGNUP_HREF = './terms';

const LoginCard: React.FC<LoginCardProps> = ({ className = '', onLogin }) => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (onLogin) {
        await onLogin(email, pw);
      } else {
        // 기본 동작 (API 연결 전 임시): 실패 예시
        throw new Error('NO_API');
      }
    } catch {
      setError('이메일 주소나 비밀번호를 다시 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`flex h-full w-full flex-col rounded-3xl border border-blue-600 px-6 py-10 md:min-h-[680px] md:w-[460px] md:px-8 md:py-14 ${className}`}
    >
      <h2 className="mb-0 shrink-0 text-center text-2xl font-bold text-blue-600 md:text-[32px]">
        로그인
      </h2>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-auto flex w-full max-w-[420px] flex-col gap-6"
      >
        {/* 에러 자리 항상 확보 (레이아웃 점프 방지) */}
        <div
          aria-live="polite"
          className="min-h-[44px]"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2">
              <span
                className="material-symbols-outlined text-[20px] leading-none text-red-600"
                aria-hidden
              >
                cancel
              </span>
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}
        </div>
        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="sr-only"
          >
            이메일
          </label>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-900">mail</span>
            <input
              id="email"
              type="email"
              placeholder="이메일 주소"
              className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="sr-only"
          >
            비밀번호
          </label>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-900">lock</span>
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className="mx-auto mt-6 block h-12 w-45 items-center justify-center rounded-2xl bg-blue-600 px-5 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        {/* 회원가입 안내 */}

        <div className="mt-18 flex flex-col items-center gap-2">
          <p className="text-base font-medium text-blue-600">아직 회원이 아니신가요?</p>
          <a
            href={SIGNUP_HREF}
            className="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-gray-900"
          >
            여기를 클릭해서 회원가입하세요.
          </a>
        </div>
      </form>
    </section>
  );
};

export default LoginCard;
