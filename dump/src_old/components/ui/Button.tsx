import React from 'react';
import { cn } from '../../lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'crimson' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'crimson',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-mono font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none select-none';

  const variants = {
    crimson:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 hover:shadow-rose-500/45 hover:-translate-y-0.5 active:translate-y-0 border border-rose-400/30',
    primary:
      'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-lg shadow-sky-500/20 hover:shadow-sky-400/35 hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-800 hover:border-slate-700 hover:-translate-y-0.5',
    outline:
      'bg-transparent hover:bg-rose-500/10 text-rose-300 border border-rose-500/40 hover:border-rose-400 hover:-translate-y-0.5',
    ghost:
      'bg-transparent hover:bg-slate-900/60 text-slate-300 hover:text-white',
    gold:
      'bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-400/35 hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-xs px-4.5 py-2.5 gap-2',
    lg: 'text-sm px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
};
