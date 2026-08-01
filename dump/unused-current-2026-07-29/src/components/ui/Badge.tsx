import React from 'react';
import { cn } from '../../utils/cn';

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'ghost';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
  accent:  'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[rgba(201,169,110,0.2)]',
  success: 'bg-[rgba(74,222,128,0.08)] text-[var(--color-success)] border border-[rgba(74,222,128,0.2)]',
  warning: 'bg-[rgba(251,146,60,0.08)] text-[var(--color-warning)] border border-[rgba(251,146,60,0.2)]',
  error:   'bg-[rgba(248,113,113,0.08)] text-[var(--color-error)] border border-[rgba(248,113,113,0.2)]',
  ghost:   'text-[var(--color-text-muted)]',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-sm leading-none',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
