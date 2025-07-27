import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Get the preferred locale, similar to above or using a library
function getLocale(request: NextRequest) {
  // Check for cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // Then check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // Simple parsing of Accept-Language header
    // In a real app, you might want to use a library like accept-language-parser
    const languages = acceptLanguage.split(',').map(lang => {
      const [language, quality = '1'] = lang.trim().split(';q=');
      return { language: language.split('-')[0], quality: parseFloat(quality) };
    }).sort((a, b) => b.quality - a.quality);

    // Find the first language that matches our locales
    for (const { language } of languages) {
      const matchedLocale = locales.find(locale => locale === language || locale.startsWith(`${language}-`));
      if (matchedLocale) return matchedLocale;
    }
  }

  // Default to the default locale
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip internal paths and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  
  // Copy search params
  request.nextUrl.searchParams.forEach((value, key) => {
    newUrl.searchParams.set(key, value);
  });

  // Set locale cookie for future requests
  const response = NextResponse.redirect(newUrl);
  response.cookies.set('NEXT_LOCALE', locale, { 
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return response;
}

// Match all paths except for static files
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}; 