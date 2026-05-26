import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'error' | 'outline' | 'outline-secondary';
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
  const baseStyles = [
    'inline-flex items-center justify-center',
    'transition-all duration-200 ease-out',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'whitespace-nowrap',
    'font-medium',
  ].join(' ');

  const variantStyles = {
    primary: [
      'bg-primary-400 text-neutral-0',
      'hover:bg-primary-500 hover:shadow-[0_2px_8px_rgba(37,99,235,0.25)]',
      'active:bg-primary-600 active:shadow-none',
    ].join(' '),
    error: [
      'bg-warning-200 text-neutral-0',
      'hover:bg-warning-300 hover:shadow-[0_2px_8px_rgba(239,68,68,0.25)]',
      'active:bg-red-700 active:shadow-none',
    ].join(' '),
    secondary: [
      'bg-neutral-100 text-neutral-700',
      'hover:bg-neutral-200',
      'active:bg-neutral-300',
    ].join(' '),
    outline: [
      'border border-neutral-200 text-neutral-700 bg-white',
      'hover:bg-neutral-50 hover:border-neutral-300',
      'active:bg-neutral-100',
    ].join(' '),
    'outline-secondary': [
      'border border-neutral-200 text-neutral-500',
      'hover:bg-neutral-50 hover:text-neutral-700',
      'active:bg-neutral-100',
    ].join(' '),
  };

  const sizeStyles = {
    sm: 'h-8 px-3 text-detail-regular rounded-300',
    md: 'h-10 px-4 text-body-3-regular rounded-300',
    lg: 'h-14 px-5 text-body-2-regular rounded-300',
  };

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
