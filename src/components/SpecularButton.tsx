import type {
  CSSProperties,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { useEffect, useRef, useState } from 'react';

type ButtonSize = 'sm' | 'md' | 'lg';

export interface SpecularButtonProps {
  children?: ReactNode;
  size?: ButtonSize;
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'text-[0.85rem] px-[22px] py-[10px]',
  md: 'text-[1rem] px-[30px] py-[14px]',
  lg: 'text-[1.15rem] px-10 py-[18px]',
};

/**
 * A CSS-only specular surface.
 *
 * The previous implementation allocated one WebGL renderer, context, global
 * pointer listener, ResizeObserver, and permanent RAF loop per button. Seven
 * buttons on the homepage therefore kept seven GPU contexts active. This
 * version preserves the same public API and visual language without any
 * runtime animation loop.
 */
const SpecularButton = ({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  shineSize = 18,
  shineFade = 40,
  thickness = 1,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  href,
  target,
  rel,
  ariaLabel,
}: SpecularButtonProps) => {
  const surfaceRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const [glowVisible, setGlowVisible] = useState(false);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    if (!('IntersectionObserver' in window)) {
      setGlowVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setGlowVisible(entry.isIntersecting),
      { rootMargin: '80px', threshold: 0.01 },
    );
    observer.observe(surface);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface || !glowVisible) return;
    const onPointerMove = (event: PointerEvent) => {
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty('--sb-pointer-x', `${event.clientX - rect.left}px`);
      surface.style.setProperty('--sb-pointer-y', `${event.clientY - rect.top}px`);
      surface.style.setProperty('--sb-glow-opacity', '1');
    };
    const onPointerLeave = () => surface.style.setProperty('--sb-glow-opacity', '0.54');
    surface.addEventListener('pointermove', onPointerMove, { passive: true });
    surface.addEventListener('pointerleave', onPointerLeave);
    return () => {
      surface.removeEventListener('pointermove', onPointerMove);
      surface.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [glowVisible]);

  const classes = [
    'specular-button',
    'relative m-0 inline-flex cursor-pointer items-center justify-center',
    'border-none font-medium leading-none tracking-[0.01em] no-underline outline-none',
    'disabled:cursor-default disabled:opacity-55',
    SIZES[size] || SIZES.md,
    className,
  ].filter(Boolean).join(' ');

  const sharedStyle = {
    '--sb-radius': `${radius}px`,
    '--sb-tint': tint,
    '--sb-tint-opacity': tintOpacity,
    '--sb-blur': `${blur}px`,
    '--sb-text-color': textColor,
    '--sb-line-color': lineColor,
    '--sb-base-color': baseColor,
    '--sb-intensity': intensity,
    '--sb-shine-size': `${Math.max(shineSize, 8) * 2}px`,
    '--sb-shine-fade': `${Math.max(shineFade, 16) * 2}px`,
    '--sb-thickness': `${Math.max(thickness, 0.5)}px`,
    borderRadius: `${radius}px`,
  } as CSSProperties;

  const content = (
    <>
      {glowVisible && <span className="specular-button__fx" aria-hidden="true" />}
      <span className="specular-button__content">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={(node) => { surfaceRef.current = node; }}
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick}
        className={classes}
        style={sharedStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={(node) => { surfaceRef.current = node; }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
      style={sharedStyle}
    >
      {content}
    </button>
  );
};

export default SpecularButton;
