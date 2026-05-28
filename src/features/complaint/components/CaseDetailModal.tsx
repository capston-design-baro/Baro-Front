import React from 'react';

import type { RagCase } from '@/features/complaint/apis/complaints';

type Props = {
  ragCase: RagCase;
  onClose?: () => void;
};

const CaseDetailModal: React.FC<Props> = ({ ragCase, onClose }) => {
  return (
    <div
      className={[
        'relative flex flex-col',
        'w-full max-w-2xl', // 🔹 CharacterModal보다 살짝 넓게
        'rounded-400 bg-neutral-0',
        'px-6 py-8 sm:px-10 sm:py-10',
        'shadow-[0_16px_40px_rgba(15,23,42,0.25)]',
      ].join(' ')}
    >
      {/* 닫기 버튼 (우상단 X) */}
      <button
        type="button"
        onClick={onClose}
        className="hover:text-warning-300 absolute top-4 right-4 text-neutral-400"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>

      {/* 헤더 영역 */}
      <header className="mb-4 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-200 bg-primary-0 text-body-2-regular text-primary-600 px-3 py-1">
            사건 번호
          </span>
          <span className="text-body-2-bold text-neutral-900">{ragCase.case_no}</span>
        </div>

        {ragCase.label && (
          <p className="text-body-3-regular pb-6 text-neutral-700">{ragCase.label}</p>
        )}

        {ragCase.similarity && (
          <div className="flex flex-wrap items-center gap-2 pb-6">
            <span className="rounded-200 bg-primary-0 text-body-2-regular text-primary-600 px-3 py-1">
              내 사건과의 유사도
            </span>
            <span className="text-body-4-regular whitespace-pre-line text-neutral-700">
              {ragCase.similarity}
            </span>
          </div>
        )}

        {/* 사건 개요 */}
        <div className="pb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-200 bg-primary-0 text-body-2-regular text-primary-600 px-3 py-1">
              사건 개요
            </span>
          </div>
          <p className="text-body-4-regular whitespace-pre-line text-neutral-700">
            {ragCase.summary || '요약 정보가 없습니다.'}
          </p>
        </div>

        {/* 판결 결과 */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-200 bg-primary-0 text-body-2-regular text-primary-600 px-3 py-1">
              판결 결과
            </span>
          </div>
          <p className="text-body-4-regular whitespace-pre-line text-neutral-700">
            {ragCase.result || '판결 결과 정보가 없습니다.'}
          </p>
        </div>
      </header>
    </div>
  );
};

export default CaseDetailModal;
