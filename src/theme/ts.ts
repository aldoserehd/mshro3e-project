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
 * font(role, isArabic, weightOverride) — returns RN font style object.
 * Uses lhAr line-height when Arabic, otherwise lh.
 *
 * IMPORTANT: we resolve the weight into the font FILE name and never set
 * `fontWeight` alongside a custom `fontFamily` — on Android that combination
 * silently falls back to the system font (this is why Arabic used to render
 * in the default Roboto-style face).
 */
export function font(
  role: FontRole,
  isArabic?: boolean,
  weightOverride?: TextStyle['fontWeight'],
): TextStyle {
  const ar = isArabic ?? (CURRENT_LOCALE === 'ar');
  const token = typeTokens[role];
  // Hero / pageTitle / sectionTitle = display family. Others = body.
  const displayRoles: FontRole[] = ['hero', 'pageTitle', 'sectionTitle'];
  const isDisplay = displayRoles.includes(role);
  const family = ar
    ? (isDisplay ? fontFamilies.displayArabic : fontFamilies.bodyArabic)
    : (isDisplay ? fontFamilies.displayLatin : fontFamilies.bodyLatin);

  // Map to the actual loaded font file from @expo-google-fonts.
  const fontFamily = resolveFontFamily(family, weightOverride ?? token.weight);

  const style: TextStyle = {
    fontFamily,
    fontSize: token.size,
    lineHeight: ar ? token.lhAr : token.lh,
    // Arabic: no positive letter-spacing (ligature break).
    letterSpacing: 0,
  };

  if (role === 'microcopy' && !ar) {
    style.letterSpacing = 0.44; // ~+4% tracking on 11px
    style.textTransform = 'uppercase';
  }

  return style;
}

/** Weights each family was loaded with (see App.tsx) — clamp to the nearest. */
const FAMILY_WEIGHTS: Record<string, Record<string, string>> = {
  Manrope: { '400': '500Medium', '500': '500Medium', '600': '600SemiBold', '700': '700Bold', '800': '800ExtraBold', '900': '800ExtraBold' },
  Inter: { '400': '400Regular', '500': '500Medium', '600': '600SemiBold', '700': '700Bold', '800': '700Bold', '900': '700Bold' },
  IBMPlexSansArabic: { '400': '400Regular', '500': '500Medium', '600': '600SemiBold', '700': '700Bold', '800': '700Bold', '900': '700Bold' },
};

/** Map font family + weight to the specific loaded font file name. */
function resolveFontFamily(family: string, weight: TextStyle['fontWeight']): string {
  const w = normalizeWeight(weight);
  const suffix = FAMILY_WEIGHTS[family]?.[w];
  return suffix ? `${family}_${suffix}` : family;
}

function normalizeWeight(w: TextStyle['fontWeight']): string {
  if (w === 'bold') return '700';
  if (w === 'normal' || w == null) return '400';
  return String(w);
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

/**
 * Module-level current locale. Kept in sync by `setCurrentLocale` from the locale store.
 * This makes `pickLocale()` and `formatPrice()` react to runtime language toggle
 * without requiring an app reload (I18nManager.isRTL only flips on reload).
 */
let CURRENT_LOCALE: 'ar' | 'en' = I18nManager.isRTL ? 'ar' : 'en';

export function setCurrentLocale(l: 'ar' | 'en'): void {
  CURRENT_LOCALE = l;
}

export function getCurrentLocale(): 'ar' | 'en' {
  return CURRENT_LOCALE;
}

export function formatPrice(amount: number, currency = 'KWD', locale: 'ar' | 'en' = CURRENT_LOCALE): string {
  const symbol = locale === 'ar' ? (CURRENCY_SYMBOL_AR[currency] ?? currency) : currency;
  return locale === 'ar' ? `${amount} ${symbol}` : `${symbol} ${amount}`;
}

/**
 * Pick localized string off a {ar, en} object.
 */
export function pickLocale<T extends { ar: string; en: string }>(
  obj: T,
  locale: 'ar' | 'en' = CURRENT_LOCALE,
): string {
  return obj[locale] || obj.en || obj.ar;
}

export { Platform };
