import { NextIntlClientProvider } from 'next-intl';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { locales, Locale } from '@/i18n';
import Providers from "@/app/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { RTLProvider } from "@/components/ui/rtl-provider";
import { Outfit, Fira_Code } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { OrganizationStructuredData, WebsiteStructuredData, ServiceStructuredData } from '@/components/seo/StructuredData';

function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as 'en' | 'fr' | 'ar');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.translexable.io';
  
  return {
    title: dict?.app?.title ? `${dict.app.title} - ${dict.app.description}` : "TransleXable - Professional Translation Platform",
    description: "Translate text and documents with precision using DeepL API and Gemini AI. Features tone control, glossary terms, grammar review, and human review.",
    keywords: ["translation", "DeepL", "Gemini AI", "document translation", "professional translation"],
    authors: [{ name: "TransleXable Team" }],
    openGraph: {
      title: dict?.app?.title ? `${dict.app.title} - ${dict.app.description}` : "TransleXable - Professional Translation Platform",
      description: "Translate text and documents with precision using DeepL API and Gemini AI.",
      type: "website",
      locale: locale,
      url: `${baseUrl}/${locale}`,
      siteName: "TransleXable",
    },
    twitter: {
      card: "summary_large_image",
      title: dict?.app?.title ? `${dict.app.title} - ${dict.app.description}` : "TransleXable - Professional Translation Platform",
      description: "Translate text and documents with precision using DeepL API and Gemini AI.",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
        'ar': `${baseUrl}/ar`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    return null; // or redirect to 404
  }

  const direction = getDirection(locale as Locale);
  // Load messages for next-intl client components
  const messages = await getDictionary(locale as 'en' | 'fr' | 'ar');

  return (
    <html lang={locale} dir={direction} className="dark">
      <body
        className={`${outfit.variable} ${firaCode.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RTLProvider>
            <Providers>
              <Navbar />
              <main className="flex-1">
                {children}
                <Analytics />
                <SpeedInsights />
                {/* <Blocked /> */}
              </main>
              <Footer />
              <Toaster />
            </Providers>
          </RTLProvider>
        </NextIntlClientProvider>
        <OrganizationStructuredData />
        <WebsiteStructuredData />
        <ServiceStructuredData />
      </body>
    </html>
  );
} 