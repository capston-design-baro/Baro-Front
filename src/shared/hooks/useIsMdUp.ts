import { useEffect, useState } from 'react';

const QUERY = '(min-width: 1140px)'; // Tailwind md 브레이크포인트

export default function useIsMdUp() {
  // SSR 안전: 초기값은 false
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);

    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
      setIsMdUp(matches);
    };

    // 초기 동기화
    onChange(mql);

    // 브라우저 호환 (addEventListener / addListener)
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange as (e: MediaQueryListEvent) => void);
      return () => mql.removeEventListener('change', onChange as (e: MediaQueryListEvent) => void);
    } else {
      // 구형 브라우저
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    }
  }, []);

  return isMdUp;
}
