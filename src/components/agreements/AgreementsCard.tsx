import type { Agreement } from '@/types/agreement';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AgreementItem from './AgreementItem';

type Props = {
  initial: Agreement[];
};

const SIGNUP_PATH = '/signup';

const AgreementsForm: React.FC<Props> = ({ initial }) => {
  const [items, setItems] = useState<Agreement[]>(initial);
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();

  // 모든 필수 항목에 체크했는지 검증
  const requiredAllChecked = useMemo(
    () => items.every((a) => (a.required ? a.isChecked : true)),
    [items],
  );

  // 전체 항목이 모두 체크되었는지 계산 (선택도 포함해서 계산함) <- 전체동의 체크박스에 써야 돼서
  const allChecked = useMemo(() => items.every((a) => a.isChecked), [items]);

  // 전체 동의 토글 (모든 항목의 isChecked를 일괄 변경함)
  const toggleAll = (next: boolean) =>
    setItems((prev) => prev.map((a) => ({ ...a, isChecked: next })));

  // 단일 항목 토글
  const toggleCheck = (id: number) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, isChecked: !a.isChecked } : a)));

  // 제출을 위한 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!requiredAllChecked) return;
    navigate(SIGNUP_PATH);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[460px] rounded-3xl border border-blue-600 px-6 py-8 pt-8 pb-6 md:min-h-[680px] md:w-[460px] md:px-8"
    >
      {/* 제목 */}
      <h2 className="mb-8 text-center text-[28px] font-bold text-blue-600 md:text-[32px]">
        BaLaw 이용 약관
      </h2>

      {/* 약관 목록 */}
      <div className="space-y-4">
        {items.map((ag) => (
          <AgreementItem
            key={ag.id}
            data={ag}
            onToggleCheck={toggleCheck}
          />
        ))}
      </div>

      {/* 전체 동의 (약관이 2개 이상 있을 때에만 보이도록) */}
      {items.length > 1 && (
        <label className="mt-6 flex items-center justify-end gap-2 text-sm">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => toggleAll(e.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
          <span className="text-slate-900">전체 동의</span>
        </label>
      )}

      {/* 경고 문구 */}
      <div
        aria-live="polite"
        className="mt-3 flex min-h-[24px] justify-center"
      >
        {!requiredAllChecked && touched && (
          <p className="flex items-center gap-2 text-sm font-medium text-red-500">
            <span
              className="material-symbols-outlined text-[20px]"
              aria-hidden
            >
              cancel
            </span>
            모든 필수 항목에 동의해야 서비스를 이용할 수 있어요.
          </p>
        )}
      </div>

      {/* 진행 버튼 */}
      <button
        type="submit"
        aria-disabled={!requiredAllChecked}
        className={`mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl px-5 text-base font-medium text-white transition-colors ${requiredAllChecked ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-blue-600 opacity-60'}`}
      >
        회원가입 진행하기
      </button>
    </form>
  );
};

export default AgreementsForm;
