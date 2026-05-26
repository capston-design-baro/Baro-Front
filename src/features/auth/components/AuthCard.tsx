import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  as?: 'div' | 'form';
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, as = 'div', onSubmit, className = '' }) => {
  const Tag = as;

  return (
    <Tag
      onSubmit={onSubmit}
      className={[
        'w-full rounded-[16px]',
        'bg-gradient-to-b from-primary-0/40 via-white to-white',
        'border border-neutral-100',
        'shadow-[0_4px_24px_rgba(0,0,0,0.06)]',
        'px-8 py-8',
        'flex flex-col',
        className,
      ].join(' ')}
    >
      {children}
    </Tag>
  );
};

export default AuthCard;
