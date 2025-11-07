import Tooltip from '@/components/Tooltip';
import type { BinaryAnswer, PrecheckQuestion } from '@/types/complaint';
import React, { useState } from 'react';

import Chip from './Chip';

export interface QuestionProps {
  q: PrecheckQuestion;
  onToggleConfirm: (id: PrecheckQuestion['id']) => void;
  onSetBinary: (id: PrecheckQuestion['id'], answer: BinaryAnswer) => void;
}

const Question: React.FC<QuestionProps> = ({ q, onToggleConfirm, onSetBinary }) => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo((prev) => !prev);
  const closeInfo = () => setShowInfo(false);

  const iconColor = showInfo ? 'text-primary-400' : 'text-neutral-400 hover:text-primary-400';

  return (
    <div className="flex w-[420px] flex-col gap-1 px-3">
      <div className="flex w-[400px] items-center justify-between gap-2">
        <p className="text-body-2-regular leading-tight font-medium text-black">{q.title}</p>
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            className={['transition-colors focus:outline-none', iconColor].join(' ')}
            onClick={toggleInfo}
          >
            <span
              className="material-symbols-outlined leading-none"
              style={{ fontSize: '20px' }}
            >
              info
            </span>
          </button>

          {q.description && (
            <Tooltip
              open={showInfo}
              onClose={closeInfo}
              text={q.description}
              position="right"
            />
          )}
        </div>
      </div>

      <div className="flex h-12 w-[400px] items-center justify-end gap-3">
        {q.kind === 'binary' ? (
          <>
            {/* 예 = 붉은색 */}
            <Chip
              active={q.answer === 'yes'}
              onClick={() => onSetBinary(q.id, 'yes')}
              label="예"
              colorScheme="warning"
            />
            {/* 아니오 = 파란색 */}
            <Chip
              active={q.answer === 'no'}
              onClick={() => onSetBinary(q.id, 'no')}
              label="아니오"
              colorScheme="primary"
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
