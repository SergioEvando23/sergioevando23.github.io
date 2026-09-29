'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { dictionary, type Language, type TranslatedContent } from '@/i18n';
import {
  getLanguageFromLocale,
  isLanguage,
  languageConfig,
  LANGUAGE_STORAGE_KEY,
} from '@/i18n/config';

interface LanguageContextValue {
  language: Language;
  translations: TranslatedContent;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
}

function resolveStoredLanguage(): Language {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (isLanguage(stored)) {
    return stored;
  }

  return getLanguageFromLocale(window.navigator.language);
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('portuguese');
  const [initialized, setInitialized] = useState(false);
  const translations = dictionary[language];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLanguageState(resolveStoredLanguage());
      setInitialized(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.lang = languageConfig[language].htmlLang;

    if (initialized) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language, initialized]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setInitialized(true);
    setLanguageState(nextLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    setInitialized(true);
    setLanguageState((current) => (current === 'portuguese' ? 'english' : 'portuguese'));
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      translations,
      setLanguage,
      toggleLanguage,
    }),
    [language, setLanguage, toggleLanguage, translations],
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
