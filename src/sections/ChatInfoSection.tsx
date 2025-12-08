import BaroCharacter from '@/assets/BaLawCharacter-large.svg';
import IntroHeader from '@/components/IntroHeader';
import React from 'react';

const ChatInfoSection: React.FC = () => {
  return (
    <section
      className={[
        'flex flex-col items-center justify-between',
        'h-[600px] w-full max-w-[1000px]',
        'pb-6',
        'bg-neutral-0',
      ].join(' ')}
    >
      <IntroHeader
        title="고소장 작성하기"
        lines={[
          '기본 정보들은 확실히 작성 하셨나요?',
          '바로와 채팅을 시작하면 이전으로 돌아갈 수 없어요.',
          '나와 상대방의 정보를 확실하게 작성했다면, 다음으로 넘어가주세요.',
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
