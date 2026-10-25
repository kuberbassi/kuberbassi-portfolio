import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { listenForPortfolioEvent, portfolioEvents } from '../../utils/portfolioEvents';

const Topography = lazy(() => import('../Topography'));
const terrainProps = {
  color: '#d5b27e',
  lineCount: 17,
  lineWidth: 1.1,
  majorLines: true,
  elevation: 0.9,
  foreground: 0.32,
  scale: 1.15,
  detail: 0.2,
  tilt: 37,
  speed: 0.012,
  morph: 0.025,
  glow: 0.055,
  depthOfField: 0,
  fog: 0.82,
  brightness: 1.194,
  opacity: 1,
  mouseInteraction: true,
  hoverEffect: 'light' as const,
  mouseRadius: 1.2,
  mouseStrength: 0.16,
  trail: 0,
  parallax: 0.12,
  clickEffect: 'none' as const,
  markers: 'none' as const,
  intro: false,
  glitch: 0,
  dpr: 1.15,
};
const compactTerrainProps = {
  ...terrainProps,
  dpr: 1,
  mouseInteraction: false,
  parallax: 0,
  speed: 0.009,
  morph: 0.018,
};
const upperTerrainProps = { ...terrainProps, mouseInteraction: false };
const compactUpperTerrainProps = { ...compactTerrainProps };

export function TopographicBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [webglEnabled, setWebglEnabled] = useState(false);
  const [upperTerrainEnabled, setUpperTerrainEnabled] = useState(false);
  const [desktopTerrainEnabled, setDesktopTerrainEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const currentSectionRef = useRef(0);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let idleHandle: number | null = null;
    let fallbackTimer = 0;
    let upperTimer = 0;
    const cancelPendingLoads = () => {
      if (idleHandle !== null) idleWindow.cancelIdleCallback?.(idleHandle);
      idleHandle = null;
      clearTimeout(fallbackTimer);
      clearTimeout(upperTimer);
    };
    const scheduleTerrainLoad = () => {
      cancelPendingLoads();
      setWebglEnabled(false);
      setUpperTerrainEnabled(false);
      setDesktopTerrainEnabled(desktopQuery.matches);
      if (motionQuery.matches) return;

      const mountLowerTerrain = () => {
        idleHandle = null;
        setWebglEnabled(true);
        upperTimer = window.setTimeout(() => setUpperTerrainEnabled(true), 700);
      };
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(mountLowerTerrain, { timeout: 1200 });
      } else {
        fallbackTimer = window.setTimeout(mountLowerTerrain, 320);
      }
    };

    scheduleTerrainLoad();
    desktopQuery.addEventListener('change', scheduleTerrainLoad);
    motionQuery.addEventListener('change', scheduleTerrainLoad);
    return () => {
      cancelPendingLoads();
      desktopQuery.removeEventListener('change', scheduleTerrainLoad);
      motionQuery.removeEventListener('change', scheduleTerrainLoad);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let sectionTimer = 0;
    let scrollTimer = 0;
    const onSectionChange = (index: number) => {
      currentSectionRef.current = index;
      root.dataset.section = String(index);
      clearTimeout(sectionTimer);
      setPaused(true);
      sectionTimer = window.setTimeout(
        () => setPaused(currentSectionRef.current === 2 || currentSectionRef.current === 3),
        1750,
      );
    };
    const onScroll = () => {
      if (!window.matchMedia('(max-width: 1023px), (pointer: coarse)').matches) return;
      setPaused(true);
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(
        () => setPaused(currentSectionRef.current === 2 || currentSectionRef.current === 3),
        180,
      );
    };

    const removeSectionListener = listenForPortfolioEvent(portfolioEvents.sectionChange, onSectionChange);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(sectionTimer);
      clearTimeout(scrollTimer);
      window.removeEventListener('scroll', onScroll);
      removeSectionListener();
    };
  }, []);

  return (
    <div className="topographic-background" ref={rootRef} data-section="0" aria-hidden="true">
      {webglEnabled && (
        <>
          {upperTerrainEnabled && (
            <div className="topographic-background__terrain topographic-background__terrain--upper">
              <Suspense fallback={null}>
                <Topography
                  {...(desktopTerrainEnabled ? upperTerrainProps : compactUpperTerrainProps)}
                  paused={paused}
                  className="topographic-background__terrain-canvas"
                />
              </Suspense>
            </div>
          )}
          <div className="topographic-background__terrain topographic-background__terrain--lower">
            <Suspense fallback={null}>
              <Topography
                {...(desktopTerrainEnabled ? terrainProps : compactTerrainProps)}
                paused={paused}
                className="topographic-background__terrain-canvas"
              />
            </Suspense>
          </div>
        </>
      )}
      <div className="topographic-background__shade" />
    </div>
  );
}
