import React from 'react';

interface SectionHeaderProps {
  title: string;
  description: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => (
  <header className="mb-10 text-center sm:mb-14">
    <h2 className="text-heading-2-bold sm:text-heading-1-bold text-primary-400 mb-3">{title}</h2>
    <p className="text-detail-regular sm:text-body-3-regular text-neutral-500">{description}</p>
  </header>
);

export default SectionHeader;
