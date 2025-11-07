import type { LoginCardProps } from '@/components/auth/LoginCard.types';
import React, { useState } from 'react';

const SIGNUP_HREF = './terms';

const LoginCard: React.FC<LoginCardProps> = ({ className = '', onLogin }) => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runLogin = async () => {
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

  // form submit용 핸들러 (Enter용)
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await runLogin();
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

      <form
        onSubmit={handleSubmit}
        className="mt-15 flex flex-1 flex-col justify-center gap-6 px-5"
      >
        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <span
              className="material-symbols-outlined text-primary-600/50"
              style={{ fontSize: '24px' }}
            >
              mail
            </span>
            <input
              id="email"
              type="email"
              placeholder="이메일 주소"
              className={[
                'rounded-200 h-10 flex-1 px-3',
                'border border-neutral-300',
                'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
              ].join(' ')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <span
              className="material-symbols-outlined text-primary-600/50"
              style={{ fontSize: '24px' }}
            >
              lock
            </span>
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              className={[
                'rounded-200 h-10 flex-1 px-3',
                'border border-neutral-300',
                'focus:border-primary-400 focus:ring-primary-0 outline-none focus:ring-2',
              ].join(' ')}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </div>
      </form>

      {/* 경고 문구 */}
      <div
        aria-live="polite"
        className="mb-4 flex min-h-[24px] justify-center"
      >
        {error && <p className="text-body-3-regular text-warning-200">{error}</p>}
      </div>

      {/* 로그인 버튼 */}
      <button
        type="button"
        disabled={loading}
        onClick={() => handleSubmit()}
        className={[
          'h-12 w-full items-center justify-center px-5',
          'rounded-200 text-body-3-bold text-neutral-0 transition-colors',
          loading
            ? 'bg-primary-400 cursor-not-allowed opacity-60'
            : 'bg-primary-400 hover:bg-primary-600',
        ].join(' ')}
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>

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
