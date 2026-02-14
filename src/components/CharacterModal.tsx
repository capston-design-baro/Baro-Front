import LogoUrl from '@/assets/BaLawCharacter-large.svg';
import Button from '@/components/common/Button';
import React from 'react';

type Variant = 'login' | 'exit' | 'delete';

type Props = {
  variant?: Variant; // 기본: 'login'
  onCancel?: () => void; // 왼쪽 버튼 (닫기/계속 작성)
  onConfirm?: () => void; // 오른쪽 버튼 (로그인/나가기)
};

const CharacterModal: React.FC<Props> = ({ variant = 'login', onCancel, onConfirm }) => {
  const isLogin = variant === 'login';

  let title: string;
  let description: React.ReactNode;
  let leftButtonText: string;
  let rightButtonText: string;

  if (variant === 'login') {
    title = '로그인이 필요한 서비스예요.';
    description = (
      <>
        로그인 버튼을 클릭하면
        <br />
        로그인 페이지로 이동해줄게요.
      </>
    );
    leftButtonText = '다음에 할게요';
    rightButtonText = '로그인';
  } else if (variant === 'exit') {
    title = '정말 나가시겠어요?';
    description = (
      <>
        지금 나가면 작성 중인 내용은
        <br />
        다시 복구할 수 없어요.
      </>
    );
    leftButtonText = '계속 작성하기';
    rightButtonText = '나가기';
  } else {
    // delete
    title = '이 고소장을 삭제할까요?';
    description = (
      <>
        삭제한 고소장은
        <br />
        다시 복구할 수 없어요.
      </>
    );
    leftButtonText = '취소';
    rightButtonText = '삭제할게요';
  }

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

        <div className="flex w-full items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={onCancel}
          >
            {leftButtonText}
          </Button>
          <Button
            variant="error"
            size="md"
            fullWidth
            onClick={onConfirm}
          >
            {rightButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
