import React from 'react';

export type ChipColorScheme = 'primary' | 'warning';

export interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  label: string;
  colorScheme?: ChipColorScheme;
}

const Chip: React.FC<ChipProps> = ({ active, onClick, label, colorScheme = 'primary' }) => {
  const scheme =
    colorScheme === 'warning'
      ? {
          activeBg: 'bg-warning-100',
          inactiveBg: 'bg-warning-100/40',
          ring: 'ring-warning-200/50',
          text: active ? 'text-warning-200' : 'text-neutral-400',
          label: 'text-warning-200',
          focus: 'focus-visible:ring-warning-200',
          hover: 'hover:bg-warning-100/80',
        }
      : {
          activeBg: 'bg-primary-50',
          inactiveBg: 'bg-primary-50/40',
          ring: 'ring-primary-100',
          text: active ? 'text-primary-400' : 'text-neutral-400',
          label: 'text-primary-400',
          focus: 'focus-visible:ring-primary-200',
          hover: 'hover:bg-primary-100/80',
        };

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-300 inline-flex h-6 items-center gap-2 px-3',
        active ? scheme.activeBg : scheme.inactiveBg,
        'ring-1',
        scheme.ring,
        scheme.hover,
        'focus:outline-none',
        'focus-visible:ring-2',
        scheme.focus,
        'transition-colors',
      ].join(' ')}
      aria-pressed={!!active}
    >
      {/* 체크 아이콘 */}
      <span
        className={['material-symbols-outlined leading-none', scheme.text].join(' ')}
        style={{ fontSize: '16px' }}
        aria-hidden
      >
        {active ? 'check_box' : 'check_box_outline_blank'}
      </span>
      {/* 라벨 텍스트 */}
      <span className={['text-detail-regular', scheme.label].join(' ')}>{label}</span>
    </button>
  );
};

export default Chip;
