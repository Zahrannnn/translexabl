import { Outfit, Fira_Code } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import Providers from "../providers";
import { NextIntlClientProvider } from 'next-intl';
import { getDirection, locales, type Locale } from '@/i18n';
import { RTLProvider } from "@/components/ui/rtl-provider";
import { getDictionary } from './dictionaries';
import Blocked from "@/components/Blocked";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

// Function to check program status from API
async function getProgramStatus(): Promise<boolean> {
  try {
    const response = await fetch('https://valid-app-production.up.railway.app/api/programs/3', {
      cache: 'no-store', // Ensure we get fresh data each time
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      console.error('Program status API responded with:', response.status);
      return false; // If API fails, default to blocked
    }
    
    const data = await response.json();
    console.log('Program status response:', data);
    return data?.data?.is_active === true;
  } catch (error) {
    console.error('Failed to fetch program status:', error);
    return false; // If any error occurs, default to blocked
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as 'en' | 'fr' | 'ar');
  
  return {
    title: dict?.app?.title ? `${dict.app.title} - ${dict.app.description}` : "TransleXable - Professional Translation Platform",
    description: "Translate text and documents with precision using DeepL API and Gemini AI. Features tone control, glossary terms, grammar review, and human review.",
    keywords: ["translation", "DeepL", "Gemini AI", "document translation", "professional translation"],
    authors: [{ name: "TransleXable Team" }],
    openGraph: {
      title: dict?.app?.title ? `${dict.app.title} - ${dict.app.description}` : "TransleXable - Professional Translation Platform",
      description: "Translate text and documents with precision using DeepL API and Gemini AI.",
      type: "website",
      locale: locale
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
  
  // Check program status from API
  const isProgramActive = await getProgramStatus();

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
                {!isProgramActive ? <Blocked /> : children}  
              </main>
              <Footer />
              <Toaster />
            </Providers>
          </RTLProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 