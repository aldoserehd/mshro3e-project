/**
 * Server-side locale resolution from the `__mshro3e_locale` cookie.
 * Mirrors what the language switcher writes via the /api/locale route.
 */

import 'server-only';
import { cookies } from 'next/headers';
import type { Locale } from '@/i18n/dict';

export const LOCALE_COOKIE = '__mshro3e_locale';

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get(LOCALE_COOKIE)?.value;
  return v === 'en' ? 'en' : 'ar';
}

export const localeDir = (l: Locale): 'rtl' | 'ltr' => (l === 'ar' ? 'rtl' : 'ltr');
export const localeLang = (l: Locale): string => (l === 'ar' ? 'ar' : 'en');
