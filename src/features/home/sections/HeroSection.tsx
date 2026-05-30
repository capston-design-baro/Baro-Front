import '@/styles/main.css';
import { useNavigate } from 'react-router-dom';

import React from 'react';

import characterUrl from '@/assets/BaLawCharacter-large.svg';

import Button from '@/shared/ui/common/Button';

import { useUserStore } from '@/features/auth/stores/useUserStore';

interface HeroSectionProps {
  onClickStart?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onClickStart }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const handleClick = () => {
    if (onClickStart) {
      onClickStart();
    } else {
      navigate(user ? '/complaint' : '/login');
    }
  };

  return (
    <section className="relative w-full snap-start overflow-hidden bg-white">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 pt-16 pb-20 sm:flex-row sm:items-center sm:justify-between sm:pt-24 sm:pb-28">
        {/* 텍스트 영역 */}
        <div className="z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
          <p className="text-body-2-bold sm:text-body-1-bold text-primary-400 mb-3">
            AI 법률 서비스
          </p>

          <h1 className="text-main-4 sm:text-main-2 lg:text-main-1 mb-4 leading-tight text-neutral-900 sm:leading-tight lg:leading-tight">
            복잡한 법률,
            <br />
            <span className="animate-wave-fill inline-block">바로</span>가 쉽게 도와드릴게요.
          </h1>

          <p className="text-body-2-regular sm:text-body-1-regular mb-8 max-w-[400px] text-neutral-500">
            AI와 함께 직접 쓰는 고소장 초안,
            <br className="sm:hidden" /> 단계별로 쉽고 빠르게 만들어보세요.
          </p>

          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Button
              variant="primary"
              size="lg"
              className="group w-56 sm:w-64"
              onClick={handleClick}
            >
              <span className="flex items-center justify-center gap-2">
                고소장 작성 시작하기
                <span className="material-symbols-outlined !text-[20px] transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </Button>
            {user && (
              <Button
                variant="outline"
                size="lg"
                className="group w-56 sm:w-64"
                onClick={() => navigate('/complaints')}
              >
                <span className="flex items-center justify-center gap-2">
                  내 고소장 목록 보기
                  <span className="material-symbols-outlined !text-[20px] transition-transform duration-300 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* 캐릭터 영역 */}
        <div className="mt-12 flex-shrink-0 sm:mt-0">
          <img
            src={characterUrl}
            alt="BaLaw 캐릭터"
            className="h-48 w-48 object-contain opacity-90 sm:h-64 sm:w-64 lg:h-80 lg:w-80"
            draggable={false}
          />
        </div>
      </div>

      {/* 하단 곡선 디바이더 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60V20C360 0 720 0 1080 20C1260 30 1380 40 1440 60H0Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
