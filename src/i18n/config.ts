import type { Idioma } from './dicionario';

export const LANGUAGE_STORAGE_KEY = 'Sérgio-portfolio-language';

export const idiomaConfig = {
  portugues: {
    code: 'pt',
    htmlLang: 'pt-BR',
    shortLabel: 'PT',
    fullLabel: 'Portugues',
  },
  ingles: {
    code: 'en',
    htmlLang: 'en',
    shortLabel: 'EN',
    fullLabel: 'English',
  },
} as const satisfies Record<
  Idioma,
  {
    code: string;
    htmlLang: string;
    shortLabel: string;
    fullLabel: string;
  }
>;

export function isIdioma(value: unknown): value is Idioma {
  return value === 'portugues' || value === 'ingles';
}

export function getIdiomaFromLocale(locale: string | undefined): Idioma {
  return locale?.toLowerCase().startsWith('pt') ? 'portugues' : 'ingles';
}
