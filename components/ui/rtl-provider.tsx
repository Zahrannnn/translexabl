'use client';

import { useLocale } from 'next-intl';
import { ReactNode, useEffect } from 'react';

interface RTLProviderProps {
  children: ReactNode;
}

export function RTLProvider({ children }: RTLProviderProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  useEffect(() => {
    // Set the dir attribute on the html element
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    
    // Add or remove rtl class for CSS styling
    if (isRtl) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
    
    // Cleanup function
    return () => {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('rtl');
    };
  }, [isRtl]);

  return <>{children}</>;
} 