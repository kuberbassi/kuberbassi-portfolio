import { useEffect, useRef, useState } from 'react';
import { listenForPortfolioEvent, portfolioEvents } from '../../utils/portfolioEvents';

type CursorMode = 'idle' | 'interactive' | 'label';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const positionRef = useRef({ x: -80, y: -80 });
  const currentRef = useRef({ x: -80, y: -80 });
  const modeRef = useRef<CursorMode>('idle');
  const labelRef = useRef('');
  const suspendedRef = useRef(false);
  const [mode, setMode] = useState<CursorMode>('idle');
  const [label, setLabel] = useState('');

  useEffect(() => {
    const enabled = window.matchMedia('(pointer: fine) and (hover: hover)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!enabled) return;

    const root = document.documentElement;
    root.dataset.customCursor = 'true';

    const paint = () => {
      const current = currentRef.current;
      const target = positionRef.current;
      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;
      cursorRef.current?.style.setProperty(
        'transform',
        `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`,
      );
      if (Math.abs(target.x - current.x) > 0.12 || Math.abs(target.y - current.y) > 0.12) {
        frameRef.current = requestAnimationFrame(paint);
      } else {
        current.x = target.x;
        current.y = target.y;
        frameRef.current = null;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (suspendedRef.current) return;
      positionRef.current = { x: event.clientX, y: event.clientY };
      cursorRef.current?.classList.add('is-visible');
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(paint);

      const target = event.target instanceof Element ? event.target : null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      const nextLabel = labelled?.dataset.cursor ?? '';
      const interactive = labelled || target?.closest('a, button, input, textarea, select, [role="button"]');
      const nextMode: CursorMode = nextLabel ? 'label' : interactive ? 'interactive' : 'idle';
      if (labelRef.current !== nextLabel) {
        labelRef.current = nextLabel;
        setLabel(nextLabel);
      }
      if (modeRef.current !== nextMode) {
        modeRef.current = nextMode;
        setMode(nextMode);
      }
    };

    const hide = () => cursorRef.current?.classList.remove('is-visible');
    const onSuspend = (suspended: boolean) => {
      suspendedRef.current = suspended;
      cursorRef.current?.classList.toggle('is-suspended', suspendedRef.current);
      if (suspendedRef.current) hide();
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    const removeSuspendListener = listenForPortfolioEvent(portfolioEvents.cursorSuspend, onSuspend);
    document.addEventListener('mouseleave', hide);
    window.addEventListener('blur', hide);

    return () => {
      delete root.dataset.customCursor;
      window.removeEventListener('pointermove', onPointerMove);
      removeSuspendListener();
      document.removeEventListener('mouseleave', hide);
      window.removeEventListener('blur', hide);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" data-mode={mode} aria-hidden="true">
      {label && <span>{label}</span>}
    </div>
  );
}
