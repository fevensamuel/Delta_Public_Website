import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Language, LanguageOption, StandardLanguage } from '../types';
import { 
  LANGUAGES, 
  LANGUAGE_STORAGE_KEY, 
  getInitialLanguage, 
  normalizeLanguage, 
  applyHtmlLanguageAttributes 
} from './config';
import { translations, TranslationDictionary, TranslationKey } from '../translations';

interface LanguageContextType {
  language: StandardLanguage;
  setLanguage: (lang: Language) => void;
  currentOption: LanguageOption;
  isRtl: boolean;
  dir: 'ltr' | 'rtl';
  t: (key: TranslationKey | string, fallback?: string) => string;
  dict: TranslationDictionary;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<StandardLanguage>(() => getInitialLanguage());

  // Apply HTML lang, dir, and font classes whenever language changes
  useEffect(() => {
    applyHtmlLanguageAttributes(language);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (e) {
      console.warn('Unable to persist language to localStorage:', e);
    }
  }, [language]);

  const setLanguage = (newLang: Language) => {
    const normalized = normalizeLanguage(newLang);
    setLanguageState(normalized);
  };

  const currentOption = useMemo(() => LANGUAGES[language] || LANGUAGES.en, [language]);
  const isRtl = currentOption.dir === 'rtl';
  const dir = currentOption.dir;

  const dict = useMemo(() => {
    return translations[language] || translations.en;
  }, [language]);

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const value = (dict as Record<string, string>)[key];
    if (value !== undefined) return value;
    const fallbackVal = (translations.en as Record<string, string>)[key];
    if (fallbackVal !== undefined) return fallbackVal;
    return fallback || key;
  };

  const languagesList = useMemo(() => Object.values(LANGUAGES), []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      currentOption,
      isRtl,
      dir,
      t,
      dict,
      languages: languagesList
    }),
    [language, currentOption, isRtl, dir, dict, languagesList]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t, dict, language, isRtl, dir, setLanguage } = useLanguage();
  return { t, dict, language, isRtl, dir, setLanguage };
};
