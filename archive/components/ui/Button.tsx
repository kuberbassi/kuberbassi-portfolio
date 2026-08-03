import React from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

const base =
  'specular-surface inline-flex items-center justify-center gap-2 font-medium rounded-sm transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none select-none';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-light)] focus-visible:ring-[var(--color-accent)] shadow-sm',
  secondary:
    'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-3)]',
  ghost:
    'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-1)]',
  outline:
    'border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs tracking-wide',
  md: 'px-6 py-3 text-sm tracking-wide',
  lg: 'px-8 py-4 text-base tracking-wide',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  href,
  target,
  rel,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
