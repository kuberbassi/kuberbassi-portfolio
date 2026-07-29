import { motion, useReducedMotion, type Transition, type Easing } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

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
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const words = text.split(' ');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setInView(true);
      return;
    }

    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, shouldReduceMotion]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  if (shouldReduceMotion) {
    return <p ref={ref} className={`blur-text ${className}`}>{text}</p>;
  }

  const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);
  const animatedSegmentCount = animateBy === 'letters'
    ? words.reduce((count, word) => count + Array.from(word).length, 0)
    : elements.length;

  const renderAnimatedSegment = (segment: string, index: number) => {
    const spanTransition: Transition = {
      duration: totalDuration,
      times,
      delay: (index * delay) / 1000,
      ease: easing
    };

    return (
      <motion.span
        key={`${segment}-${index}`}
        aria-hidden="true"
        initial={fromSnapshot}
        animate={inView ? animateKeyframes : fromSnapshot}
        transition={spanTransition}
        onAnimationComplete={index === animatedSegmentCount - 1 ? onAnimationComplete : undefined}
        style={{
          display: 'inline-block',
          willChange: 'transform, filter, opacity'
        }}
      >
        {segment}
      </motion.span>
    );
  };

  let letterIndex = 0;

  return (
    <p ref={ref} aria-label={text} className={`blur-text ${className}`}>
      {animateBy === 'letters'
        ? words.map((word, wordIndex) => (
          <span
            key={`${word}-${wordIndex}`}
            aria-hidden="true"
            style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}
          >
            {Array.from(word).map((letter) => renderAnimatedSegment(letter, letterIndex++))}
            {wordIndex < words.length - 1 && '\u00A0'}
          </span>
        ))
        : elements.map((segment, index) => (
          <span key={`${segment}-${index}`} aria-hidden="true" style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
            {renderAnimatedSegment(segment, index)}
            {index < elements.length - 1 && '\u00A0'}
          </span>
        ))}
    </p>
  );
};

export default BlurText;
