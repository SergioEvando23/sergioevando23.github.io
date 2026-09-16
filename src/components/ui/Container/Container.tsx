import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

const sizeClasses: Record<NonNullable<ContainerProps['size']>, string> = {
  narrow: 'max-w-4xl',
  default: 'max-w-[var(--container-width)]',
  wide: 'max-w-[1440px]',
};

export function Container({
  as: Component = 'div',
  children,
  className,
  size = 'default',
}: ContainerProps) {
  return (
    <Component
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}
    >
      {children}
    </Component>
  );
}
