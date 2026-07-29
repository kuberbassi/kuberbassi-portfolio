import React from 'react';
import { cn } from '../../lib/cn';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'crimson' | 'cyan' | 'gold' | 'emerald' | 'purple' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'crimson',
  size = 'md',
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-mono font-medium rounded-full border transition-colors';

  const variants = {
    crimson: 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-sm shadow-rose-500/10',
    cyan: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    gold: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    slate: 'bg-slate-900/80 text-slate-300 border-slate-800',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3.5 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
