/**
 * Typed theme adapter for mobile.
 * Pulls everything from shared/theme.ts. Never redefines tokens.
 */
import { I18nManager, Platform, TextStyle, ViewStyle } from 'react-native';
import theme, { fonts as fontFamilies, shadow, type as typeTokens } from '@shared/theme';

export { theme };
export const { palette, semantic, spacing, radius, motion } = theme;

export type FontRole = keyof typeof typeTokens;

/**
 * font(role, isArabic) — returns RN font style object.
 * Uses lhAr line-height when Arabic, otherwise lh.
 */
export function font(role: FontRole, isArabic = I18nManager.isRTL): TextStyle {
  const token = typeTokens[role];
  // Hero / pageTitle / sectionTitle = display family. Others = body.
  const displayRoles: FontRole[] = ['hero', 'pageTitle', 'sectionTitle'];
  const isDisplay = displayRoles.includes(role);
  const family = isArabic
    ? (isDisplay ? fontFamilies.displayArabic : fontFamilies.bodyArabic)
    : (isDisplay ? fontFamilies.displayLatin : fontFamilies.bodyLatin);

  // Map to actual loaded font names from @expo-google-fonts
  const fontFamily = resolveFontFamily(family, token.weight);

  const style: TextStyle = {
    fontFamily,
    fontSize: token.size,
    lineHeight: isArabic ? token.lhAr : token.lh,
    fontWeight: token.weight,
    // Arabic: no positive letter-spacing (ligature break).
    letterSpacing: isArabic ? 0 : 0,
  };

  if (role === 'microcopy' && !isArabic) {
    style.letterSpacing = 0.44; // ~+4% tracking on 11px
    style.textTransform = 'uppercase';
  }

  return style;
}

/**
 * Map font family + weight to specific loaded font name.
 */
function resolveFontFamily(family: string, weight: TextStyle['fontWeight']): string {
  const w = weightToName(weight);
  switch (family) {
    case 'Manrope':
      return `Manrope_${w}`;
    case 'Inter':
      return `Inter_${w}`;
    case 'Tajawal':
      return `Tajawal_${w}`;
    case 'IBMPlexSansArabic':
      return `IBMPlexSansArabic_${w}`;
    default:
      return family;
  }
}

function weightToName(w: TextStyle['fontWeight']): string {
  switch (w) {
    case '400': return '400Regular';
    case '500': return '500Medium';
    case '600': return '600SemiBold';
    case '700': return '700Bold';
    case '800': return '800ExtraBold';
    default: return '400Regular';
  }
}

/**
 * shadow(level) — returns RN shadow style.
 */
export function shadowStyle(level: 1 | 2 | 3 | 4): ViewStyle {
  const key = `elev${level}` as const;
  return shadow[key].rn as ViewStyle;
}

/**
 * rtl() — current direction.
 */
export function rtl(): boolean {
  return I18nManager.isRTL;
}

/**
 * localizedAlign() — text alignment based on direction.
 */
export function localizedAlign(): TextStyle['textAlign'] {
  return I18nManager.isRTL ? 'right' : 'left';
}

/**
 * mirrorIfRtl() — for translateX values that should flip in RTL.
 */
export function mirrorIfRtl(value: number): number {
  return I18nManager.isRTL ? -value : value;
}

/**
 * Conditional border on dark surfaces (per brief: 1px inner stroke instead of shadow).
 */
export function darkSurfaceBorder(): ViewStyle {
  return {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  };
}

/**
 * Format price with western digits + currency. Brief §9: prices stay LTR.
 * Kuwait default: KWD → "د.ك" in Arabic, "KWD" in Latin.
 */
const CURRENCY_SYMBOL_AR: Record<string, string> = {
  KWD: 'د.ك',
  SAR: 'ر.س',
  AED: 'د.إ',
  USD: '$',
};

export function formatPrice(amount: number, currency = 'KWD', locale: 'ar' | 'en' = I18nManager.isRTL ? 'ar' : 'en'): string {
  const symbol = locale === 'ar' ? (CURRENCY_SYMBOL_AR[currency] ?? currency) : currency;
  return locale === 'ar' ? `${amount} ${symbol}` : `${symbol} ${amount}`;
}

/**
 * Pick localized string off a {ar, en} object.
 */
export function pickLocale<T extends { ar: string; en: string }>(
  obj: T,
  locale: 'ar' | 'en' = I18nManager.isRTL ? 'ar' : 'en',
): string {
  return obj[locale] || obj.en || obj.ar;
}

export { Platform };
