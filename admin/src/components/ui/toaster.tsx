'use client';

import { Toaster as SonnerToaster } from 'sonner';
import type { Locale } from '@/i18n/dict';

/**
 * App-wide toast host. Mounted once in the dashboard layout.
 * Styled to match the navy/ink design tokens.
 */
export function Toaster({ locale }: { locale: Locale }) {
  return (
    <SonnerToaster
      position={locale === 'ar' ? 'bottom-left' : 'bottom-right'}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      toastOptions={{
        classNames: {
          toast:
            'rounded-[12px] border border-[color:var(--color-border)] bg-white text-ink-900 shadow-[var(--shadow-elev3)]',
          title: 'text-[14px] font-semibold',
          description: 'text-[13px] text-ink-500',
        },
      }}
    />
  );
}
