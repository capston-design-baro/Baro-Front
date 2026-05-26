import React from 'react';

interface SectionHeaderProps {
  title: string;
  description: string;
  size?: 'sm' | 'md';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, size = 'md' }) => {
  const styles = {
    md: {
      wrapper: 'mb-10 sm:mb-14',
      title: 'text-heading-2-bold sm:text-heading-1-bold',
      desc: 'text-detail-regular sm:text-body-3-regular',
    },
    sm: {
      wrapper: 'mb-6',
      title: 'text-heading-3-bold',
      desc: 'text-detail-regular',
    },
  };

  const s = styles[size];

  return (
    <header className={`text-center ${s.wrapper}`}>
      <h2 className={`${s.title} text-primary-400 mb-1.5`}>{title}</h2>
      <p className={`${s.desc} text-neutral-500`}>{description}</p>
    </header>
  );
};

export default SectionHeader;
