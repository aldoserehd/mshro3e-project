/**
 * SINGLE SOURCE OF TRUTH for the brand identity.
 *
 * The project is being rebranded (new name + logo coming). Every user-facing
 * occurrence of the brand name, domain, support email, and share URLs flows
 * from this file — when the new name lands, change it HERE and the whole
 * customer app follows. (The admin/web side has its own copy at
 * admin/src/lib/brand.ts — keep the two in sync.)
 */
export const BRAND = {
  /** Latin display name. PLACEHOLDER — final name not chosen yet. */
  en: 'Our Platform',
  /** Arabic display name. PLACEHOLDER — final name not chosen yet. */
  ar: 'منصّتنا',
  /** Primary public domain (no protocol). */
  domain: 'mshro3e.kw',
  /** Public website root. */
  siteUrl: 'https://mshro3e.kw',
  /** Vendor marketing + sign-up page. */
  vendorJoinUrl: 'https://mshro3e.kw/join',
  /** Public storefront URL prefix shown on Pro vendor profiles. */
  storeUrl: (handle: string) => `mshro3e.kw/@${handle}`,
  /** Support inbox. */
  supportEmail: 'support@mshro3e.kw',
  /** Display version string. */
  version: 'v1.0.0',
} as const;
