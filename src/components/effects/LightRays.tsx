import { useEffect, useRef, type CSSProperties } from 'react';

export type RaysOrigin = 'top-center' | 'top-left' | 'top-right' | 'right' | 'left' | 'bottom-center' | 'bottom-right' | 'bottom-left';

interface LightRaysProps {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

/** Pointer-steered god rays without a canvas, WebGL context, or idle render loop. */
export function LightRays({
  raysColor = '#d5b27e',
  followMouse = true,
  mouseInfluence = 0.05,
  className = '',
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !followMouse) return;
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastSetX = -999;
    let lastSetY = -999;
    let pendingEvent: PointerEvent | null = null;

    const render = () => {
      if (pendingEvent) {
        const rect = container.getBoundingClientRect();
        const normalizedX = (pendingEvent.clientX - rect.left) / Math.max(rect.width, 1);
        const normalizedY = (pendingEvent.clientY - rect.top) / Math.max(rect.height, 1);
        const influence = Math.min(Math.max(mouseInfluence / 0.05, 0.5), 1.5);
        targetX = (normalizedX - 0.5) * 18 * influence;
        targetY = (normalizedY - 0.5) * 8 * influence;
        pendingEvent = null;
      }

      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      if (Math.abs(currentX - lastSetX) > 0.05 || Math.abs(currentY - lastSetY) > 0.05) {
        lastSetX = currentX;
        lastSetY = currentY;
        container.style.setProperty('--ray-shift-x', `${currentX.toFixed(2)}px`);
        container.style.setProperty('--ray-shift-y', `${currentY.toFixed(2)}px`);
      }

      if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
        frame = requestAnimationFrame(render);
      } else {
        frame = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pendingEvent = event;
      if (!frame) frame = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [followMouse, mouseInfluence]);

  return (
    <div ref={containerRef} aria-hidden="true" className={`light-rays light-rays--optimized ${className}`.trim()}
      style={{ '--ray-color': raysColor } as CSSProperties}>
      <span className="light-rays__beam light-rays__beam--wide" />
      <span className="light-rays__beam light-rays__beam--fine" />
      <span className="light-rays__bloom" />
    </div>
  );
}
