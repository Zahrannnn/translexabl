import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.translexable.io'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/en/',
          '/fr/',
          '/ar/',
          '/about',
          '/pricing',
          '/blogs',
          '/login',
          '/register',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/profile/',
          '/history/',
          '/translate-txt/',
          '/translate-docs/',
          '/test-payment/',
          '/test-translate-gemini/',
          '/payment/',
          '/forgot-password/',
          '/reset-password/',
          '/verify-email/',
          '/uploads/',
          '/_next/',
          '/ngrok.exe',
          '*.pdf',
          '*.srt',
          '/scripts/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/en/',
          '/fr/',
          '/ar/',
          '/about',
          '/pricing',
          '/blogs',
          '/login',
          '/register',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/profile/',
          '/history/',
          '/translate-txt/',
          '/translate-docs/',
          '/test-payment/',
          '/test-translate-gemini/',
          '/payment/',
          '/uploads/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 