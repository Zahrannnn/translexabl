import type { Metadata } from "next";
import { Outfit, Fira_Code } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TransleXable - Professional Translation Platform",
  description: "Translate text and documents with precision using DeepL API and Gemini AI. Features tone control, glossary terms, grammar review, and human review.",
  keywords: ["translation", "DeepL", "Gemini AI", "document translation", "professional translation"],
  authors: [{ name: "TransleXable Team" }],
  openGraph: {
    title: "TransleXable - Professional Translation Platform",
    description: "Translate text and documents with precision using DeepL API and Gemini AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${firaCode.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
