import { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/i18n'

// Function to fetch blog posts for dynamic sitemap
async function fetchBlogPosts() {
  try {
    const response = await fetch('https://translatex-production-fb26.up.railway.app/api/blogs', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.warn('Failed to fetch blog posts for sitemap')
      return []
    }
    
    const posts = await response.json()
    return posts.filter((post: any) => post.published)
  } catch (error) {
    console.warn('Error fetching blog posts for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.translexable.io'

  // Define all the static pages in your app
  const staticPages = [
    '', // home page
    '/about',
    '/pricing',
    '/blogs',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/dashboard',
    '/profile',
    '/history',
    '/translate-txt',
    '/translate-docs',
    '/test-payment',
    '/payment/success',
    '/payment/failure',
    '/terms-and-conditions',
    '/privacy-policy',
    '/refund-policy',
    '/shipping-policy',
  ]

  // Admin pages (lower priority)
  const adminPages = [
    '/admin',
    '/admin/users',
    '/admin/blogs',
    '/admin/transactions',
  ]

  // Fetch dynamic blog posts
  const blogPosts = await fetchBlogPosts()

  // Generate sitemap entries for all locales
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add pages for each locale
  locales.forEach((locale) => {
    // Static pages
    staticPages.forEach((page) => {
      const url = locale === defaultLocale 
        ? `${baseUrl}${page}` 
        : `${baseUrl}/${locale}${page}`
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: getPriority(page),
        alternates: {
          languages: getAlternateLanguages(page, baseUrl),
        },
      })
    })

    // Admin pages (lower priority)
    adminPages.forEach((page) => {
      const url = locale === defaultLocale 
        ? `${baseUrl}${page}` 
        : `${baseUrl}/${locale}${page}`
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
        alternates: {
          languages: getAlternateLanguages(page, baseUrl),
        },
      })
    })

    // Add dynamic blog posts
    blogPosts.forEach((post: any) => {
      const url = locale === defaultLocale 
        ? `${baseUrl}/blogs/${post.id}` 
        : `${baseUrl}/${locale}/blogs/${post.id}`
      
      sitemapEntries.push({
        url,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: getAlternateLanguages(`/blogs/${post.id}`, baseUrl),
        },
      })
    })
  })

  return sitemapEntries
}

function getPriority(page: string): number {
  switch (page) {
    case '': // home page
      return 1.0
    case '/about':
    case '/pricing':
      return 0.9
    case '/blogs':
    case '/login':
    case '/register':
      return 0.8
    case '/dashboard':
    case '/translate-txt':
    case '/translate-docs':
      return 0.7
    default:
      return 0.5
  }
}

function getAlternateLanguages(page: string, baseUrl: string): Record<string, string> {
  const alternates: Record<string, string> = {}
  
  locales.forEach((locale) => {
    const url = locale === defaultLocale 
      ? `${baseUrl}${page}` 
      : `${baseUrl}/${locale}${page}`
    alternates[locale] = url
  })

  return alternates
} 