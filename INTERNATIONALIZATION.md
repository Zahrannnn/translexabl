# Internationalization (i18n) in TransleXable

This document provides an overview of how internationalization is implemented in the TransleXable application.

## Overview

TransleXable uses a combination of next-intl for translations and native Next.js routing for internationalization, which provides:

- Locale-based routing with URL paths (e.g., /en/about, /ar/about)
- Translation management with namespaces
- RTL support for languages like Arabic
- Automatic locale detection based on user preferences

## Supported Languages

Currently, the application supports the following languages:

- English (en) - Default
- Arabic (ar)
- French (fr)

## Directory Structure

The internationalization system is organized as follows:

```
├── app/
│   ├── [locale]/           # Locale-specific routes
│   │   ├── layout.tsx      # Locale-specific layout with NextIntlProvider
│   │   ├── page.tsx        # Home page with translations
│   │   └── ...             # Other locale-specific pages
├── components/
│   ├── ui/
│   │   ├── language-switcher.tsx  # Language switcher component
│   │   └── rtl-provider.tsx       # RTL support for Arabic
├── hooks/
│   └── useTranslation.ts   # Custom hook for easier translation access
├── messages/
│   ├── en.json             # English translations
│   ├── ar.json             # Arabic translations
│   └── fr.json             # French translations
├── i18n.ts                 # i18n configuration
├── middleware.ts           # Middleware for locale detection and routing
└── navigation.ts           # Navigation utilities for internationalized routing
```

## How to Use Translations

### In Server Components

```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyServerComponent({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'namespace' });
  
  return <h1>{t('title')}</h1>;
}
```

### In Client Components

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyClientComponent() {
  const t = useTranslations('namespace');
  
  return <h1>{t('title')}</h1>;
}
```

### Using the Custom Hook

```tsx
'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function MyComponent() {
  const { t, locale, isRtl, dir } = useTranslation('namespace');
  
  return (
    <div dir={dir}>
      <h1>{t('title')}</h1>
      <p>Current locale: {locale}</p>
      <p>Is RTL: {isRtl ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

## Adding a New Translation

1. Add the new locale to the `locales` array in `i18n.ts`.
2. Create a new translation file in the `messages` directory (e.g., `messages/de.json` for German).
3. Copy the structure from `messages/en.json` and translate all values.
4. Run `npm run validate-translations` to verify that all keys are present.

## Navigation Between Pages

Use the standard Next.js Link component with the locale in the path:

```tsx
import Link from 'next/link';

export default function MyComponent() {
  // The locale is part of the URL path
  return <Link href="/about">About</Link>;
}
```

## Programmatic Navigation

Use the standard Next.js useRouter hook:

```tsx
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { changeLocale } from '@/navigation';

export default function MyComponent() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = '/about';
  
  const handleClick = () => {
    // The locale is already part of the URL path
    router.push(pathname);
  };
  
  // To change locale
  const handleLocaleChange = (newLocale) => {
    const newPath = changeLocale(newLocale, pathname);
    router.push(newPath);
  };
  
  return (
    <>
      <button onClick={handleClick}>Go to About</button>
      <button onClick={() => handleLocaleChange('fr')}>Switch to French</button>
    </>
  );
}
```

## Switching Languages

Use the `LanguageSwitcher` component:

```tsx
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export default function MyComponent() {
  return <LanguageSwitcher />;
}
```

## RTL Support

RTL support is automatically handled by the `RTLProvider` component, which is included in the root layout. It sets the appropriate `dir` attribute and CSS classes based on the current locale.

## Validation

To validate that all translation files have the same structure:

```bash
npm run validate-translations
```

This will check that all translation files have the same keys as the reference file (`en.json`).

## Best Practices

1. Use namespaces to organize translations (e.g., `navigation`, `common`, `home`).
2. Keep translation keys descriptive and organized.
3. Use the `useTranslation` hook for consistent access to translations.
4. Always include the locale in the URL path for links.
5. Run the validation script before committing changes to translation files.
6. Consider the context and space constraints when translating, as some languages may require more space than others.
7. For RTL languages, ensure that UI elements are properly aligned and that icons are mirrored if necessary. 