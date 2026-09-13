import { LanguageOption, StandardLanguage } from '../types';

export const LANGUAGE_STORAGE_KEY = 'delta_language';
export const LEGACY_STORAGE_KEY = 'delta_lang';

export const LANGUAGES: Record<StandardLanguage, LanguageOption> = {
  en: {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    dir: 'ltr',
    flag: '🇬🇧',
    fontClass: 'font-sans'
  },
  am: {
    code: 'am',
    label: 'Amharic',
    nativeLabel: 'አማርኛ',
    dir: 'ltr',
    flag: '🇪🇹',
    fontClass: 'font-amharic'
  },
  ar: {
    code: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    dir: 'rtl',
    flag: '🇸🇦',
    fontClass: 'font-arabic'
  }
};

export const DEFAULT_LANGUAGE: StandardLanguage = 'en';

/**
 * Normalizes any language code (case-insensitive, e.g. 'EN', 'ar-SA') to standard code: 'en' | 'am' | 'ar'
 */
export function normalizeLanguage(lang: string | null | undefined): StandardLanguage {
  if (!lang) return DEFAULT_LANGUAGE;
  const clean = lang.trim().toLowerCase();
  if (clean.startsWith('am')) return 'am';
  if (clean.startsWith('ar')) return 'ar';
  if (clean.startsWith('en')) return 'en';
  return DEFAULT_LANGUAGE;
}

/**
 * Detects initial language from localStorage or user's browser preferences
 */
export function getInitialLanguage(): StandardLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    // 1. Check local storage
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved) {
      return normalizeLanguage(saved);
    }

    // 2. Detect browser languages list
    if (navigator.languages && navigator.languages.length > 0) {
      for (const l of navigator.languages) {
        const norm = normalizeLanguage(l);
        if (l.toLowerCase().startsWith('am') || l.toLowerCase().startsWith('ar')) {
          return norm;
        }
      }
    }

    // 3. Detect primary browser language
    if (navigator.language) {
      const norm = normalizeLanguage(navigator.language);
      if (norm === 'am' || norm === 'ar') {
        return norm;
      }
    }
  } catch (e) {
    console.warn('Could not detect or load language preference:', e);
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Updates <html> and <body> attributes dynamically for SEO, RTL, and typography
 */
export function applyHtmlLanguageAttributes(lang: StandardLanguage): void {
  if (typeof document === 'undefined') return;

  const config = LANGUAGES[lang] || LANGUAGES.en;

  // Update root <html> element
  const html = document.documentElement;
  html.setAttribute('lang', config.code);
  html.setAttribute('dir', config.dir);

  // Update body classes for typography fallback
  document.body.classList.remove('font-sans', 'font-arabic', 'font-amharic');
  document.body.classList.add(config.fontClass);
}
