import React from 'react';
import { useMemo } from 'react';

// 유효한 색상 형식인지 검증하는 함수
const isValidColor = (color: string): boolean => {
  // CSS 변수(--color-...) 또는 hex, rgb, hsl 허용
  return /^var\(--color-[\w-]+\)$|^(#[0-9A-F]{3,6})$|^rgb|^hsl/i.test(color);
};

type Props = {
  // 메인 타이틀
  title: string;

  // 서브텍스트 라인들 (줄바꿈 대신 배열로)
  lines?: string[];

  // 가운데 정렬 여부 (기본: true)
  center?: boolean;

  // 화살표 노출 (기본: true)
  showArrow?: boolean;

  // 화살표 크기(px, 기본: 24)
  arrowSize?: number;

  // 화살표 불투명도 (0~1, 기본: 0.5)
  arrowOpacity?: number;

  // 그라데이션 색상 (위 -> 아래)
  arrowFrom?: string;
  arrowTo?: string;

  // 컨테이너 추가 클래스
  className?: string;
};

const IntroHeader: React.FC<Props> = ({
  title,
  lines = [],
  center = true,
  showArrow = true,
  arrowSize = 24,
  arrowOpacity = 0.5,
  arrowFrom = 'var(--color-neutral-700)',
  arrowTo = 'var(--color-primary-400)',
  className = '',
}) => {
  // 중앙/좌측 정렬에 따라 컨테이너의 정렬/텍스트 정렬 클래스를 결정
  const align = center ? 'items-center text-center' : 'items-start text-left';

  // 유효한 색상인지 확인
  const validArrowFrom = isValidColor(arrowFrom) ? arrowFrom : 'var(--color-neutral-700)';
  const validArrowTo = isValidColor(arrowTo) ? arrowTo : 'var(--color-primary-400)';

  // lines가 변경되지 않을 때 렌더링 최적화
  const renderedLines = useMemo(
    () =>
      lines.map((text, idx) => (
        <p
          key={text} // 텍스트를 key로 사용
          className={
            idx === 0
              ? 'text-body-1-regular text-neutral-900' // 첫 줄은 크고 진하게
              : 'text-body-3-regular text-neutral-500' // 이후 줄들은 작고 연하게
          }
        >
          {text}
        </p>
      )),
    [lines],
  );

  return (
    // 최상위 래퍼 -> 세로 방향 플렉스
    // align과 외부에서 주는 className을 합쳐 유연하게 레이아웃 제어
    <div className={`flex w-full flex-col justify-start gap-2 ${align} ${className}`}>
      {/* Title */}
      <h2 className="text-heading-1-bold text-primary-400 w-full max-w-[500px]">{title}</h2>

      {/* Sub lines */}
      {lines.length > 0 && <div className="flex flex-col gap-2">{renderedLines}</div>}

      {/* 그라데이션 적용 */}
      {showArrow && (
        // 아이콘 컨테이너 -> 24px 박스 안에 가운데 정렬
        <div
          className="flex items-center justify-center"
          style={{
            width: arrowSize, // 아이콘 크기
            height: arrowSize, // 아이콘 투명도
          }}
          aria-hidden="true"
        >
          <span
            className="material-symbols-outlined bg-clip-text leading-none text-transparent"
            style={{
              fontSize: arrowSize, // 폰트 아이콘 크기
              opacity: Math.max(0, Math.min(1, arrowOpacity)), // 투명도를 0~1 범위로 제한
              backgroundImage: `linear-gradient(to bottom, ${validArrowFrom}, ${validArrowTo})`, // 위 -> 아래로 그라데이션
              WebkitBackgroundClip: 'text', // 벤더 접두사
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
