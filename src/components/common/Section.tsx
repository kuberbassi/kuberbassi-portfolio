import React from 'react';
import { cn } from '../../utils/cn';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  size?: 'sm' | 'default' | 'lg';
  as?: React.ElementType;
}

const sizeMap = {
  sm:      'section-sm',
  default: 'section',
  lg:      'section-lg',
};

export function Section({ children, className, id, size = 'default', as: Tag = 'section' }: SectionProps) {
  return (
    <Tag id={id} className={cn(sizeMap[size], className)}>
      {children}
    </Tag>
  );
}
