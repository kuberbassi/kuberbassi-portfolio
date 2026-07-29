import React from 'react';
import { cn } from '../../utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
  as?: React.ElementType;
}

export function Container({ children, className, narrow = false, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={cn(narrow ? 'container-narrow' : 'container', className)}>
      {children}
    </Tag>
  );
}
