/**
 * SINGLE SOURCE OF TRUTH for the brand identity (web side).
 *
 * The project is being rebranded (new name + logo coming). Every user-facing
 * occurrence of the brand name, domain, and support email in the owner admin,
 * vendor portal, and /join marketing site flows from this file — when the new
 * name lands, change it HERE. (The mobile app has its own copy at src/brand.ts
 * — keep the two in sync.)
 *
 * NOTE: internal identifiers (cookie names like __mshro3e_session) are NOT
 * derived from here on purpose — renaming those would log everyone out and
 * they are never user-visible.
 */
export const BRAND = {
  /** Latin display name. */
  en: 'Mshro3e',
  /** Arabic display name. */
  ar: 'مشروعي',
  /** Name by locale. */
  name(locale: 'ar' | 'en'): string {
    return locale === 'ar' ? this.ar : this.en;
  },
  /** Primary public domain (no protocol). */
  domain: 'mshro3e.kw',
  /** Public website root. */
  siteUrl: 'https://mshro3e.kw',
  /** Support inbox. */
  supportEmail: 'support@mshro3e.kw',
} as const;
