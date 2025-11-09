import LogoUrl from '@/assets/BaLawCharacter-large.svg';
import React from 'react';

type Variant = 'login' | 'exit';

type Props = {
  variant?: Variant; // 기본: 'login'
  onCancel?: () => void; // 왼쪽 버튼 (닫기/계속 작성)
  onConfirm?: () => void; // 오른쪽 버튼 (로그인/나가기)
};

const CharacterModal: React.FC<Props> = ({ variant = 'login', onCancel, onConfirm }) => {
  const isLogin = variant === 'login';

  const title = isLogin ? '로그인이 필요한 서비스예요.' : '정말 나가시겠어요?';

  const description = isLogin ? (
    <>
      로그인 버튼을 클릭하면
      <br />
      로그인 페이지로 이동해줄게요.
    </>
  ) : (
    <>
      지금 나가면 작성 중인 내용은
      <br />
      다시 복구할 수 없어요.
    </>
  );

  const leftButtonText = isLogin ? '다음에 할게요' : '계속 작성하기';
  const rightButtonText = isLogin ? '로그인' : '나가기';

  const rightButtonClasses = isLogin
    ? [
        'h-10 w-20 sm:h-12 sm:w-28',
        'rounded-200 bg-positive-0 hover:bg-positive-100 text-neutral-900',
        'text-detail-bold sm:text-body-3-bold',
        'transition-colors duration-200',
      ].join(' ')
    : [
        'h-10 w-20 sm:h-12 sm:w-28',
        'rounded-200 bg-warning-200 hover:bg-warning-300 text-neutral-100',
        'text-detail-regular sm:text-body-3-regular',
        'transition-colors duration-200',
      ].join(' ');

  const leftButtonClasses = isLogin
    ? [
        'h-10 w-20 sm:h-12 sm:w-28',
        'rounded-200 bg-warning-200 hover:bg-warning-300 text-neutral-100',
        'text-detail-regular sm:text-body-3-regular',
        'transition-colors duration-200',
      ].join(' ')
    : [
        'h-10 w-20 sm:h-12 sm:w-28',
        'rounded-200 bg-positive-0 hover:bg-positive-100 text-neutral-900',
        'text-detail-bold sm:text-body-3-bold',
        'transition-colors duration-200',
      ].join(' ');

  return (
    <div
      className={[
        'relative flex flex-col items-center justify-end',
        'w-full max-w-sm',
        'rounded-400 from-primary-0 to-primary-400 bg-gradient-to-b',
        'px-6 py-10 sm:px-10 sm:py-14',
      ].join(' ')}
    >
      <div className="flex flex-col items-center gap-6">
        <p
          className={[
            'text-body-1-bold sm:text-heading-4-bold',
            'text-primary-900 text-center',
          ].join(' ')}
        >
          {title}
        </p>

        <p
          className={[
            'text-detail-regular sm:text-body-3-regular md:text-body-3-regular',
            'text-center text-neutral-600',
            'pb-6',
          ].join(' ')}
        >
          {description}
        </p>

        <img
          src={LogoUrl}
          alt="서비스 캐릭터"
          className="h-52 w-52 object-contain"
        />

        <div className="flex gap-6 sm:gap-10">
          <button
            onClick={onCancel}
            className={leftButtonClasses}
          >
            {leftButtonText}
          </button>
          <button
            onClick={onConfirm}
            className={rightButtonClasses}
          >
            {rightButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
