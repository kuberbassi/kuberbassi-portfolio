import { useEffect, useRef } from 'react';

const ASSET = '/assets/topographic-bg.webp';
const SECTION_Y = [-4, 7, -5, 9, -7, 5, -8];
const STRENGTHS = [6, 12, 18];

export function TopographicBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const layers = Array.from(root.querySelectorAll<HTMLElement>('.topographic-background__layer'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 767px)');
    let frame = 0;
    let interactionTimer = 0;
    let sectionY = SECTION_Y[0];
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      layers.forEach((layer, index) => {
        const rotation = index === 2 ? -0.18 : index === 1 ? 0.12 : 0;
        layer.style.transform = `translate3d(${(currentX * STRENGTHS[index]).toFixed(2)}px, ${(currentY * STRENGTHS[index] + sectionY).toFixed(2)}px, 0) rotate(${rotation}deg) scale(1.012)`;
      });
      if (Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002) {
        frame = requestAnimationFrame(render);
      } else {
        frame = 0;
      }
    };

    const start = () => {
      if (!frame && !document.hidden && !mobile.matches && !reducedMotion.matches) {
        frame = requestAnimationFrame(render);
      }
    };
    const markInteraction = () => {
      root.dataset.interacting = 'true';
      clearTimeout(interactionTimer);
      interactionTimer = window.setTimeout(() => { root.dataset.interacting = 'false'; }, 720);
    };
    const onSectionChange = (event: Event) => {
      const index = (event as CustomEvent<number>).detail ?? 0;
      sectionY = SECTION_Y[index] ?? 0;
      root.dataset.section = String(index);
      markInteraction();
      start();
    };
    const onVisibility = () => {
      if (document.hidden && frame) cancelAnimationFrame(frame);
      if (document.hidden) frame = 0;
    };

    window.addEventListener('kb:sectionchange', onSectionChange);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(interactionTimer);
      window.removeEventListener('kb:sectionchange', onSectionChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="topographic-background" ref={rootRef} data-section="0" aria-hidden="true">
      <img className="topographic-background__layer topographic-background__layer--base" src={ASSET} alt="" width="1920" height="1080" decoding="async" fetchPriority="high" />
      <img className="topographic-background__layer topographic-background__layer--middle" src={ASSET} alt="" width="1920" height="1080" decoding="async" />
      <img className="topographic-background__layer topographic-background__layer--logo" src={ASSET} alt="" width="1920" height="1080" decoding="async" />
      <div className="topographic-background__shade" />
    </div>
  );
}
