import en from './i18n/locales/en.json';
import am from './i18n/locales/am.json';
import ar from './i18n/locales/ar.json';
import { Language } from './types';
import { normalizeLanguage } from './i18n/config';

export type TranslationDictionary = typeof en;
export type TranslationKey = keyof TranslationDictionary;

export const translations = {
  en,
  am,
  ar,
  EN: en,
  AM: am,
  AR: ar,
} as const;

export const getTranslation = (lang?: Language): TranslationDictionary => {
  const norm = normalizeLanguage(lang as string);
  return translations[norm] || translations.en;
};

export default translations;
