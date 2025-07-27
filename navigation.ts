'use client';

import { useRouter as useNextRouter, usePathname as useNextPathname } from 'next/navigation';
import Link from 'next/link';
import { locales, defaultLocale } from './i18n';

// Re-export Next.js Link and navigation hooks
export { Link };

// Custom router hook that handles locale in navigation
export function useRouter() {
  const nextRouter = useNextRouter();
  
  return {
    ...nextRouter,
    // Override push to include locale
    push: (href: string, options?: { scroll?: boolean }) => {
      nextRouter.push(href, options);
    },
    // Override replace to include locale
    replace: (href: string, options?: { scroll?: boolean }) => {
      nextRouter.replace(href, options);
    }
  };
}

// Re-export pathname hook
export function usePathname() {
  return useNextPathname();
}

// Helper function to change locale
export function changeLocale(locale: string, pathname: string) {
  // Remove existing locale from pathname if present
  let newPathname = pathname;
  for (const loc of locales) {
    if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
      newPathname = pathname.replace(`/${loc}`, '');
      break;
    }
  }
  
  // Add new locale to pathname
  if (locale === defaultLocale) {
    return newPathname || '/';
  }
  
  return `/${locale}${newPathname}`;
} 