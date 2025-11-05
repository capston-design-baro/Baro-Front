import type { Agreement } from '@/types/agreement';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AgreementItem from './AgreementItem';

type Props = {
  initial: Agreement[];
};

const SIGNUP_PATH = '/signup';

const AgreementsCard: React.FC<Props> = ({ initial }) => {
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
      className={[
        'rounded-300 border-primary-400 border',
        'px-8 py-10',
        'min-h-[60vh]',
        'flex flex-col',
      ].join(' ')}
    >
      {/* 제목 */}
      <h2 className="text-heading-1-bold text-primary-400 text-center">BaLaw 이용 약관</h2>

      {/* 약관 목록 */}
      <div className="mt-15 flex flex-1 flex-col justify-center">
        <div className="space-y-6">
          {items.map((ag) => (
            <AgreementItem
              key={ag.id}
              data={ag}
              onToggleCheck={toggleCheck}
            />
          ))}
        </div>

        <label className="text-body-3-regular mt-6 flex cursor-pointer items-center justify-end gap-2">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => toggleAll(e.target.checked)}
            className="accent-primary-400 h-4 w-4 cursor-pointer"
          />
          <span className="text-neutral-900">전체 동의</span>
        </label>
      </div>

      {/* 경고 문구 */}
      <div
        aria-live="polite"
        className="mb-4 flex min-h-[24px] justify-center"
      >
        {!requiredAllChecked && touched && (
          <p className="text-body-3-regular text-warning-200">
            모든 필수 항목에 동의해야 서비스를 이용할 수 있어요.
          </p>
        )}
      </div>

      {/* 버튼 */}
      <button
        type="submit"
        aria-disabled={!requiredAllChecked}
        className={[
          'h-12 w-full items-center justify-center px-5',
          'rounded-200 text-body-3-bold text-neutral-0 transition-colors',
          requiredAllChecked
            ? 'bg-primary-400 hover:bg-primary-600'
            : 'bg-primary-400 cursor-not-allowed opacity-60',
        ].join(' ')}
      >
        회원가입 진행하기
      </button>
    </form>
  );
};

export default AgreementsCard;
