import React from 'react';
import { cn } from '../../utils/cn';

interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ className, orientation = 'horizontal' }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <span
        aria-hidden="true"
        className={cn('block w-px h-full bg-[var(--color-border)]', className)}
      />
    );
  }
  return (
    <hr
      aria-hidden="true"
      className={cn('divider', className)}
    />
  );
}
