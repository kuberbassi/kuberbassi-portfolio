import { useState, useEffect } from 'react';

/** Returns true if the media query matches. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Convenience: returns true if viewport is mobile (< 768px). */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
