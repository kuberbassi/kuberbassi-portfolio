import React from 'react';
import { cn } from '../../lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
  hoverable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = true,
  hoverable = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border p-6 transition-all duration-300',
        glass
          ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md'
          : 'bg-slate-900 border-slate-800',
        hoverable &&
          'hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/10 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
