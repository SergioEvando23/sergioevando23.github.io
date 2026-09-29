import type { Language } from './dictionary';

export const LANGUAGE_STORAGE_KEY = 'Sérgio-portfolio-language';

export const languageConfig = {
  portuguese: {
    code: 'pt',
    htmlLang: 'pt-BR',
    shortLabel: 'PT',
    fullLabel: 'Portugues',
  },
  english: {
    code: 'en',
    htmlLang: 'en',
    shortLabel: 'EN',
    fullLabel: 'English',
  },
} as const satisfies Record<
  Language,
  {
    code: string;
    htmlLang: string;
    shortLabel: string;
    fullLabel: string;
  }
>;

export function isLanguage(value: unknown): value is Language {
  return value === 'portuguese' || value === 'english';
}

export function getLanguageFromLocale(locale: string | undefined): Language {
  return locale?.toLowerCase().startsWith('pt') ? 'portuguese' : 'english';
}
