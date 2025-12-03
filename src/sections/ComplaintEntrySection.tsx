import IntroHeader from '@/components/IntroHeader';
import React from 'react';

type ComplaintEntrySectionProps = {
  /** 새 고소장 처음부터 작성 */
  onNew: () => void;
  /** 임시 저장된 고소장 이어쓰기 */
  onResumeDrafts: () => void;
};

const ComplaintEntrySection: React.FC<ComplaintEntrySectionProps> = ({ onResumeDrafts }) => {
  return (
    <section
      className={[
        'flex flex-col items-center justify-between',
        'h-[680px] w-full max-w-[1000px]',
        'pb-6',
        'bg-neutral-0',
      ].join(' ')}
    >
      <IntroHeader
        title="고소장 작성하기"
        lines={[
          '고소장 작성을 시작할 방법을 선택해주세요.',
          '새로 작성하거나 임시 저장한 고소장을 이어 작성할 수 있어요.',
        ]}
        center
        showArrow
      />

      {/* 카드 2개 가로 배치 */}
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 px-4 md:flex-row">
        {/* ─────────────────────
            새 고소장 작성하기 카드
        ───────────────────── */}
        <button
          type="button"
          onClick={onResumeDrafts}
          className={[
            'group flex flex-col items-center justify-center',
            'h-[200px] w-[260px]',
            'rounded-300 p-6',
            // ghost (neutral tone)
            'to-neutral-0/10 bg-radial from-neutral-200/40 via-neutral-100/10',
            'border border-white/50',
            'shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)]',
            'backdrop-blur-md',
            'transition-all duration-300 ease-out',
            'hover:ring-primary-50/40 hover:border-white/70 hover:ring-2',
          ].join(' ')}
        >
          {/* 아이콘 */}
          <span
            className={[
              'material-symbols-outlined',
              'text-[60px] text-neutral-600',
              'group-hover:text-primary-400 transition-colors',
            ].join(' ')}
            style={{ fontSize: '60px' }}
          >
            note_add
          </span>

          {/* 제목 */}
          <p
            className={[
              'text-body-2-bold mt-4',
              'text-neutral-900',
              'group-hover:text-primary-400 transition-colors',
            ].join(' ')}
          >
            새 고소장 작성하기
          </p>
        </button>

        {/* ─────────────────────
            이어 작성하기 카드
        ───────────────────── */}
        <button
          type="button"
          onClick={onResumeDrafts}
          className={[
            'group flex flex-col items-center justify-center',
            'h-[200px] w-[260px]',
            'rounded-300 p-6',
            // ghost (neutral tone)
            'to-neutral-0/10 bg-radial from-neutral-200/40 via-neutral-100/10',
            'border border-white/50',
            'shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)]',
            'backdrop-blur-md',
            'transition-all duration-300 ease-out',
            'hover:ring-primary-50/40 hover:border-white/70 hover:ring-2',
          ].join(' ')}
        >
          {/* 아이콘 */}
          <span
            className={[
              'material-symbols-outlined',
              'text-[60px] text-neutral-600',
              'group-hover:text-primary-400 transition-colors',
            ].join(' ')}
            style={{ fontSize: '60px' }}
          >
            history
          </span>

          <p
            className={[
              'text-body-2-bold mt-4',
              'text-neutral-900',
              'group-hover:text-primary-400 transition-colors',
            ].join(' ')}
          >
            이어 작성하기
          </p>
        </button>
      </div>
    </section>
  );
};

export default ComplaintEntrySection;
