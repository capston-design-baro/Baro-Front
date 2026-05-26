import { useNavigate } from 'react-router-dom';

import React, { useMemo, useState } from 'react';

import FormErrorMessage from '@/shared/ui/FormErrorMessage';
import Button from '@/shared/ui/common/Button';

import AuthCard from '@/features/auth/components/AuthCard';
import type { Agreement } from '@/features/auth/types/model';

import AgreementItem from './AgreementItem';

type Props = {
  initial: Agreement[];
};

const SIGNUP_PATH = '/signup';

const AgreementsCard: React.FC<Props> = ({ initial }) => {
  const [items, setItems] = useState<Agreement[]>(initial);
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();

  const requiredAllChecked = useMemo(
    () => items.every((a) => (a.required ? a.isChecked : true)),
    [items],
  );

  const allChecked = useMemo(() => items.every((a) => a.isChecked), [items]);

  const toggleAll = (next: boolean) =>
    setItems((prev) => prev.map((a) => ({ ...a, isChecked: next })));

  const toggleCheck = (id: number) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, isChecked: !a.isChecked } : a)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!requiredAllChecked) return;
    navigate(SIGNUP_PATH);
  };

  return (
    <AuthCard as="form" onSubmit={handleSubmit} className="gap-5">
      {/* 전체 동의 */}
      <button
        type="button"
        onClick={() => toggleAll(!allChecked)}
        className="flex items-center gap-2.5 rounded-300 bg-neutral-50 px-4 py-3"
      >
        <span
          className={[
            'material-symbols-outlined !text-[22px] transition-colors duration-200',
            allChecked ? 'text-primary-400' : 'text-neutral-300',
          ].join(' ')}
        >
          {allChecked ? 'check_circle' : 'radio_button_unchecked'}
        </span>
        <span className="text-body-3-bold text-neutral-900">전체 동의</span>
      </button>

      {/* 약관 목록 */}
      <div className="flex flex-col divide-y divide-neutral-100 px-4">
        {items.map((ag) => (
          <AgreementItem
            key={ag.id}
            data={ag}
            onToggleCheck={toggleCheck}
          />
        ))}
      </div>

      {/* 경고 문구 */}
      {!requiredAllChecked && touched && (
        <FormErrorMessage error="모든 필수 항목에 동의해야 서비스를 이용할 수 있어요." />
      )}

      {/* 버튼 */}
      <Button
        variant="primary"
        size="md"
        fullWidth
        type="submit"
        disabled={!requiredAllChecked}
      >
        회원가입 진행하기
      </Button>
    </AuthCard>
  );
};

export default AgreementsCard;
