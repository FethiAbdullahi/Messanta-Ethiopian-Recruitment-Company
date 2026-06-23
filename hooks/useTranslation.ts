'use client';

import { useLanguage, Locale } from '@/contexts/LanguageContext';

export function useTranslation() {
  const { locale, setLocale, t, isRTL } = useLanguage();

  return {
    t,
    currentLanguage: locale,
    changeLanguage: setLocale,
    isRTL,
  };
}

export type { Locale };

