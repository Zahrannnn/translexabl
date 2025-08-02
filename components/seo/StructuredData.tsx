import Script from 'next/script'

interface StructuredDataProps {
  data: Record<string, any>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}

export function OrganizationStructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TransleXable",
    "description": "Professional Translation Platform using DeepL API and Gemini AI",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://www.translexable.io",
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.translexable.io"}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "Worldwide",
      "availableLanguage": ["English", "French", "Arabic"]
    },
    "sameAs": [
      // Add your social media links here
      // "https://twitter.com/translexable",
      // "https://linkedin.com/company/translexable"
    ],
    "offers": {
      "@type": "Offer",
      "category": "Translation Services",
      "description": "Professional document and text translation services"
    }
  }

  return <StructuredData data={organizationData} />
}

export function WebsiteStructuredData() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TransleXable",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://www.translexable.io",
    "description": "Professional Translation Platform using DeepL API and Gemini AI",
    "inLanguage": ["en", "fr", "ar"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.translexable.io"}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }

  return <StructuredData data={websiteData} />
}

export function ServiceStructuredData() {
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Professional Translation Services",
    "description": "Translate text and documents with precision using DeepL API and Gemini AI. Features tone control, glossary terms, grammar review, and human review.",
    "provider": {
      "@type": "Organization",
      "name": "TransleXable",
      "url": process.env.NEXT_PUBLIC_BASE_URL || "https://www.translexable.io"
    },
    "serviceType": "Translation Services",
    "offers": {
      "@type": "Offer",
      "category": "Professional Translation",
      "description": "Document and text translation services with multiple AI models"
    },
    "areaServed": "Worldwide",
    "availableLanguage": ["English", "French", "Arabic"]
  }

  return <StructuredData data={serviceData} />
} 