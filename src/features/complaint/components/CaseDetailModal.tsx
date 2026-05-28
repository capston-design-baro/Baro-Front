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
        'relative flex w-full max-w-2xl flex-col overflow-hidden',
        'rounded-2xl bg-white',
        'shadow-[0_16px_40px_rgba(15,23,42,0.2)]',
      ].join(' ')}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between border-b border-neutral-100 px-6 py-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary-400"
              style={{ fontSize: '22px' }}
            >
              gavel
            </span>
            <span className="text-body-1-bold text-neutral-900">{ragCase.case_no}</span>
          </div>
          {ragCase.label && <p className="text-body-3-regular text-neutral-500">{ragCase.label}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '20px' }}
          >
            close
          </span>
        </button>
      </div>

      {/* 본문 - 스크롤 가능 */}
      <div className="balaw-scrollbar max-h-[60vh] overflow-y-auto">
        {/* 유사도 */}
        {ragCase.similarity && (
          <div className="border-b border-neutral-100 px-6 py-4">
            <p className="text-detail-regular mb-2 text-neutral-400">유사 포인트</p>
            <p className="text-body-3-regular leading-relaxed text-neutral-700">
              {ragCase.similarity}
            </p>
          </div>
        )}

        {/* 사건 개요 */}
        <div className="border-b border-neutral-100 px-6 py-4">
          <p className="text-detail-regular mb-2 text-neutral-400">사건 개요</p>
          <p className="text-body-3-regular leading-relaxed whitespace-pre-line text-neutral-700">
            {ragCase.summary || '요약 정보가 없어요.'}
          </p>
        </div>

        {/* 판결 결과 */}
        <div className="px-6 py-4">
          <p className="text-detail-regular mb-2 text-neutral-400">판결 결과</p>
          <p className="text-body-3-regular leading-relaxed whitespace-pre-line text-neutral-700">
            {ragCase.result || '판결 결과 정보가 없어요.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailModal;
