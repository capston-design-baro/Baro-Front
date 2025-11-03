import LogoUrl from '@/assets/BaLawCharacter-large.svg';
import React from 'react';

type Props = {
  onCancel?: () => void;
  onLogin?: () => void;
};

const LoginPrompt: React.FC<Props> = ({ onCancel, onLogin }) => {
  return (
    <div className="relative flex w-full max-w-md flex-col items-center justify-end rounded-2xl bg-gradient-to-b from-blue-50 to-blue-600 px-6 py-10 sm:max-w-lg sm:px-10 sm:py-14 md:h-[680px] md:max-w-xl">
      {/* 텍스트 */}
      <div className="flex flex-col items-center gap-6 md:gap-[60px]">
        <p className="text-center font-medium text-black sm:text-base md:text-lg">
          로그인이 필요한 서비스예요.
        </p>
        <p className="text-center text-xs text-[3vw] font-medium whitespace-nowrap text-gray-700 sm:text-sm md:text-base">
          로그인 버튼을 클릭하면 로그인 페이지로 이동해줄게요.
        </p>
        <img
          src={LogoUrl}
          alt="서비스 캐릭터"
          className="h-64 w-64 object-contain sm:h-40 sm:w-40 md:h-52 md:w-52"
        />
        <div className="flex gap-6 sm:gap-9">
          <button
            onClick={onCancel}
            className="h-10 w-24 rounded-2xl bg-red-500 text-sm font-medium text-white sm:h-12 sm:w-28 sm:text-base"
          >
            안할래요
          </button>
          <button
            onClick={onLogin}
            className="h-10 w-24 rounded-2xl bg-blue-50 text-sm font-medium text-slate-900 sm:h-12 sm:w-28 sm:text-base"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
