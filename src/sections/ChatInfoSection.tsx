import BaroCharacter from '@/assets/BaLawCharacter-large.svg';
import IntroHeader from '@/components/IntroHeader';
import React from 'react';

const ChatInfoSection: React.FC = () => {
  return (
    <section
      className={[
        'flex flex-col items-center justify-between',
        'h-[620px] w-full max-w-[1000px]',
        'pb-6',
        'bg-neutral-0',
      ].join(' ')}
    >
      {' '}
      <IntroHeader
        title="고소장 작성하기"
        lines={[
          '사건에 대해 자세히 알려주세요.',
          '고소장을 완성하기 위해 사건 내용을 단계별로 작성해야 해요.',
          '바로가 하는 몇 가지 질문에 자세히 답변해주세요.',
        ]}
        center
        showArrow
      />
      <div className="flex flex-1 flex-col items-center justify-center">
        <img
          src={BaroCharacter}
          alt="바로 캐릭터"
          className="h-64 w-64 object-contain"
        />
      </div>
    </section>
  );
};

export default ChatInfoSection;
