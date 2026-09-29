'use client';

import LanguageIcon from '@mui/icons-material/Language';
import { languageConfig } from '@/i18n/config';
import type { Language } from '@/i18n';
import { cn } from '@/lib/cn';
import { useLanguage } from '../LanguageProvider';

const languages: Language[] = ['portuguese', 'english'];

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, translations, setLanguage } = useLanguage();

  return (
    <div
      aria-label={translations.language.label}
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
      {languages.map((item) => {
        const active = language === item;
        const label =
          item === 'portuguese'
            ? translations.language.switchToPortuguese
            : translations.language.switchToEnglish;

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
            onClick={() => setLanguage(item)}
            type="button"
          >
            {languageConfig[item].shortLabel}
          </button>
        );
      })}
    </div>
  );
}
