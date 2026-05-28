import React from 'react';

import BaLawCharacterLarge from '@/assets/BaLawCharacter-large.svg';

type GeneratingModalProps = {
  open: boolean;
};

const GeneratingModal: React.FC<GeneratingModalProps> = ({ open }) => {
  if (!open) return null;

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="고소장 생성 중"
    >
      <div
        className={[
          'animate-pop-in relative flex w-full max-w-sm flex-col items-center',
          'rounded-2xl bg-white',
          'px-8 py-10',
          'shadow-[0_16px_40px_rgba(15,23,42,0.2)]',
        ].join(' ')}
      >
        {/* 캐릭터 */}
        <img
          src={BaLawCharacterLarge}
          alt="바로 캐릭터"
          className="animate-float mb-6 h-32 w-32"
          draggable={false}
        />

        {/* 타이핑 애니메이션 텍스트 */}
        <div className="flex flex-col items-center gap-3">
          <p className="animate-typing text-body-2-bold text-neutral-800">
            바로가 고소장을 작성하고 있어요
          </p>
          <p className="animate-typing-delay-1 text-body-3-regular text-neutral-500">
            입력해 주신 내용을 바탕으로 초안을 정리 중이에요
          </p>
          <p className="animate-typing-delay-2 text-detail-regular text-neutral-400">
            조금만 기다려 주세요, 거의 다 됐어요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneratingModal;
