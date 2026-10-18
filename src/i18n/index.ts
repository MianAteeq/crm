import { create } from 'zustand';

// Import raw dictionary assets
import mainEn from './locales/main/en.json';
import mainAr from './locales/main/ar-SA.json';
import runtimeEn from './locales/runtime/en.json';
import runtimeAr from './locales/runtime/ar-SA.json';
import legalEn from './locales/legal/en.json';
import legalAr from './locales/legal/ar-SA.json';

export type SupportedLocale = 'en' | 'ar-SA';

export interface LocaleMeta {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag: string;
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleMeta> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    flag: '🇺🇸',
  },
  'ar-SA': {
    code: 'ar-SA',
    name: 'Arabic (Saudi Arabia)',
    nativeName: 'العربية',
    dir: 'rtl',
    flag: '🇸🇦',
  },
};

// Merged dictionaries
const dictionaries: Record<SupportedLocale, Record<string, string>> = {
  en: {
    ...mainEn,
    ...runtimeEn,
    ...legalEn,
  },
  'ar-SA': {
    ...mainAr,
    ...runtimeAr,
    ...legalAr,
  },
};

const STORAGE_KEY = 'throb_locale';

// Read saved locale or default to 'ar-SA' (Saudi Arabic default)
export function getSavedLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'ar-SA';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLocale;
    if (saved && (saved === 'en' || saved === 'ar-SA')) {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to access localStorage for locale', e);
  }
  return 'ar-SA'; // Default language is Saudi Arabic
}

// Sync document element attributes
export function applyDocumentLocale(locale: SupportedLocale) {
  if (typeof document === 'undefined') return;
  const isRtl = locale === 'ar-SA';
  const html = document.documentElement;

  html.lang = locale;
  html.dir = isRtl ? 'rtl' : 'ltr';

  if (isRtl) {
    html.classList.add('rtl');
    html.classList.remove('ltr');
  } else {
    html.classList.add('ltr');
    html.classList.remove('rtl');
  }
}

// Arabic pluralization rules: zero, one, two, few (3-10), many (11-99), other
const arPluralRules = typeof Intl !== 'undefined' && Intl.PluralRules ? new Intl.PluralRules('ar-SA') : null;
const enPluralRules = typeof Intl !== 'undefined' && Intl.PluralRules ? new Intl.PluralRules('en') : null;

interface I18nState {
  locale: SupportedLocale;
  isRtl: boolean;
  setLocale: (locale: SupportedLocale) => void;
  toggleLocale: () => void;
  t: (key: string, paramsOrFallback?: Record<string, any> | string, fallback?: string) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
}

export const useI18n = create<I18nState>((set, get) => {
  const initialLocale = getSavedLocale();
  applyDocumentLocale(initialLocale);

  return {
    locale: initialLocale,
    isRtl: initialLocale === 'ar-SA',

    setLocale: (newLocale: SupportedLocale) => {
      if (newLocale !== 'en' && newLocale !== 'ar-SA') return;
      try {
        localStorage.setItem(STORAGE_KEY, newLocale);
      } catch (e) {
        console.warn('Failed to save locale to localStorage', e);
      }
      applyDocumentLocale(newLocale);
      set({
        locale: newLocale,
        isRtl: newLocale === 'ar-SA',
      });
    },

    toggleLocale: () => {
      const next = get().locale === 'en' ? 'ar-SA' : 'en';
      get().setLocale(next);
    },

    t: (key: string, paramsOrFallback?: Record<string, any> | string, fallback?: string): string => {
      const { locale } = get();
      const currentDict = dictionaries[locale] || dictionaries['ar-SA'];
      let template = currentDict[key];

      const resolvedFallback = typeof paramsOrFallback === 'string' ? paramsOrFallback : fallback;
      const params = typeof paramsOrFallback === 'object' && paramsOrFallback !== null ? paramsOrFallback : undefined;

      // Fallback if key missing in current locale
      if (template === undefined) {
        template = dictionaries[locale === 'ar-SA' ? 'en' : 'ar-SA']?.[key];
      }

      // If still missing, return fallback or key
      if (template === undefined) {
        return resolvedFallback !== undefined ? resolvedFallback : key;
      }

      // If no parameters, return string directly
      if (!params) {
        return template;
      }

      // Interpolation: replace {{param}} or {param}
      return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}|\{\s*([a-zA-Z0-9_]+)\s*\}/g, (match, p1, p2) => {
        const paramKey = p1 || p2;
        if (params[paramKey] !== undefined) {
          const val = params[paramKey];
          // If value is a number, format using latin numerals
          if (typeof val === 'number') {
            return get().formatNumber(val);
          }
          return String(val);
        }
        return match;
      });
    },

    formatNumber: (value: number, options?: Intl.NumberFormatOptions): string => {
      const { locale } = get();
      try {
        // Enforce Latin numerals (0-9) as specified in package guide for consistency
        return new Intl.NumberFormat(locale, {
          numberingSystem: 'latn',
          ...options,
        }).format(value);
      } catch (e) {
        return String(value);
      }
    },

    formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
      const { locale } = get();
      try {
        const d = date instanceof Date ? date : new Date(date);
        return new Intl.DateTimeFormat(locale, {
          calendar: 'gregory',
          numberingSystem: 'latn',
          ...options,
        }).format(d);
      } catch (e) {
        return String(date);
      }
    },
  };
});

// Standalone translation function for non-React contexts
export function t(key: string, paramsOrFallback?: Record<string, any> | string, fallback?: string): string {
  return useI18n.getState().t(key, paramsOrFallback, fallback);
}

// Hook alias for standard localization naming convention
export const useTranslation = useI18n;

