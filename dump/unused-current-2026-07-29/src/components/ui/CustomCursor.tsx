import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);
  const hoveredRef = useRef(false);
  const cursorTextRef = useRef('');

  useEffect(() => {
    // Touch and reduced-motion users retain the platform cursor.
    if (
      window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const updateVisible = (next: boolean) => {
      if (visibleRef.current === next) return;
      visibleRef.current = next;
      setIsVisible(next);
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      updateVisible(true);

      // Check for interactive targets
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      const clickableTarget = target.closest('a, button, input, textarea, [role="button"]') as HTMLElement | null;

      if (cursorTarget) {
        const nextText = cursorTarget.getAttribute('data-cursor') || '';
        if (cursorTextRef.current !== nextText) {
          cursorTextRef.current = nextText;
          setCursorText(nextText);
        }
        if (!hoveredRef.current) {
          hoveredRef.current = true;
          setIsHovered(true);
        }
      } else if (clickableTarget) {
        if (cursorTextRef.current) {
          cursorTextRef.current = '';
          setCursorText('');
        }
        if (!hoveredRef.current) {
          hoveredRef.current = true;
          setIsHovered(true);
        }
      } else {
        if (cursorTextRef.current) {
          cursorTextRef.current = '';
          setCursorText('');
        }
        if (hoveredRef.current) {
          hoveredRef.current = false;
          setIsHovered(false);
        }
      }
    };

    const onMouseLeave = () => updateVisible(false);
    const onMouseEnter = () => updateVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerp loop
    let currentX = -100;
    let currentY = -100;

    const loop = () => {
      currentX += (mousePos.current.x - currentX) * 0.2;
      currentY += (mousePos.current.y - currentY) * 0.2;
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      requestRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[var(--z-toast)] flex items-center justify-center rounded-full bg-[var(--color-accent)] mix-blend-difference text-[var(--color-text-inverse)] font-mono text-[10px] font-bold uppercase tracking-widest text-center shadow-glow"
      initial={{ opacity: 0 }}
      animate={{
        width: cursorText ? 64 : isHovered ? 40 : 12,
        height: cursorText ? 64 : isHovered ? 40 : 12,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 28,
        mass: 0.5,
      }}
    >
      {cursorText && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          {cursorText}
        </motion.span>
      )}
    </motion.div>
  );
}
