import CharacterImg from '@/assets/BaLawCharacter-large.svg';
import React from 'react';

const WelcomeCard: React.FC = () => {
  return (
    <section
      className={[
        'flex flex-col items-center justify-between',
        'rounded-300 bg-primary-50/30',
        'px-20 py-14',
        'h-full',
        'mx-auto w-full',
      ].join(' ')}
    >
      {/* 제목 */}
      <h2 className="text-heading-1-bold text-neutral-900">Welcome to BaLaw</h2>

      {/* 캐릭터 이미지 */}
      <div className="flex flex-1 items-center justify-center">
        <img
          src={CharacterImg}
          alt="BaLaw 캐릭터"
          className="w-auto"
        />
      </div>
    </section>
  );
};

export default WelcomeCard;
