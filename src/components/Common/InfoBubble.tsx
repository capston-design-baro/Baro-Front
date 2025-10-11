import React, { useEffect, useRef, useState } from 'react';

type InfoBubbleProps = {
  title?: string;
  side?: 'right' | 'left' | 'top' | 'bottom';
  widthClass?: string;
  iconSizeClass?: string;
  iconColorClass?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
};

const sideToPlacement: Record<
  NonNullable<InfoBubbleProps['side']>,
  { panel: string; arrowWrap: string; arrowRotate: string }
> = {
  right: {
    panel: 'left-full top-1/2 -translate-y-1/2 ml-3',
    arrowWrap: 'left-0 top-1/2 -translate-x-full -translate-y-1/2',
    arrowRotate: 'rotate-90',
  },
  left: {
    panel: 'right-full top-1/2 -translate-y-1/2 mr-3',
    arrowWrap: 'right-0 top-1/2 translate-x-full -translate-y-1/2',
    arrowRotate: '-rotate-90',
  },
  top: {
    panel: 'bottom-full left-1/2 -translate-x-1/2 -mb-3',
    arrowWrap: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full',
    arrowRotate: 'rotate-180',
  },
  bottom: {
    panel: 'top-full left-1/2 -translate-x-1/2 mt-3',
    arrowWrap: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full',
    arrowRotate: 'rotate-0',
  },
};

const InfoBubble: React.FC<InfoBubbleProps> = ({
  title,
  side = 'right',
  widthClass = 'w-[360px]',
  iconSizeClass = 'text-[20px]',
  iconColorClass = 'text-gray-600',
  children,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const { panel, arrowWrap, arrowRotate } = sideToPlacement[side];

  return (
    <div
      ref={wrapRef}
      className="relative inline-flex"
    >
      <button
        type="button"
        aria-label="설명 보기"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        {trigger ?? (
          <span className={`material-symbols-outlined ${iconSizeClass} ${iconColorClass}`}>
            info
          </span>
        )}
      </button>

      {open && (
        <div
          role="tooltip"
          className={[
            'absolute z-50',
            panel,
            'rounded-2xl border border-blue-200 bg-blue-600/95 text-white shadow-xl',
            'px-4 py-3',
            widthClass,
          ].join(' ')}
        >
          <div className={`pointer-events-none absolute ${arrowWrap}`}>
            <svg
              width="18"
              height="18"
              className={`${arrowRotate}`}
            >
              <polygon
                points="0,9 18,0 18,18"
                className="fill-blue-600/95 stroke-blue-200"
              />
            </svg>
          </div>

          {title && <p className="mb-1 text-sm font-semibold text-yellow-300">{title}</p>}
          <div className="text-[13px] leading-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default InfoBubble;
