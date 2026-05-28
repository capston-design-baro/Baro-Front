import React from 'react';

export type ChipColorScheme = 'primary' | 'warning';

export interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  label: string;
  colorScheme?: ChipColorScheme;
}

const Chip: React.FC<ChipProps> = ({ active, onClick, label, colorScheme = 'primary' }) => {
  const styles =
    colorScheme === 'warning'
      ? active
        ? 'bg-warning-200 text-white ring-warning-200'
        : 'bg-neutral-100 text-neutral-500 ring-neutral-200 hover:bg-neutral-200/60'
      : active
        ? 'bg-primary-400 text-white ring-primary-400'
        : 'bg-neutral-100 text-neutral-500 ring-neutral-200 hover:bg-neutral-200/60';

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-300 inline-flex h-8 items-center px-4',
        'text-body-3-regular transition-all duration-200',
        'ring-1 focus:outline-none',
        active ? 'font-semibold' : '',
        styles,
      ].join(' ')}
      aria-pressed={!!active}
    >
      {label}
    </button>
  );
};

export default Chip;
