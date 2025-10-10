import React from 'react';

type Props = {
  /** 메인 타이틀 */
  title: string;
  /** 서브텍스트 라인들 (줄바꿈 대신 배열로) */
  lines?: string[];
  /** 가운데 정렬 여부 (기본: true) */
  center?: boolean;
  /** 화살표 노출 (기본: true) */
  showArrow?: boolean;
  /** 화살표 크기(px, 기본: 24) */
  arrowSize?: number;
  /** 화살표 불투명도 (0~1, 기본: 0.5) */
  arrowOpacity?: number;
  /** 그라데이션 색상 (위→아래) */
  arrowFrom?: string; // e.g. '#333333'
  arrowTo?: string; // e.g. '#2563EB'
  /** 컨테이너 추가 클래스 */
  className?: string;
};

const IntroHeader: React.FC<Props> = ({
  title,
  lines = [],
  center = true,
  showArrow = true,
  arrowSize = 24,
  arrowOpacity = 0.5,
  arrowFrom = '#333333',
  arrowTo = '#2563EB',
  className = '',
}) => {
  const align = center ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex w-full flex-col justify-between gap-4 ${align} ${className}`}>
      {/* Title */}
      <p className="w-full max-w-[500px] text-[32px] font-bold text-blue-600">{title}</p>

      {/* Sub lines */}
      <div className="flex flex-col gap-2">
        {lines.map((text, idx) => (
          <p
            key={idx}
            className={
              idx === 0
                ? 'text-2xl font-semibold text-slate-900'
                : 'text-base font-semibold text-gray-500'
            }
          >
            {text}
          </p>
        ))}
      </div>

      {/* Gradient arrow (Material Symbols: arrow_cool_down) */}
      {showArrow && (
        <div
          className="flex h-6 w-6 items-center justify-center"
          aria-hidden
        >
          <span
            className="material-symbols-outlined bg-clip-text leading-none text-transparent"
            style={{
              fontSize: arrowSize,
              opacity: arrowOpacity,
              backgroundImage: `linear-gradient(to bottom, ${arrowFrom}, ${arrowTo})`,
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
