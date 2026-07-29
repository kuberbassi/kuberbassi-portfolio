import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

type ScrollVelocityProps = {
  items: string[];
  active?: boolean;
  idleVelocity?: number;
  maxVelocity?: number;
  copies?: number;
  className?: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function ScrollVelocity({
  items,
  active = true,
  idleVelocity = 7,
  maxVelocity = 190,
  copies = 4,
  className = '',
}: ScrollVelocityProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const hoveredRef = useRef(false);
  const positionRef = useRef(0);
  const velocityRef = useRef(0);
  const targetVelocityRef = useRef(-idleVelocity);
  const sequenceWidthRef = useRef(0);
  const lastCenterItemRef = useRef<HTMLElement | null>(null);
  const isMobileRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    activeRef.current = active;
    targetVelocityRef.current = active ? -idleVelocity : 0;
  }, [active, idleVelocity]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const updateMobile = () => {
      isMobileRef.current = mobileQuery.matches;
    };

    updateMobile();
    mobileQuery.addEventListener('change', updateMobile);
    return () => mobileQuery.removeEventListener('change', updateMobile);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      sequenceWidthRef.current = sequenceRef.current?.getBoundingClientRect().width ?? 0;
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (sequenceRef.current) observer.observe(sequenceRef.current);
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (shouldReduceMotion || isMobileRef.current || !activeRef.current) return;

      const velocity = clamp(-event.deltaY * 3.2, -maxVelocity, maxVelocity);
      targetVelocityRef.current = velocity;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [maxVelocity, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) {
      if (trackRef.current) trackRef.current.style.transform = 'translate3d(0, 0, 0)';
      return;
    }

    let frame = 0;
    let previousTime = performance.now();
    let lastCenterCheck = 0;

    const updateCenterItem = () => {
      const root = rootRef.current;
      if (!root) return;

      const rootRect = root.getBoundingClientRect();
      const center = rootRect.left + rootRect.width / 2;
      let closest: HTMLElement | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      root.querySelectorAll<HTMLElement>('.principle-velocity__item').forEach((item) => {
        const rect = item.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - center);
        if (distance < closestDistance) {
          closest = item;
          closestDistance = distance;
        }
      });

      if (closest === lastCenterItemRef.current) return;
      lastCenterItemRef.current?.classList.remove('is-center');
      closest?.classList.add('is-center');
      lastCenterItemRef.current = closest;
    };

    const animate = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const isActive = activeRef.current;
      const idleTarget = isActive && !hoveredRef.current
        ? -(isMobileRef.current ? idleVelocity * 0.45 : idleVelocity)
        : 0;

      targetVelocityRef.current += (idleTarget - targetVelocityRef.current) * 0.035;
      velocityRef.current += (targetVelocityRef.current - velocityRef.current) * 0.095;

      const width = sequenceWidthRef.current;
      if (width > 0) {
        positionRef.current += velocityRef.current * delta;

        while (positionRef.current <= -width) positionRef.current += width;
        while (positionRef.current > 0) positionRef.current -= width;

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
        }
      }

      if (time - lastCenterCheck > 72) {
        updateCenterItem();
        lastCenterCheck = time;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [idleVelocity, shouldReduceMotion]);

  const sequence = (
    <>
      {items.map((item) => (
        <span className="principle-velocity__pair" key={item}>
          <span className="principle-velocity__item">{item}</span>
          <span className="principle-velocity__tick" aria-hidden="true" />
        </span>
      ))}
    </>
  );

  return (
    <div
      ref={rootRef}
      className={`principle-velocity ${className}`}
      aria-label={items.join(' · ')}
      onPointerEnter={() => {
        hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
    >
      <div ref={trackRef} className="principle-velocity__track" aria-hidden="true">
        {Array.from({ length: copies }, (_, index) => (
          <div
            ref={index === 0 ? sequenceRef : undefined}
            className="principle-velocity__sequence"
            key={index}
          >
            {sequence}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScrollVelocity;
