import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { OrganizationStructuredData, WebsiteStructuredData, ServiceStructuredData } from '@/components/seo/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'TransleXable | Professional Translation Platform',
    template: '%s | TransleXable'
  },
  description: 'Professional Translation Platform using DeepL API and Gemini AI',
  keywords: ['translation', 'AI translation', 'document translation', 'professional translation'],
  authors: [{ name: 'TransleXable Team' }],
  creator: 'TransleXable',
  publisher: 'TransleXable',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.translexable.io'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'fr': '/fr',
      'ar': '/ar',
    },
  },
  openGraph: {
    title: 'TransleXable | Professional Translation Platform',
    description: 'Professional Translation Platform using DeepL API and Gemini AI',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.translexable.io',
    siteName: 'TransleXable',
    locale: 'en',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TransleXable - Professional Translation Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TransleXable | Professional Translation Platform',
    description: 'Professional Translation Platform using DeepL API and Gemini AI',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OrganizationStructuredData />
        <WebsiteStructuredData />
        <ServiceStructuredData />
        {children}
      </body>
    </html>
  )
}
