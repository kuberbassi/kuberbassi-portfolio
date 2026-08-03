import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ScrollRevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}

export function ScrollRevealText({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: ScrollRevealTextProps) {
  return (
    <Tag className={cn('overflow-hidden inline-block', className)}>
      <motion.span
        initial={{ y: '100%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.215, 0.61, 0.355, 1],
        }}
        className="block"
      >
        {children}
      </motion.span>
    </Tag>
  );
}
