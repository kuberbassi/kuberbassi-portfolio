import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: unknown;
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const BlurText = ({
  text = '',
  delay = 24,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  onAnimationComplete,
  stepDuration = 0.35,
}: BlurTextProps) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useRef(false);
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion.current || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const activeSlide = element.closest('.blago-slide');
    if (activeSlide?.classList.contains('is-active')) {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setInView(true);
      observer.disconnect();
    }, { threshold, rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  const fallbackY = direction === 'top' ? -16 : 16;
  const fromY = Number(animationFrom?.y ?? fallbackY);
  const animatedCount = animateBy === 'letters'
    ? Array.from(text).filter((character) => !/\s/.test(character)).length
    : words.filter((word) => !/^\s+$/.test(word)).length;
  const style = {
    '--blur-text-y': `${Number.isFinite(fromY) ? fromY : fallbackY}px`,
    '--blur-text-stagger': `${Math.min(Math.max(delay, 8), 72)}ms`,
    '--blur-text-duration': `${Math.min(Math.max(stepDuration * 1000, 280), 620)}ms`,
  } as CSSProperties;
  let animatedIndex = -1;

  return (
    <p
      ref={ref}
      className={`blur-text blur-text--segmented${inView ? ' is-visible' : ''} ${className}`.trim()}
      style={style}
      aria-label={text}
    >
      {words.map((word, wordIndex) => {
        if (/^\s+$/.test(word)) {
          return <span key={`space-${wordIndex}`} className="blur-text__space" aria-hidden="true">{word}</span>;
        }

        if (animateBy === 'words') {
          animatedIndex += 1;
          const index = animatedIndex;
          return (
            <span key={`${word}-${wordIndex}`} className="blur-text__segment blur-text__word" aria-hidden="true"
              style={{ '--blur-text-index': index } as CSSProperties}
              onTransitionEnd={index === animatedCount - 1 ? (event) => { if (event.propertyName === 'opacity') onAnimationComplete?.(); } : undefined}>
              {word}
            </span>
          );
        }

        return (
          <span key={`${word}-${wordIndex}`} className="blur-text__word" aria-hidden="true">
            {Array.from(word).map((character, characterIndex) => {
              animatedIndex += 1;
              const index = animatedIndex;
              return (
                <span key={`${character}-${characterIndex}`} className="blur-text__segment"
                  style={{ '--blur-text-index': index } as CSSProperties}
                  onTransitionEnd={index === animatedCount - 1 ? (event) => { if (event.propertyName === 'opacity') onAnimationComplete?.(); } : undefined}>
                  {character}
                </span>
              );
            })}
          </span>
        );
      })}
    </p>
  );
};

export default BlurText;
