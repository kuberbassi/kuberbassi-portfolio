import { useEffect, useRef } from 'react';

const ASSET = '/assets/topographic-bg.webp';
const SECTION_Y = [-4, 7, -5, 9, -7, 5, -8];
const STRENGTHS = [6, 12, 18];

export function TopographicBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const layers = Array.from(
      root.querySelectorAll<HTMLElement>('.topographic-background__layer'),
    );
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 767px)');

    let frame = 0;
    let sectionY = SECTION_Y[0];
    let visible = true;
    let logoHovered = false;
    let interactionTimer = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const canAnimate = () =>
      visible && !document.hidden && !mobile.matches && !reducedMotion.matches;

    const render = (time = 0) => {
      frame = 0;

      if (!canAnimate()) {
        layers.forEach((layer, index) => {
          const rotation = index === 2 ? -0.18 : index === 1 ? 0.12 : 0;
          layer.style.transform =
            `translate3d(0, ${sectionY}px, 0) rotate(${rotation}deg) scale(1)`;
        });
        return;
      }

      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      const drift = 1 + ((Math.sin(time / 12500) + 1) / 2) * 0.025;
      layers.forEach((layer, index) => {
        const strength = STRENGTHS[index];
        const rotation = index === 2 ? -0.18 : index === 1 ? 0.12 : 0;
        const hoverScale = logoHovered && index === 2 ? 1.008 : 1;
        layer.style.transform = [
          `translate3d(${(currentX * strength).toFixed(2)}px,`,
          `${(currentY * strength + sectionY).toFixed(2)}px, 0)`,
          `rotate(${rotation}deg)`,
          `scale(${(drift * hoverScale).toFixed(4)})`,
        ].join(' ');
      });

      frame = window.requestAnimationFrame(render);
    };

    const start = () => {
      if (!frame && canAnimate()) frame = window.requestAnimationFrame(render);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const markInteraction = () => {
      if (mobile.matches || reducedMotion.matches) return;
      root.dataset.interacting = 'true';
      window.clearTimeout(interactionTimer);
      interactionTimer = window.setTimeout(() => {
        root.dataset.interacting = 'false';
      }, 720);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (mobile.matches || reducedMotion.matches) return;
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
      markInteraction();
      start();
    };

    const handleSectionChange = (event: Event) => {
      const index = (event as CustomEvent<number>).detail ?? 0;
      sectionY = SECTION_Y[index] ?? 0;
      root.dataset.section = String(index);
      markInteraction();
      start();
    };

    const handleLogoHover = (event: Event) => {
      logoHovered = Boolean((event as CustomEvent<boolean>).detail);
      root.dataset.logoHover = logoHovered ? 'true' : 'false';
      start();
    };

    const handleVisibility = () => {
      root.dataset.paused = document.hidden ? 'true' : 'false';
      if (document.hidden) stop();
      else start();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        root.dataset.paused = visible ? 'false' : 'true';
        if (visible) start();
        else stop();
      },
      { threshold: 0.01 },
    );

    const page = document.querySelector('.blago-deck-container');
    if (page) observer.observe(page);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('kb:sectionchange', handleSectionChange);
    window.addEventListener('kb:logohover', handleLogoHover);
    document.addEventListener('visibilitychange', handleVisibility);
    mobile.addEventListener('change', handleVisibility);
    reducedMotion.addEventListener('change', handleVisibility);
    start();

    return () => {
      stop();
      window.clearTimeout(interactionTimer);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('kb:sectionchange', handleSectionChange);
      window.removeEventListener('kb:logohover', handleLogoHover);
      document.removeEventListener('visibilitychange', handleVisibility);
      mobile.removeEventListener('change', handleVisibility);
      reducedMotion.removeEventListener('change', handleVisibility);
    };
  }, []);

  return (
    <div
      className="topographic-background"
      ref={rootRef}
      data-section="0"
      data-logo-hover="false"
      aria-hidden="true"
    >
      <img
        className="topographic-background__layer topographic-background__layer--base"
        src={ASSET}
        alt=""
        width="1920"
        height="1080"
        decoding="async"
        fetchPriority="high"
      />
      <img
        className="topographic-background__layer topographic-background__layer--middle"
        src={ASSET}
        alt=""
        width="1920"
        height="1080"
        decoding="async"
      />
      <img
        className="topographic-background__layer topographic-background__layer--logo"
        src={ASSET}
        alt=""
        width="1920"
        height="1080"
        decoding="async"
      />
      <div className="topographic-background__shade" />
    </div>
  );
}
