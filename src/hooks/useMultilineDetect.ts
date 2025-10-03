import { useLayoutEffect, useRef, useState } from 'react';

export function useMultilineDetect<T extends HTMLElement = HTMLElement>(text?: string) {
  const ref = useRef<T>(null);
  const [isMultiline, setIsMultiline] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const style = getComputedStyle(el);
      const lh = parseFloat(style.lineHeight || '0') || 0;
      const h = el.getBoundingClientRect().height;
      setIsMultiline(h > lh + 0.5); // 1줄 높이보다 크면 멀티라인이라고 판단함
    };

    measure();

    // 리사이즈 및 텍스트 변화에도 다시 측정
    const ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [text]);

  return { ref, isMultiline };
}
