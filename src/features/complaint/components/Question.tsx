import React from 'react';

import type { BinaryAnswer, PrecheckQuestion } from '@/features/complaint/types/complaint';

import Chip from '../../../shared/ui/Chip';

export interface QuestionProps {
  q: PrecheckQuestion;
  onToggleConfirm: (id: PrecheckQuestion['id']) => void;
  onSetBinary: (id: PrecheckQuestion['id'], answer: BinaryAnswer) => void;
  forceOpenInfo?: boolean;
  isLast?: boolean;
}

const Question: React.FC<QuestionProps> = ({
  q,
  onToggleConfirm,
  onSetBinary,
  forceOpenInfo,
  isLast,
}) => {
  return (
    <div
      className={[
        'flex flex-col gap-3 px-5 py-4',
        !isLast ? 'border-b border-neutral-100' : '',
      ].join(' ')}
    >
      {/* 질문 제목 */}
      <p className="text-body-3-bold md:text-body-2-bold text-neutral-800">{q.title}</p>

      {/* 설명 - 항상 표시 */}
      {q.description && (
        <p
          className={[
            'text-detail-regular md:text-body-3-regular',
            forceOpenInfo ? 'text-warning-200' : 'text-neutral-400',
          ].join(' ')}
        >
          {q.description
            .split(/(?<=\.)\s*/)
            .filter(Boolean)
            .map((sentence, i, arr) => (
              <React.Fragment key={i}>
                {sentence}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
        </p>
      )}

      {/* 응답 영역 */}
      <div className="flex items-center justify-end gap-2">
        {q.kind === 'binary' ? (
          <>
            <Chip
              active={q.answer === 'no'}
              onClick={() => onSetBinary(q.id, 'no')}
              label="아니오"
              colorScheme="primary"
            />
            <Chip
              active={q.answer === 'yes'}
              onClick={() => onSetBinary(q.id, 'yes')}
              label="예"
              colorScheme="warning"
            />
          </>
        ) : (
          <Chip
            active={!!q.confirmChip?.checked}
            onClick={() => onToggleConfirm(q.id)}
            label={q.confirmChip?.label ?? '관련 안내를 확인했습니다.'}
            colorScheme="primary"
          />
        )}
      </div>
    </div>
  );
};

export default Question;
