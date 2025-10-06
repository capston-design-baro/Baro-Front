import CharacterImg from '@/assets/BaLawCharacter-large.svg';
import React from 'react';

const WelcomeCard: React.FC = () => {
  return (
    <section className={`h-full w-[600px] w-full rounded-3xl bg-blue-50 px-14 py-14`}>
      <div className="mx-auto flex h-full w-full max-w-[420px] flex-col items-center justify-end gap-12">
        {/* 카드 제목 */}
        <h2 className="text-[32px] font-semibold text-slate-900">Welcome to BaLaw</h2>

        {/* 캐릭터 이미지 */}
        <div className="relative mx-auto h-64 w-64 md:h-[400px] md:w-[400px]">
          <img
            src={CharacterImg}
            alt="BaLaw 캐릭터"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default WelcomeCard;
