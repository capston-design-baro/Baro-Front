import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'error';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  // 공통 스타일
  const baseStyles = [
    'inline-flex items-center justify-center',
    'transition-colors duration-200 ease-in-out',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'whitespace-nowrap',
  ].join(' ');

  // 색상 (primary, error, secondary)
  const variantStyles = {
    primary: [
      'bg-primary-400 text-neutral-0',
      'hover:bg-primary-500',
      'active:bg-primary-600',
    ].join(' '),
    error: ['bg-warning-200 text-neutral-0', 'hover:bg-warning-300', 'active:bg-red-700'].join(' '),
    secondary: [
      'bg-neutral-200 text-neutral-700',
      'hover:bg-neutral-300',
      'active:bg-neutral-350',
    ].join(' '),
  };

  // 크기 변형 (높이, 패딩, 폰트, radius)
  const sizeStyles = {
    sm: 'h-8 px-2 text-detail-regular rounded-200', // 채팅 전송 버튼 등 작은 곳
    md: 'h-12 px-3 text-body-3-regular rounded-200', // 일반적인 폼 버튼
    lg: 'h-16 px-4 text-body-3-regular rounded-200', // 다운로드 버튼 등 큰 CTA
  };

  // 너비 설정
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
