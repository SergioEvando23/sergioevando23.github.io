'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { dicionario, type ConteudoTraduzido, type Idioma } from '@/i18n/dicionario';
import {
  getIdiomaFromLocale,
  idiomaConfig,
  isIdioma,
  LANGUAGE_STORAGE_KEY,
} from '@/i18n/config';

interface LanguageContextValue {
  idioma: Idioma;
  textos: ConteudoTraduzido;
  alterarIdioma: (idioma: Idioma) => void;
  alternarIdioma: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
}

function resolveStoredIdioma(): Idioma {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (isIdioma(stored)) {
    return stored;
  }

  return getIdiomaFromLocale(window.navigator.language);
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [idioma, setIdioma] = useState<Idioma>('portugues');
  const [initialized, setInitialized] = useState(false);
  const textos = dicionario[idioma];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIdioma(resolveStoredIdioma());
      setInitialized(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.lang = idiomaConfig[idioma].htmlLang;

    if (initialized) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, idioma);
    }
  }, [idioma, initialized]);

  const alterarIdioma = useCallback((nextIdioma: Idioma) => {
    setInitialized(true);
    setIdioma(nextIdioma);
  }, []);

  const alternarIdioma = useCallback(() => {
    setInitialized(true);
    setIdioma((current) => (current === 'portugues' ? 'ingles' : 'portugues'));
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      idioma,
      textos,
      alterarIdioma,
      alternarIdioma,
    }),
    [alterarIdioma, alternarIdioma, idioma, textos],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}
