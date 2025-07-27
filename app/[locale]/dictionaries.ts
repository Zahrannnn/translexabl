import 'server-only';

const dictionaries = {
  en: () => import('../../messages/en.json').then((module) => module.default),
  fr: () => import('../../messages/fr.json').then((module) => module.default),
  ar: () => import('../../messages/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'fr' | 'ar') =>
  dictionaries[locale](); 