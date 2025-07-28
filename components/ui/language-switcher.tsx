'use client';

import { usePathname } from 'next/navigation';
import { ChevronDown, Languages } from 'lucide-react';
import { getLocaleDisplayName, locales, type Locale } from '@/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons';
  className?: string;
  compact?: boolean; // New prop for mobile compact mode
  showInMobileMenu?: boolean; // New prop to indicate if it's in mobile menu
}

export function LanguageSwitcher({ 
  variant = 'dropdown', 
  className = '', 
  compact = false,
  showInMobileMenu = false 
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] as Locale;

  const handleLocaleChange = (newLocale: Locale) => {
    // Set cookie for preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 30}`;
    
    // Replace current locale in pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    
    // Use window.location instead of router.push to force a full page reload
    window.location.href = newPath;
  };

  // Mobile menu version - use buttons for better touch experience
  if (showInMobileMenu) {
    return (
      <div className="px-3 py-2">
        <div className="text-sm font-medium text-foreground mb-3">Language</div>
        <ToggleGroup
          type="single"
          value={currentLocale}
          onValueChange={(value) => value && handleLocaleChange(value as Locale)}
          className="grid grid-cols-3 gap-2 w-full"
          variant="outline"
        >
          {locales.map((locale) => (
            <ToggleGroupItem
              key={locale}
              value={locale}
              aria-label={`Switch to ${getLocaleDisplayName(locale)}`}
              className="px-3 py-2 text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {getLocaleDisplayName(locale)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <ToggleGroup
        type="single"
        value={currentLocale}
        onValueChange={(value) => value && handleLocaleChange(value as Locale)}
        className={`${compact ? 'space-x-1' : ''} ${className}`}
        variant="outline"
      >
        {locales.map((locale) => (
          <ToggleGroupItem
            key={locale}
            value={locale}
            aria-label={`Switch to ${getLocaleDisplayName(locale)}`}
            className={`${compact ? 'px-2 py-1 text-xs' : 'px-3 py-2'}`}
          >
            {compact ? locale.toUpperCase() : getLocaleDisplayName(locale)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`gap-2 ${compact ? 'px-2 py-1 h-8 text-xs' : 'px-3 py-2'} ${className}`}
          aria-label="Select language"
        >
          <Languages className={`${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
          {compact ? currentLocale.toUpperCase() : getLocaleDisplayName(currentLocale)}
          <ChevronDown className={`${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={`cursor-pointer ${
              currentLocale === locale ? 'bg-accent' : ''
            }`}
          >
            <Languages className="mr-2 h-4 w-4" />
            {getLocaleDisplayName(locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 