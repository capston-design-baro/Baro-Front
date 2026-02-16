import React, { forwardRef } from 'react';

type TextAlign = 'left' | 'center' | 'right';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  error?: boolean;
  textAlign?: TextAlign;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className = '', fullWidth = false, error = false, textAlign = 'left', disabled, ...props },
    ref,
  ) => {
    // 공통 스타일
    const baseStyles = [
      'h-12 px-3',
      'rounded-200',
      'text-body-3-regular',
      'bg-neutral-0',
      'border',
      'outline-none',
      'transition-colors duration-200 ease-in-out',
      'placeholder:text-neutral-400',
      'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
    ].join(' ');

    // 상태 스타일 (error)
    const stateStyles = error
      ? 'border-warning-200 focus:border-warning-300'
      : 'border-neutral-300 focus:border-primary-400';

    // 텍스트 정렬 (left, center, right)
    const alignmentStyles = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };

    // 너비 설정
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <input
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${stateStyles} ${alignmentStyles[textAlign]} ${widthStyle} ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
