---
name: Premium Kuwaiti Marketplace
colors:
  surface: '#faf8ff'
  surface-dim: '#d8d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#ecedf9'
  surface-container-high: '#e6e7f3'
  surface-container-highest: '#e0e2ed'
  on-surface: '#181b24'
  on-surface-variant: '#46464c'
  inverse-surface: '#2d3039'
  inverse-on-surface: '#eff0fc'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#585e71'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#151b2c'
  on-primary-container: '#7e8398'
  inverse-primary: '#c1c6dc'
  secondary: '#415c9d'
  on-secondary: '#ffffff'
  secondary-container: '#9db7ff'
  on-secondary-container: '#2a4686'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001a41'
  on-tertiary-container: '#6483c2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde2f9'
  primary-fixed-dim: '#c1c6dc'
  on-primary-fixed: '#151b2c'
  on-primary-fixed-variant: '#414659'
  secondary-fixed: '#dae2ff'
  secondary-fixed-dim: '#b1c5ff'
  on-secondary-fixed: '#001947'
  on-secondary-fixed-variant: '#274484'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a41'
  on-tertiary-fixed-variant: '#234580'
  background: '#faf8ff'
  on-background: '#181b24'
  surface-variant: '#e0e2ed'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
---

## Brand & Style

The design system is engineered to evoke the persona of a "Smart Kuwaiti friend"—sophisticated, reliable, and deeply rooted in local culture while maintaining a global, modern standard. It serves a premium vendor marketplace where trust and aesthetic precision are paramount.

The visual style is **Corporate / Modern** with a focus on high-end retail. It utilizes a restrained "Navy Scale" to communicate authority and quality. The interface prioritizes clarity and whitespace, ensuring that high-quality vendor imagery takes center stage. The system is designed with an **Arabic-first (RTL)** architecture, ensuring that the visual flow, iconography, and typographic rhythm are optimized for Kuwaiti users, with a seamless English (LTR) fallback.

## Colors

This design system utilizes a structured hierarchy of Navy tones to differentiate between brand presence and interactive states. 

- **Primary Brand:** `navy-900` is used for high-impact surfaces including the top navigation bars and primary action buttons.
- **Interactions:** Use `navy-700` for hover/pressed states and `navy-500` for text links and focus indicators.
- **Backgrounds:** The primary app background is `navy-50`, providing a soft, off-white canvas that reduces glare and enhances the premium feel.
- **Typography:** Primary body text uses `ink-900` for high legibility, while `ink-500` is reserved for secondary or metadata text.
- **Status:** Functional colors (Success, Warning, Danger) use a high-chroma text on a desaturated "pastel" background to maintain the calm, restrained aesthetic.

## Typography

Typography is a dual-language system where Latin and Arabic scripts are weighted to feel visually equivalent.

- **Headlines:** Use **Manrope** for Latin and **Tajawal** for Arabic. These fonts share a modern, geometric structure that feels premium.
- **Body:** Use **Inter** for Latin and **IBM Plex Sans Arabic** for Arabic. These were selected for their exceptional legibility in data-heavy marketplace environments.
- **Arabic Rules:** When rendering Arabic text, increase the `line-height` by +2px relative to the Latin token to accommodate the script's descenders and accents. **Never** apply positive letter-spacing to Arabic text.
- **Numerics:** Always use Western Arabic digits (0-9) for prices and quantities to ensure clarity in commercial transactions.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop to maintain a premium, curated feel, transitioning to a **Fluid Grid** for mobile devices.

- **Desktop:** 12-column grid with a 1200px max-width, 24px gutters, and 48px side margins.
- **Tablet:** 8-column grid with 16px gutters and 32px side margins.
- **Mobile:** 4-column fluid grid with 12px gutters and 16px side margins.

The spacing scale is strictly linear (base 4/8), ensuring a consistent vertical rhythm. Use `xl (24px)` for major section padding and `lg (16px)` for internal component padding (e.g., inside cards).

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and extremely restrained **Ambient Shadows**. This prevents the UI from feeling cluttered or "heavy."

- **Base Level:** `navy-50` background.
- **Surface Level:** White (`#FFFFFF`) cards and containers.
- **Elevation 1 (Standard):** Used for cards and dropdowns. A subtle `0 1px 2px rgba(10, 16, 32, 0.06)` shadow combined with a 1px border (`ink-200`).
- **Interactive Depth:** On hover, cards do not lift significantly; instead, the border color may shift to `navy-200` to indicate focus.

## Shapes

The shape language is sophisticated and "Soft-Rounded," moving away from aggressive sharp corners to appear more approachable.

- **6px (xs):** Small input elements, checkboxes, and nested tags.
- **10px (sm):** Primary buttons and standard input fields.
- **16px (md):** Product and vendor cards.
- **24px (lg):** Large promotional banners or modal containers.
- **9999px (pill):** Status indicators, chips, and search bars.

## Components

### Buttons
- **Primary:** `navy-900` fill, white text, 10px radius. High-contrast and authoritative.
- **Secondary:** Transparent fill, `navy-900` border (1px), `navy-900` text.
- **Tertiary:** `navy-500` text, no border or fill, used for low-priority actions.

### Cards
- White surface, 16px radius, `ink-200` border (1px).
- Use `elev-1` shadow for subtle separation from the `navy-50` background.

### Input Fields
- White background, 10px radius, 1px `ink-200` border. 
- Focus state: Border shifts to `navy-600` with a 2px outer glow of `navy-100`.

### Status Pills
- High-readability badges with a 9999px radius.
- **Success:** `#E8F3EC` background / `#2E7D45` text.
- **Warning:** `#FFF4E0` background / `#B8730A` text.
- **Danger:** `#FBE9E9` background / `#B91C1C` text.

### Vendor Headers
- Use `navy-900` for the background of the vendor store header to create a "shop-in-shop" premium experience, utilizing white typography and `navy-300` for secondary icons.