import React, { useEffect, useRef } from 'react';

type TooltipProps = {
  open: boolean;
  onClose: () => void;
  text: string;
  position?: 'right' | 'top' | 'bottom' | 'left';
  forced?: boolean;
};

const Tooltip: React.FC<TooltipProps> = ({
  open,
  onClose,
  text,
  position = 'right',
  forced = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  let posClass: string;

  switch (position) {
    case 'right':
      posClass = [
        'bottom-full mb-2 right-0', // 모바일
        'md:bottom-auto md:mb-0 md:left-full md:ml-2 md:top-1/2 md:-translate-y-1/2',
      ].join(' ');
      break;

    case 'left':
      posClass = [
        'bottom-full mb-2 left-0',
        'md:bottom-auto md:mb-0 md:right-full md:mr-2 md:top-1/2 md:-translate-y-1/2',
      ].join(' ');
      break;

    case 'top':
      posClass = 'bottom-full mb-2 left-1/2 -translate-x-1/2';
      break;

    case 'bottom':
      posClass = 'top-full mt-2 left-1/2 -translate-x-1/2';
      break;

    default:
      posClass = '';
  }

  const borderColor = forced ? 'border-warning-200' : 'border-primary-200';

  return (
    <div
      ref={ref}
      className={[
        'rounded-200 bg-neutral-0 absolute z-50 border px-3 py-2',
        'text-body-3-regular animate-fade-in text-neutral-800',
        'break-keep whitespace-normal',
        'w-max max-w-[240px]',
        borderColor,
        posClass,
      ].join(' ')}
    >
      {text}
    </div>
  );
};

export default Tooltip;
