import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { fadeUpVariants } from '../../lib/motion';

interface SectionTitleProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  animate?: boolean;
}

export function SectionTitle({
  label,
  title,
  subtitle,
  align = 'left',
  className,
  animate = true,
}: SectionTitleProps) {
  const Wrapper = animate ? motion.div : 'div';
  const motionProps = animate
    ? { variants: fadeUpVariants, initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-60px' } }
    : {};

  return (
    <Wrapper
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className
      )}
      {...(motionProps as object)}
    >
      {label && (
        <span className="type-label">
          {label}
        </span>
      )}
      <h2 className="type-h2 text-[var(--color-text-primary)]">{title}</h2>
      {subtitle && (
        <p className="type-lead max-w-xl">{subtitle}</p>
      )}
    </Wrapper>
  );
}
