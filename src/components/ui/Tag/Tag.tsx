import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type TagVariant = 'default' | 'primary' | 'accent' | 'success';

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
}

const variantClasses: Record<TagVariant, string> = {
  default: 'border-border bg-surface-secondary text-text-muted',
  primary:
    'border-primary/30 bg-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] text-primary',
  accent:
    'border-accent/30 bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)] text-accent',
  success:
    'border-success/30 bg-[color-mix(in_srgb,var(--color-success)_14%,transparent)] text-success',
};

export function Tag({ variant = 'default', className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-full)] border px-3 py-1 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
