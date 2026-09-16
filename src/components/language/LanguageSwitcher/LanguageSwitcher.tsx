'use client';

import LanguageIcon from '@mui/icons-material/Language';
import { idiomaConfig } from '@/i18n/config';
import type { Idioma } from '@/i18n/dicionario';
import { cn } from '@/lib/cn';
import { useLanguage } from '../LanguageProvider';

const idiomas: Idioma[] = ['portugues', 'ingles'];

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { idioma, textos, alterarIdioma } = useLanguage();

  return (
    <div
      aria-label={textos.language.label}
      className={cn(
        'inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-full)] border border-border bg-overlay p-1 text-sm font-bold shadow-[var(--shadow-card)] backdrop-blur',
        className,
      )}
      role="group"
    >
      <LanguageIcon
        aria-hidden="true"
        className="ml-2 hidden text-text-muted sm:block"
        fontSize="small"
      />
      {idiomas.map((item) => {
        const active = idioma === item;
        const label =
          item === 'portugues'
            ? textos.language.switchToPortuguese
            : textos.language.switchToEnglish;

        return (
          <button
            aria-label={label}
            aria-pressed={active}
            className={cn(
              'min-h-9 rounded-[var(--radius-full)] px-3 text-text-muted transition-colors duration-[var(--transition-fast)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent hover:text-text',
              active &&
                'bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:text-primary-foreground',
            )}
            key={item}
            onClick={() => alterarIdioma(item)}
            type="button"
          >
            {idiomaConfig[item].shortLabel}
          </button>
        );
      })}
    </div>
  );
}
