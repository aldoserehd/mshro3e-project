/**
 * App-wide configuration constants.
 */
import { BRAND } from './brand';

/**
 * Public vendor marketing / sign-up website.
 *
 * The customer app never handles vendor sign-up or payment — the "List your
 * business" CTA opens this URL in the browser. Vendors choose a plan
 * (1 month or 3 months) and complete onboarding on the website at the `/join`
 * route.
 *
 * PLACEHOLDER: points at the brand domain; goes live with the real site.
 */
export const VENDOR_SITE_URL = BRAND.vendorJoinUrl;
