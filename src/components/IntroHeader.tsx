import React, { useMemo } from 'react';

const IntroHeader: React.FC<{
  title: string;
  lines?: string[];
  center?: boolean;
  className?: string;
  showArrow?: boolean;
}> = ({ title, lines = [], center = true, className = '', showArrow = true }) => {
  const align = center ? 'items-center text-center' : 'items-start text-left';

  const renderedLines = useMemo(
    () =>
      lines.map((text, idx) => (
        <p
          key={text}
          className={
            idx === 0
              ? 'text-body-1-regular text-neutral-900'
              : 'text-body-3-regular text-neutral-500'
          }
        >
          {text}
        </p>
      )),
    [lines],
  );

  return (
    <div className={`flex w-full flex-col justify-start gap-2 ${align} ${className}`}>
      <h2 className="text-heading-1-bold text-primary-400 w-full max-w-[500px]">{title}</h2>

      {lines.length > 0 && <div className="flex flex-col gap-2">{renderedLines}</div>}

      {showArrow && (
        <div
          className="flex items-center justify-center"
          aria-hidden="true"
          style={{ width: 24, height: 24 }}
        >
          <span
            className="material-symbols-outlined bg-clip-text leading-none text-transparent"
            style={{
              fontSize: 24,
              opacity: 0.5,
              backgroundImage:
                'linear-gradient(to bottom, var(--color-neutral-700), var(--color-primary-400))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            arrow_cool_down
          </span>
        </div>
      )}
    </div>
  );
};

export default IntroHeader;
