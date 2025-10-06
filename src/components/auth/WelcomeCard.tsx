import CharacterImg from '@/assets/BaLawCharacter-large.svg';
import React from 'react';

type WelcomeCardProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
};

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  title = 'Welcome to BaLaw',
  imageSrc = CharacterImg,
  imageAlt = 'BaLaw 캐릭터',
  className = '',
}) => {
  return (
    <section className={`h-full w-[600px] w-full rounded-3xl bg-blue-50 px-14 py-14 ${className}`}>
      <div className="mx-auto flex w-full max-w-[420px] flex-col items-center gap-12">
        <h2 className="text-[32px] font-semibold text-slate-900">{title}</h2>

        <div className="relative mx-auto h-64 w-64 md:h-[400px] md:w-[400px]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default WelcomeCard;
