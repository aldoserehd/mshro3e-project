/**
 * Theme-aware color set.
 *
 * The static `palette`/`semantic` tokens in shared/theme.ts are light-mode
 * only — screens that hardcode `semantic.surface` (white) or
 * `palette.neutral900` (near-black text) look broken in dark mode (white
 * cards on a navy canvas, invisible text). This module exposes ONE reactive
 * color set per effective theme so screens can render correctly in both.
 *
 * Usage:
 *   const c = useColors();
 *   <View style={{ backgroundColor: c.surface }}>
 *     <Text style={{ color: c.text }} />
 *   </View>
 */
import { useEffectiveTheme, type EffectiveTheme } from '../stores/theme';

export interface Colors {
  isDark: boolean;
  /** App canvas background. */
  bg: string;
  /** Raised card / sheet / header surface. */
  surface: string;
  /** Subtle tinted fill (search bars, secondary chips, meta pills). */
  surfaceAlt: string;
  /** Sunken inputs / image placeholders. */
  surfaceSunken: string;
  /** Primary text. */
  text: string;
  /** Secondary / muted text. */
  textMuted: string;
  /** Text/icon color that sits on top of the brand fill. */
  textOnBrand: string;
  /** Hairline borders. */
  border: string;
  /** Stronger borders / dividers. */
  borderStrong: string;
  /** Accent — buttons, active states, links (lifts lighter in dark for contrast). */
  brand: string;
  /** Pressed/active accent. */
  brandDark: string;
  /** Soft accent fill behind selected chips / icon circles. */
  brandFill: string;
  /** Brand-colored text/icon (lighter than `brand` in dark for legibility). */
  brandText: string;
  /** WhatsApp green — constant across themes. */
  whatsapp: string;
  whatsappDark: string;
  /** Destructive. */
  danger: string;
  /** Scrim behind modals/sheets. */
  overlay: string;
  /** Translucent chip bg for floating controls over images. */
  glass: string;
}

const LIGHT: Colors = {
  isDark: false,
  bg: '#faf8ff',
  surface: '#ffffff',
  surfaceAlt: '#f1f3fc',
  surfaceSunken: '#eceffb',
  text: '#181b24',
  textMuted: '#5a5f70',
  textOnBrand: '#ffffff',
  border: '#e4e6f1',
  borderStrong: '#c8d0e6',
  brand: '#415c9d',
  brandDark: '#2a4686',
  brandFill: '#dde2f9',
  brandText: '#415c9d',
  whatsapp: '#25D366',
  whatsappDark: '#1da851',
  danger: '#ba1a1a',
  overlay: 'rgba(10,14,26,0.5)',
  glass: 'rgba(255,255,255,0.92)',
};

const DARK: Colors = {
  isDark: true,
  bg: '#0a0e1c',
  surface: '#141a2e',
  surfaceAlt: '#1c2440',
  surfaceSunken: '#101626',
  text: '#f3f5fb',
  textMuted: '#9aa2bb',
  textOnBrand: '#ffffff',
  border: '#283150',
  borderStrong: '#39446a',
  brand: '#5f7fcf',
  brandDark: '#496bbd',
  brandFill: '#1e2a4d',
  brandText: '#9db7ff',
  whatsapp: '#25D366',
  whatsappDark: '#1da851',
  danger: '#ff6b6b',
  overlay: 'rgba(0,0,0,0.62)',
  glass: 'rgba(20,26,46,0.86)',
};

export function colorsFor(theme: EffectiveTheme): Colors {
  return theme === 'dark' ? DARK : LIGHT;
}

/** Reactive color set for the current effective theme. */
export function useColors(): Colors {
  const theme = useEffectiveTheme();
  return colorsFor(theme);
}

export { LIGHT as lightColors, DARK as darkColors };
