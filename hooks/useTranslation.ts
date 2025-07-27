'use client';

import { useTranslations as useNextIntlTranslations, useLocale } from 'next-intl';

export function useTranslation(namespace: string) {
  try {
    const locale = useLocale();
    const t = useNextIntlTranslations(namespace);

    return {
      t,
      locale,
      isRtl: locale === 'ar',
      dir: locale === 'ar' ? 'rtl' : 'ltr',
    };
  } catch (error) {
    // Fallback for when the context is not available
    return {
      t: (key: string) => key, // Return the key as fallback
      locale: 'en',
      isRtl: false,
      dir: 'ltr',
    };
  }
} 