import LogoUrl from '@/assets/BaLawCharacter-large.svg';
import React from 'react';

type Props = {
  onCancel?: () => void;
  onLogin?: () => void;
};

const LoginPrompt: React.FC<Props> = ({ onCancel, onLogin }) => {
  return (
    <div className="rounded-400 from-primary-0 to-primary-400 relative flex w-full max-w-md flex-col items-center justify-end bg-gradient-to-b px-6 py-10 sm:max-w-lg sm:px-10 sm:py-14 md:h-[680px] md:max-w-xl">
      {/* 텍스트 */}
      <div className="flex flex-col items-center gap-6 md:gap-10">
        <p className="sm:text-heading-3 text-body-2-regular text-primary-1000 text-center">
          로그인이 필요한 서비스예요.
        </p>
        <p className="text-detail-regular sm:text-body-3-regular md:text-body-2-regular pb-5 text-center whitespace-nowrap text-neutral-600 sm:pb-10">
          로그인 버튼을 클릭하면 로그인 페이지로 이동해줄게요.
        </p>
        <img
          src={LogoUrl}
          alt="서비스 캐릭터"
          className="h-52 w-52 object-contain"
        />
        <div className="flex gap-6 sm:gap-15">
          <button
            onClick={onCancel}
            className="rounded-200 bg-warning-200 text-neutral-0 h-10 w-24 text-sm font-medium sm:h-12 sm:w-28 sm:text-base"
          >
            안할래요
          </button>
          <button
            onClick={onLogin}
            className="rounded-200 bg-positive-0 h-10 w-24 text-sm font-medium text-neutral-900 sm:h-12 sm:w-28 sm:text-base"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
