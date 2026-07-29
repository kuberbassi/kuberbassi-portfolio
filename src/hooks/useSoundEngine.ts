import { useCallback } from 'react';

/** Completely muted / disabled sound engine hook per user preference. */
export function useSoundEngine() {
  const toggleSound = useCallback(() => {}, []);
  const playHover = useCallback(() => {}, []);
  const playClick = useCallback(() => {}, []);
  const playSwoosh = useCallback(() => {}, []);

  return {
    muted: true,
    toggleSound,
    playHover,
    playClick,
    playSwoosh,
  };
}
