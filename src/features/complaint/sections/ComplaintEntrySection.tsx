import React from 'react';

import IntroHeader from '@/shared/ui/IntroHeader';

type ComplaintEntrySectionProps = {
  /** 새 고소장 처음부터 작성 */
  onNew: () => void;
  /** 임시 저장된 고소장 이어쓰기 */
  onResumeDrafts: () => void;
  /** 현재 선택된 모드 ('new' | 'resume' | null) */
  activeMode: 'new' | 'resume' | null;
};

const ComplaintEntrySection: React.FC<ComplaintEntrySectionProps> = ({
  onNew,
  onResumeDrafts,
  activeMode,
}) => {
  const isNewActive = activeMode === 'new';
  const isResumeActive = activeMode === 'resume';

  return (
    <section
      className={['flex flex-col items-center', 'w-full flex-1', 'pb-6', 'bg-neutral-0'].join(' ')}
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

      {/* 카드 2개 */}
      <div className="mx-auto grid w-full max-w-[520px] flex-1 grid-cols-1 place-content-center justify-center gap-4 px-4 md:grid-cols-2 md:gap-6">
        {/* 새 고소장 작성하기 */}
        <button
          type="button"
          onClick={onNew}
          className={[
            'group relative flex w-full flex-col items-center justify-center gap-4',
            'rounded-300 px-6 py-10',
            'border-2 bg-white',
            'transition-all duration-200 ease-out',
            isNewActive
              ? 'border-primary-400 bg-primary-0/30 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
              : 'hover:border-primary-300 border-neutral-200 hover:shadow-md',
          ].join(' ')}
        >
          {/* 아이콘 배경 원 */}
          <div
            className={[
              'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
              isNewActive ? 'bg-primary-400' : 'group-hover:bg-primary-100 bg-neutral-100',
            ].join(' ')}
          >
            <span
              className={[
                'material-symbols-outlined transition-colors',
                isNewActive ? 'text-white' : 'group-hover:text-primary-400 text-neutral-500',
              ].join(' ')}
              style={{ fontSize: '28px' }}
            >
              edit_note
            </span>
          </div>

          {/* 텍스트 */}
          <div className="flex flex-col items-center gap-1">
            <p
              className={[
                'text-body-2-bold transition-colors',
                isNewActive ? 'text-primary-500' : 'text-neutral-800',
              ].join(' ')}
            >
              새 고소장 작성하기
            </p>
            <p className="text-detail-regular text-neutral-400">처음부터 새로 작성해요</p>
          </div>

          {/* 선택 체크 */}
        </button>

        {/* 이어 작성하기 */}
        <button
          type="button"
          onClick={onResumeDrafts}
          className={[
            'group relative flex w-full flex-col items-center justify-center gap-4',
            'rounded-300 px-6 py-10',
            'border-2 bg-white',
            'transition-all duration-200 ease-out',
            isResumeActive
              ? 'border-primary-400 bg-primary-0/30 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
              : 'hover:border-primary-300 border-neutral-200 hover:shadow-md',
          ].join(' ')}
        >
          <div
            className={[
              'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
              isResumeActive ? 'bg-primary-400' : 'group-hover:bg-primary-100 bg-neutral-100',
            ].join(' ')}
          >
            <span
              className={[
                'material-symbols-outlined transition-colors',
                isResumeActive ? 'text-white' : 'group-hover:text-primary-400 text-neutral-500',
              ].join(' ')}
              style={{ fontSize: '28px' }}
            >
              draft
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <p
              className={[
                'text-body-2-bold transition-colors',
                isResumeActive ? 'text-primary-500' : 'text-neutral-800',
              ].join(' ')}
            >
              이어 작성하기
            </p>
            <p className="text-detail-regular text-neutral-400">
              임시 저장한 고소장을
              <br />
              이어서 작성해요
            </p>
          </div>
        </button>
      </div>
    </section>
  );
};

export default ComplaintEntrySection;
