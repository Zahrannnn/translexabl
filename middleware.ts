import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';
import { getProjectStatusSafe } from './lib/project-status';

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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip internal paths and API routes (except project-status)
  if (
    pathname.startsWith('/_next') ||
    (pathname.includes('/api/') && !pathname.includes('/api/translate') && !pathname.includes('/api/user')) ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Check project status for critical routes (translation, user operations)
  const criticalRoutes = [
    '/api/translate',
    '/api/translate-document',
    '/api/translate-gemini',
    '/api/user',
    '/api/paymob'
  ];

  const isCriticalRoute = criticalRoutes.some(route => pathname.includes(route));

  if (isCriticalRoute) {
    try {
      const projectStatus = await getProjectStatusSafe(3);
      
      if (!projectStatus.isActive) {
        return NextResponse.json(
          {
            error: 'Project access denied',
            message: 'Project access has been disabled. Please contact support.',
            projectName: projectStatus.projectName
          },
          { status: 403 }
        );
      }
    } catch (error) {
      // Log error but don't block access if status check fails
      console.error('Project status check failed:', error);
      // You could choose to block access here too if you want to be more strict
    }
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