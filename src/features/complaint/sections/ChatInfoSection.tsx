import React from 'react';

import characterUrl from '@/assets/BaLawCharacter-large.svg';

const ChatInfoSection: React.FC = () => {
  return (
    <section
      className={['flex flex-col items-center', 'w-full flex-1', 'pb-6', 'bg-neutral-0'].join(' ')}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {/* 말풍선 - 캐릭터 위에 표시 */}
        <div className="animate-bubble-up relative max-w-[480px]">
          {/* 말풍선 본체 */}
          <div className="rounded-300 border-primary-100 bg-primary-0/40 border px-6 py-4 md:px-8 md:py-5">
            <div className="flex flex-col gap-1 text-center">
              <p className="text-body-2-bold md:text-body-1-bold text-neutral-800">
                준비가 다 됐나요?
              </p>
              <p className="text-body-3-regular md:text-body-2-regular text-neutral-500">
                바로와 채팅을 시작하면 이전으로 돌아갈 수 없어요.
                <br />
                나와 상대방의 정보를 확실하게 작성했다면,
                <br />
                다음으로 넘어가주세요.
              </p>
            </div>
          </div>
          {/* 말풍선 꼬리 (아래쪽) */}
          <svg
            className="mx-auto block"
            width="16"
            height="8"
            viewBox="0 0 16 8"
            fill="none"
          >
            <path
              d="M0 0 L8 8 L16 0"
              className="fill-primary-0/40 stroke-primary-100"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="0"
              x2="16"
              y2="0"
              className="stroke-primary-0/40"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* 바로 캐릭터 - 뿅 등장 */}
        <img
          src={characterUrl}
          alt="바로 캐릭터"
          className="animate-pop-in h-40 w-40 md:h-52 md:w-52 lg:h-60 lg:w-60"
          draggable={false}
        />
      </div>
    </section>
  );
};

export default ChatInfoSection;
