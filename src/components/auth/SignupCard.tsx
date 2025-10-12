import { register } from '@/apis/auth';
import type { RegisterRequest } from '@/types/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupCard: React.FC = () => {
  const navigate = useNavigate();

  // 사용자 입력값 상태 관리
  const [name, setName] = useState(''); // 이름
  const [email, setEmail] = useState(''); // 이메일
  const [pw, setPw] = useState(''); // 비밀번호
  const [pwCheck, setPw2] = useState(''); // 비밀번호 확인
  const [city, setCity] = useState(''); // 주소 - 시/도 (필수)
  const [district, setDistrict] = useState(''); // 주소 - 구/군 (선택)
  const [town, setTown] = useState(''); // 주소 - 동/면/읍 (선택)

  // 전화번호 3분할
  const [p1, setP1] = useState(''); // 010
  const [p2, setP2] = useState(''); // 1234
  const [p3, setP3] = useState(''); // 5678

  // UI 상태 관리
  const [error, setError] = useState<string | null>(null); // 에러 메시지
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 회원가입 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지
    setError(null); // 에러 초기화

    // 필수값 검증
    if (!name || !email || !pw || !pwCheck || !city) {
      setError('필수 항목들을 모두 입력해주세요.');
      return;
    }

    // 비밀번호 일치 여부 확인
    if (pw !== pwCheck) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const cityTrim = city.trim();
      const districtTrim = district.trim();
      const townTrim = town.trim();

      const addressObj: RegisterRequest['address'] = {
        city: cityTrim,
        // 빈 문자열은 undefined로 보내서 서버에서 불필요한 공백 방지
        district: districtTrim || undefined,
        town: townTrim || undefined,
      };

      // 전화번호 합치기
      const phone_number = `${p1}-${p2}-${p3}`;
      // API 요청에 필요한 payload 생성
      const payload: RegisterRequest = {
        name,
        email,
        password: pw,
        address: addressObj,
        phone_number,
      };

      // API 호출
      await register(payload);

      // 회원가입 성공 → 로그인 페이지로 이동
      navigate('/login');
    } catch {
      // 에러 처리
      setError('회원가입 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      // 로딩 해제
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[460px] rounded-3xl border border-blue-600 px-6 py-8 pt-8 pb-6 md:min-h-[680px] md:w-[460px] md:px-8"
    >
      {/* 제목 */}
      <h2 className="mb-8 text-center text-[28px] font-bold text-blue-600 md:text-[32px]">
        회원가입
      </h2>

      {/* 회원가입 폼 */}
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col gap-4">
        {/* 이름 */}
        <div className="mx-4 flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-slate-900"
          >
            이름 (필수)
          </label>
          <input
            id="name"
            type="text"
            className="h-9 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        {/* 이메일 */}
        <div className="mx-4 flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-900"
          >
            이메일 (필수)
          </label>
          <input
            id="email"
            type="email"
            className="h-9 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        {/* 비밀번호 */}
        <div className="mx-4 flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-900"
          >
            비밀번호 (필수)
          </label>
          <input
            id="password"
            type="password"
            className="h-9 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="mx-4 flex flex-col gap-2">
          <label
            htmlFor="password2"
            className="text-sm font-medium text-slate-900"
          >
            비밀번호 확인 (필수)
          </label>
          <input
            id="password2"
            type="password"
            className="h-9 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={pwCheck}
            onChange={(e) => setPw2(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        {/* 주소: 시/도, 시/군/구, 동/면/읍*/}
        <div className="mx-4 grid grid-cols-3 gap-2">
          {/* 시/도 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="city"
              className="text-sm font-medium text-slate-900"
            >
              시/도 (필수)
            </label>
            <input
              id="city"
              type="text"
              className="h-9 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* 시/군/구 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="district"
              className="text-sm font-medium text-slate-900"
            >
              시/군/구 (선택)
            </label>
            <input
              id="district"
              type="text"
              className="h-9 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>

          {/* 동/면/읍 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="town"
              className="text-sm font-medium text-slate-900"
            >
              동/면/읍 (선택)
            </label>
            <input
              id="town"
              type="text"
              className="h-9 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={town}
              onChange={(e) => setTown(e.target.value)}
            />
          </div>
        </div>

        {/* 전화번호: 3분할 */}
        <div className="mx-4 flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-900">전화번호 (필수)</label>
          <div className="flex items-center gap-2">
            <input
              value={p1}
              onChange={(e) => setP1(e.target.value.replace(/\D/g, '').slice(0, 3))}
              className="h-9 w-[86px] rounded-lg border border-gray-300 px-3 text-center outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="010"
              inputMode="numeric"
            />
            <span className="text-gray-500">-</span>
            <input
              value={p2}
              onChange={(e) => setP2(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="h-9 w-[100px] rounded-lg border border-gray-300 px-3 text-center outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="1234"
              inputMode="numeric"
            />
            <span className="text-gray-500">-</span>
            <input
              value={p3}
              onChange={(e) => setP3(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="h-9 w-[100px] rounded-lg border border-gray-300 px-3 text-center outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="5678"
              inputMode="numeric"
            />
          </div>
        </div>

        {/* 경고 문구 */}
        <div
          aria-live="polite"
          className="mt-3 flex min-h-[24px] justify-center"
        >
          {error && (
            <p className="flex items-center gap-2 text-sm font-medium text-red-500">
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden
              >
                cancel
              </span>
              {error}
            </p>
          )}
        </div>

        {/* 제출 */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-base font-medium text-white transition-colors hover:bg-blue-700"
        >
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </div>
    </form>
  );
};

export default SignupCard;
