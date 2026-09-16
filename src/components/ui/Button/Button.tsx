import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  className?: string;
  children: ReactNode;
}

type NativeButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = ButtonBaseProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export type ButtonProps = NativeButtonProps | LinkButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary-hover',
  secondary:
    'border border-border bg-surface-secondary text-text hover:border-primary hover:text-primary',
  ghost: 'text-text-muted hover:bg-surface-secondary hover:text-text',
};

const sizeClasses: Record<ButtonSize, string> = {
  small: 'min-h-10 px-4 text-sm',
  medium: 'min-h-11 px-5 text-sm',
  large: 'min-h-12 px-6 text-base',
};

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'medium',
    leftIcon,
    rightIcon,
    loading = false,
    className,
    children,
  } = props;

  const content = (
    <>
      {loading ? (
        <CircularProgress aria-hidden="true" color="inherit" size={18} thickness={5} />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {rightIcon}
    </>
  );

  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-full)] font-semibold transition-colors duration-[var(--transition-fast)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ('href' in props && props.href) {
    const { href, target, rel, onClick } = props;

    return (
      <Link
        className={classes}
        href={href}
        onClick={onClick}
        rel={rel ?? (target === '_blank' ? 'noreferrer' : undefined)}
        target={target}
      >
        {content}
      </Link>
    );
  }

  const nativeProps = props as NativeButtonProps;
  const { disabled, type = 'button', ...buttonProps } = nativeProps;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      type={type}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
