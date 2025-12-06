import BaLawCharacterLarge from '@/assets/BaLawCharacter-large.svg';
import React from 'react';

type GeneratingModalProps = {
  open: boolean;
  title?: string;
  description?: string;
};

const GeneratingModal: React.FC<GeneratingModalProps> = ({ open, title, description }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="고소장 생성 중"
    >
      <div
        className={[
          'relative flex w-full max-w-sm flex-col items-center',
          'rounded-400 from-primary-0 to-primary-400 bg-gradient-to-b',
          'px-6 py-10 sm:px-10 sm:py-14',
          'shadow-lg',
        ].join(' ')}
      >
        {/* 텍스트 영역 */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-body-1-bold sm:text-heading-4-bold text-primary-900">
            {title ?? 'AI가 고소장을 작성하고 있어요.'}
          </p>
          <p className="text-detail-regular sm:text-body-3-regular text-neutral-600">
            {description ?? (
              <>
                입력해 주신 내용을 바탕으로
                <br />
                고소장 초안을 정리하는 중입니다.
              </>
            )}
          </p>
        </div>

        {/* 로딩 인디케이터 + 캐릭터 */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="border-primary-200 border-t-primary-100 h-8 w-8 animate-spin rounded-full border-4" />
          {/* 캐릭터 이미지 */}
          <img
            src={BaLawCharacterLarge}
            alt="바로 캐릭터"
            className="h-52 w-52 object-contain"
          />
          <p className="text-detail-regular text-neutral-200">잠시만 기다려 주세요...</p>
        </div>
      </div>
    </div>
  );
};

export default GeneratingModal;
