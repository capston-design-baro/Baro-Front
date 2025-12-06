import type { RagCase } from '@/apis/complaints';
import React from 'react';

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
        className="absolute top-4 right-4 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>

      {/* 헤더 영역 */}
      <header className="mb-4 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-200 bg-primary-25 text-caption-regular text-primary-600 px-3 py-1">
            사건 번호
          </span>
          <span className="text-body-2-bold text-neutral-900">{ragCase.case_no}</span>
        </div>

        {ragCase.label && <p className="text-body-3-regular text-neutral-700">{ragCase.label}</p>}

        {ragCase.similarity && (
          <p className="text-caption-regular text-neutral-500">
            내 사건과의 유사도&nbsp;
            <span className="text-primary-500 font-semibold">{ragCase.similarity}</span>
          </p>
        )}
      </header>

      {/* 내용 영역 - 스크롤 */}
      <div className="rounded-300 bg-neutral-25 mt-2 max-h-[60vh] flex-1 overflow-y-auto px-4 py-4">
        {/* 사건 개요 */}
        <section className="mb-4">
          <h3 className="text-body-3-bold mb-2 text-neutral-900">사건 개요</h3>
          <p className="text-body-4-regular whitespace-pre-line text-neutral-700">
            {ragCase.summary || '요약 정보가 없습니다.'}
          </p>
        </section>

        {/* 판결 / 결과 */}
        <section>
          <h3 className="text-body-3-bold mb-2 text-neutral-900">판결 / 결과</h3>
          <p className="text-body-4-regular whitespace-pre-line text-neutral-700">
            {ragCase.result || '판결 결과 정보가 없습니다.'}
          </p>
        </section>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className={[
            'h-10 px-4 sm:h-11 sm:px-6',
            'rounded-200 bg-neutral-0 border border-neutral-300',
            'text-detail-regular sm:text-body-4-regular text-neutral-700',
            'hover:bg-neutral-25 hover:border-neutral-500',
            'transition-colors duration-200',
          ].join(' ')}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default CaseDetailModal;
