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

export function TopographicBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [webglEnabled, setWebglEnabled] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateCapability = () => setWebglEnabled(pointerQuery.matches && !motionQuery.matches);
    updateCapability();
    pointerQuery.addEventListener('change', updateCapability);
    motionQuery.addEventListener('change', updateCapability);
    return () => {
      pointerQuery.removeEventListener('change', updateCapability);
      motionQuery.removeEventListener('change', updateCapability);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let interactionTimer = 0;
    const markInteraction = () => {
      root.dataset.interacting = 'true';
      clearTimeout(interactionTimer);
      interactionTimer = window.setTimeout(() => { root.dataset.interacting = 'false'; }, 720);
    };
    const onSectionChange = (index: number) => {
      root.dataset.section = String(index);
      markInteraction();
    };

    const removeSectionListener = listenForPortfolioEvent(portfolioEvents.sectionChange, onSectionChange);
    return () => {
      clearTimeout(interactionTimer);
      removeSectionListener();
    };
  }, []);

  return (
    <div className="topographic-background" ref={rootRef} data-section="0" aria-hidden="true">
      {webglEnabled && (
        <>
          <div className="topographic-background__terrain topographic-background__terrain--upper">
            <Suspense fallback={null}>
              <Topography {...terrainProps} className="topographic-background__terrain-canvas" />
            </Suspense>
          </div>
          <div className="topographic-background__terrain topographic-background__terrain--lower">
            <Suspense fallback={null}>
              <Topography {...terrainProps} className="topographic-background__terrain-canvas" />
            </Suspense>
          </div>
        </>
      )}
      <div className="topographic-background__shade" />
    </div>
  );
}
