/**
 * Mshro3e design tokens — single source of truth.
 * Both mobile (RN) and admin (Next.js/Tailwind) read from here.
 * Tailwind config in admin/ extends these. RN consumes them directly.
 */

/**
 * Stitch v2 "Kuwaiti Artisans" palette — soft blue accent (#415c9d) on a
 * near-white canvas (#faf8ff), WhatsApp green for contact CTAs.
 * The `navy*` ramp keys are kept (screens reference them widely) but their
 * VALUES were remapped to this blue family so the whole app re-skins at once.
 *   navy500 = the accent (#415c9d)
 *   navy900 = deep hero navy (#001a41-ish), still high-contrast for text
 *   navy50  = app background (#faf8ff)
 */
export const palette = {
  navy950: '#000f24',
  navy900: '#001a41', // deep navy — hero backgrounds (tertiary-container)
  navy800: '#15294f',
  navy700: '#2a4686', // dark accent / pressed (on-secondary-container)
  navy600: '#34528f',
  navy500: '#415c9d', // ★ ACCENT — buttons, links, active states
  navy400: '#6e87bf',
  navy300: '#9db7ff', // light-blue chips (secondary-container)
  navy200: '#c2cfe3',
  navy100: '#dde2f9', // light fills / hover
  navy50:  '#faf8ff', // ★ app background
  black:   '#000000',
  white:   '#FFFFFF',
  // Brand + functional aliases (preferred over navy* for new code)
  brand:      '#415c9d',
  brandDark:  '#2a4686',
  brandSoft:  '#9db7ff',
  brandFixed: '#dde2f9',
  whatsapp:   '#25D366',
  neutral900: '#181b24',
  neutral500: '#46464c',
  neutral200: '#e0e2ed',
} as const;

export type PaletteToken = keyof typeof palette;

export const semantic = {
  bg: palette.navy50,
  bgDark: palette.navy950,
  surface: palette.white,
  surfaceAlt: '#f2f3ff',
  surfaceDark: palette.navy900,
  surfaceDarkAlt: palette.navy800,
  brand: palette.brand,
  brandHover: palette.brandDark,
  whatsapp: palette.whatsapp,
  text: palette.neutral900,
  textMuted: palette.neutral500,
  textOnDark: palette.white,
  textOnDarkMuted: palette.navy300,
  border: palette.neutral200,
  borderStrong: palette.navy200,
  borderOnDark: palette.navy700,
  link: palette.brand,
  focus: palette.brand,
} as const;

export const spacing = {
  s0: 0,
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 24,
  s6: 32,
  s7: 48,
  s8: 64,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/**
 * Light-mode shadow recipes. For RN, use the platform-specific block below.
 * For web (Tailwind), use the cssString values in tailwind.config.ts.
 */
export const shadow = {
  elev1: {
    rn: {
      shadowColor: '#0A1020',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 1,
    },
    css: '0 1px 2px rgba(10,16,32,0.06), 0 1px 1px rgba(10,16,32,0.04)',
  },
  elev2: {
    rn: {
      shadowColor: '#0A1020',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    css: '0 4px 12px rgba(10,16,32,0.08), 0 2px 4px rgba(10,16,32,0.04)',
  },
  elev3: {
    rn: {
      shadowColor: '#0A1020',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.14,
      shadowRadius: 28,
      elevation: 8,
    },
    css: '0 12px 28px rgba(10,16,32,0.14), 0 4px 8px rgba(10,16,32,0.06)',
  },
  elev4: {
    rn: {
      shadowColor: '#0A1020',
      shadowOffset: { width: 0, height: 28 },
      shadowOpacity: 0.22,
      shadowRadius: 60,
      elevation: 16,
    },
    css: '0 28px 60px rgba(10,16,32,0.22), 0 10px 20px rgba(10,16,32,0.10)',
  },
} as const;

export const fonts = {
  displayLatin: 'Manrope',
  // One Arabic family everywhere — IBM Plex Sans Arabic (brand face).
  // Mixing Tajawal display + Plex body read as two different apps.
  displayArabic: 'IBMPlexSansArabic',
  bodyLatin: 'Inter',
  bodyArabic: 'IBMPlexSansArabic',
} as const;

/**
 * Type roles. `lhAr` is the +2 line-height bump for Arabic-dominant text.
 */
export const type = {
  hero:        { size: 40, lh: 46, lhAr: 48, weight: '700' as const },
  pageTitle:   { size: 28, lh: 34, lhAr: 36, weight: '700' as const },
  sectionTitle:{ size: 22, lh: 28, lhAr: 30, weight: '600' as const },
  cardTitle:   { size: 17, lh: 24, lhAr: 26, weight: '600' as const },
  body:        { size: 15, lh: 22, lhAr: 24, weight: '400' as const },
  label:       { size: 13, lh: 18, lhAr: 20, weight: '500' as const },
  button:      { size: 15, lh: 20, lhAr: 22, weight: '600' as const },
  caption:     { size: 12, lh: 16, lhAr: 18, weight: '400' as const },
  microcopy:   { size: 11, lh: 14, lhAr: 16, weight: '500' as const },
} as const;

export const motion = {
  spring: {
    soft:    { damping: 22, stiffness: 180 },
    snappy:  { damping: 18, stiffness: 300 },
    sheet:   { damping: 18, stiffness: 180 },
    tab:     { damping: 22, stiffness: 220 },
  },
  timing: {
    fast: 150,
    base: 220,
    slow: 360,
  },
} as const;

export const theme = {
  palette,
  semantic,
  spacing,
  radius,
  shadow,
  fonts,
  type,
  motion,
};

export type Theme = typeof theme;
export default theme;
