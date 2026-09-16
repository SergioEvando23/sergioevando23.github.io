import type { ElementType } from 'react';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  level?: 1 | 2 | 3;
  className?: string;
}

const headingLevels: Record<NonNullable<SectionHeadingProps['level']>, ElementType> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  level = 2,
  className,
}: SectionHeadingProps) {
  const Heading = headingLevels[level];

  return (
    <div
      className={cn(
        'flex max-w-3xl flex-col gap-3',
        align === 'center' && 'mx-auto items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-3xl font-bold text-text sm:text-4xl">{title}</Heading>
      {description ? (
        <p className="text-base leading-7 text-text-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
