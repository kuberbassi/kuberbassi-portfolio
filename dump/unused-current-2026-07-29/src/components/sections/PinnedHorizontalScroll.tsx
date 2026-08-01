import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import './PinnedHorizontalScroll.css';

export type HorizontalScrollDirection = 'previous' | 'next';

export interface PinnedHorizontalScrollProps<T> {
  items: readonly T[];
  renderItem: (item: T, index: number, isActive: boolean) => ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
  eyebrow?: ReactNode;
  title?: ReactNode;
  ariaLabel?: string;
  className?: string;
  initialStep?: number;
  active?: boolean;
  captureGlobally?: boolean;
  wheelThreshold?: number;
  transitionMs?: number;
  onStepChange?: (step: number) => void;
  onBoundaryExit?: (direction: HorizontalScrollDirection) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * A viewport-sized, step-based horizontal sequence.
 *
 * Desktop wheel/keyboard input advances one full panel at a time. Input at
 * either edge is released through `onBoundaryExit`, allowing a parent page or
 * full-screen section controller to resume vertical navigation. Small screens
 * use a static stacked layout so the component never traps touch scrolling.
 */
export function PinnedHorizontalScroll<T>({
  items,
  renderItem,
  getItemKey,
  eyebrow,
  title,
  ariaLabel = 'Horizontal story',
  className = '',
  initialStep = 0,
  active,
  captureGlobally = false,
  wheelThreshold = 55,
  transitionMs = 900,
  onStepChange,
  onBoundaryExit,
}: PinnedHorizontalScrollProps<T>) {
  const rootRef = useRef<HTMLElement | null>(null);
  const wheelTotalRef = useRef(0);
  const wheelResetRef = useRef<number | undefined>(undefined);
  const lockedUntilRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [step, setStep] = useState(() =>
    clamp(initialStep, 0, Math.max(items.length - 1, 0)),
  );
  const titleId = useId();
  const isActive = active ?? isIntersecting;
  const lastStep = Math.max(items.length - 1, 0);

  useEffect(() => {
    setStep((current) => clamp(current, 0, lastStep));
  }, [lastStep]);

  useEffect(() => {
    if (active !== undefined || !rootRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] },
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [active]);

  const moveTo = useCallback(
    (nextStep: number) => {
      const clampedStep = clamp(nextStep, 0, lastStep);
      setStep((current) => {
        if (current === clampedStep) return current;
        onStepChange?.(clampedStep);
        return clampedStep;
      });
    },
    [lastStep, onStepChange],
  );

  const navigate = useCallback(
    (direction: HorizontalScrollDirection) => {
      if (direction === 'next') {
        if (step < lastStep) {
          moveTo(step + 1);
          return true;
        }
      } else if (step > 0) {
        moveTo(step - 1);
        return true;
      }

      onBoundaryExit?.(direction);
      return false;
    },
    [lastStep, moveTo, onBoundaryExit, step],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isActive || items.length < 2) return;

    const lockNavigation = () => {
      lockedUntilRef.current = performance.now() + transitionMs;
      wheelTotalRef.current = 0;
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.defaultPrevented) return;
      if (window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const primaryDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(primaryDelta) < 1) return;

      const direction: HorizontalScrollDirection = primaryDelta > 0 ? 'next' : 'previous';
      const now = performance.now();

      // Absorb the momentum tail of the gesture that triggered the current
      // panel. Without this, a trackpad can advance a horizontal panel and then
      // leak into the parent vertical deck before the transition has settled.
      if (now < lockedUntilRef.current) {
        event.preventDefault();
        return;
      }

      const canMove = direction === 'next' ? step < lastStep : step > 0;

      if (!canMove) {
        wheelTotalRef.current = 0;
        window.clearTimeout(wheelResetRef.current);
        onBoundaryExit?.(direction);
        return;
      }

      event.preventDefault();

      if (
        (wheelTotalRef.current > 0 && primaryDelta < 0) ||
        (wheelTotalRef.current < 0 && primaryDelta > 0)
      ) {
        wheelTotalRef.current = 0;
      }

      wheelTotalRef.current += primaryDelta;

      window.clearTimeout(wheelResetRef.current);
      wheelResetRef.current = window.setTimeout(() => {
        wheelTotalRef.current = 0;
      }, 140);

      if (Math.abs(wheelTotalRef.current) < wheelThreshold) return;

      lockNavigation();
      navigate(direction);
    };

    const handleGlobalKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return;
      if (window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const previousKeys = ['ArrowLeft', 'ArrowUp', 'PageUp'];
      const nextKeys = ['ArrowRight', 'ArrowDown', 'PageDown', ' '];
      const direction = previousKeys.includes(event.key)
        ? 'previous'
        : nextKeys.includes(event.key)
          ? 'next'
          : null;

      if (!direction) return;
      const canMove = direction === 'next' ? step < lastStep : step > 0;
      if (!canMove) return;

      event.preventDefault();
      if (performance.now() < lockedUntilRef.current) return;
      lockNavigation();
      navigate(direction);
    };

    if (captureGlobally) {
      window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
      return () => {
        window.removeEventListener('wheel', handleWheel, { capture: true });
        window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
        window.clearTimeout(wheelResetRef.current);
      };
    }

    root.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      root.removeEventListener('wheel', handleWheel);
      window.clearTimeout(wheelResetRef.current);
    };
  }, [
    captureGlobally,
    isActive,
    items.length,
    lastStep,
    navigate,
    onBoundaryExit,
    step,
    transitionMs,
    wheelThreshold,
  ]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented) return;
    const previousKeys = ['ArrowLeft', 'ArrowUp', 'PageUp'];
    const nextKeys = ['ArrowRight', 'ArrowDown', 'PageDown', ' '];
    const direction = previousKeys.includes(event.key)
      ? 'previous'
      : nextKeys.includes(event.key)
        ? 'next'
        : null;

    if (!direction) return;

    const canMove = direction === 'next' ? step < lastStep : step > 0;
    if (!canMove) {
      navigate(direction);
      return;
    }

    event.preventDefault();
    if (performance.now() < lockedUntilRef.current) return;
    lockedUntilRef.current = performance.now() + transitionMs;
    wheelTotalRef.current = 0;
    navigate(direction);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;
    if (!start || window.matchMedia('(max-width: 767px)').matches) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const primaryDelta = Math.abs(deltaY) >= Math.abs(deltaX) ? -deltaY : -deltaX;
    if (Math.abs(primaryDelta) < 42) return;

    if (performance.now() < lockedUntilRef.current) return;
    lockedUntilRef.current = performance.now() + transitionMs;
    navigate(primaryDelta > 0 ? 'next' : 'previous');
  };

  if (items.length === 0) return null;

  const style = {
    '--phs-step': step,
    '--phs-duration': `${transitionMs}ms`,
  } as CSSProperties;

  return (
    <section
      ref={rootRef}
      className={`pinned-horizontal-scroll ${className}`.trim()}
      style={style}
      aria-label={title ? undefined : ariaLabel}
      aria-labelledby={title ? titleId : undefined}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {(eyebrow || title) && (
        <header className="pinned-horizontal-scroll__header">
          {eyebrow && <div className="pinned-horizontal-scroll__eyebrow">{eyebrow}</div>}
          {title && (
            <h2 id={titleId} className="pinned-horizontal-scroll__title">
              {title}
            </h2>
          )}
        </header>
      )}

      <div className="pinned-horizontal-scroll__viewport">
        <div
          className="pinned-horizontal-scroll__track"
          style={{ transform: `translate3d(-${step * 100}%, 0, 0)` }}
        >
          {items.map((item, index) => (
            <div
              className="pinned-horizontal-scroll__panel"
              key={getItemKey?.(item, index) ?? index}
              aria-hidden={index !== step}
              data-active={index === step ? 'true' : 'false'}
              data-position={index < step ? 'before' : index > step ? 'after' : 'active'}
            >
              {renderItem(item, index, index === step)}
            </div>
          ))}
        </div>
      </div>

      <nav className="pinned-horizontal-scroll__progress" aria-label="Choose panel">
        {items.map((item, index) => (
          <button
            key={getItemKey?.(item, index) ?? index}
            type="button"
            className="pinned-horizontal-scroll__progress-button"
            aria-label={`Show panel ${index + 1} of ${items.length}`}
            aria-current={index === step ? 'step' : undefined}
            onClick={() => moveTo(index)}
          >
            <span />
          </button>
        ))}
      </nav>

      <p className="pinned-horizontal-scroll__status" aria-live="polite">
        Panel {step + 1} of {items.length}
      </p>
    </section>
  );
}
