import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type IconButtonSize = 'small' | 'medium' | 'large';
type IconButtonVariant = 'default' | 'primary' | 'ghost';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  children: ReactNode;
}

const sizeClasses: Record<IconButtonSize, string> = {
  small: 'h-10 min-h-10 w-10 min-w-10 text-[1.2rem]',
  medium: 'h-11 min-h-11 w-11 min-w-11 text-[1.35rem]',
  large: 'h-12 min-h-12 w-12 min-w-12 text-[1.5rem]',
};

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    'border border-border bg-surface text-text-muted hover:border-primary hover:text-primary',
  primary:
    'bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary-hover',
  ghost: 'text-text-muted hover:bg-surface-secondary hover:text-text',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      label,
      size = 'medium',
      variant = 'default',
      className,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) {
    return (
      <button
        aria-label={label}
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-[var(--radius-full)] transition-colors duration-[var(--transition-fast)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      >
        {children}
      </button>
    );
  },
);
