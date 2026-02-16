import { useLayoutEffect, useRef, useState } from 'react';

export function useMultilineDetect(text?: string) {
  // DOM 요소를 참조하기 위한 ref
  const ref = useRef<HTMLParagraphElement>(null);

  // 멀티라인인지 여부 저장
  const [isMultiline, setIsMultiline] = useState(false);

  useLayoutEffect(() => {
    // 실제 DOM 요소
    const paragraphEl = ref.current;

    // 만약 요소가 아직 없으면 그냥 종료하기
    if (!paragraphEl) return;

    const measure = () => {
      // 현재 <p> 요소의 최종 CSS 스타일 가져오기
      const style = getComputedStyle(paragraphEl);

      // 텍스트가 1줄일 때 차지하는 높이
      const lineHeight = parseFloat(style.lineHeight || '0') || 0;

      // 요소 전체 높이
      const elementHeight = paragraphEl.getBoundingClientRect().height;

      // 전체 높이가 1줄 높이보다 크면 멀티라인이라고 판단함
      setIsMultiline(elementHeight > lineHeight + 0.5);
    };

    // 컴포넌트가 처음 마운트될 때 한 번 측정
    measure();

    // [변화 감지를 위한 설정]
    // 1) 요소 자체 크기 변화 감지
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    resizeObserver?.observe(paragraphEl);

    // 2) 브라우저 창 크기 변화도 감지
    window.addEventListener('resize', measure);

    // 컴포넌트가 사라질 때 감지 이벤트 해제
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [text]); // text 내용이 바뀔 때마다 다시 측정

  return { ref, isMultiline };
}
