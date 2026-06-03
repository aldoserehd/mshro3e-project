/**
 * Mshro3e vendor subscription plans — marketing/landing config.
 *
 * ⚠️ PLACEHOLDER PRICES ⚠️
 * Final pricing is NOT decided yet. The `priceMonth1` / `priceMonth3` numbers
 * below are PLACEHOLDERS so the page renders something concrete. When real
 * pricing lands, just edit the numbers here — the whole /join page reads from
 * this file. `priceMonth3` is the TOTAL for a 3-month term (not per month); the
 * page derives the effective monthly rate and the "save vs monthly" badge.
 *
 * Set a number to `null` to render the price as "— KWD" (clearly TBD).
 */

export type BillingPeriod = '1month' | '3months';

export interface Plan {
  /** Stable id (also used as React key). */
  id: string;
  name: { ar: string; en: string };
  /** One-line positioning under the plan name. */
  tagline: { ar: string; en: string };
  /** Price for a single month. `null` → shown as placeholder "— KWD". */
  priceMonth1: number | null;
  /** TOTAL price for a 3-month term. `null` → placeholder. */
  priceMonth3: number | null;
  /** Bullet features. */
  features: { ar: string; en: string }[];
  /** Visually emphasise this tier as the recommended one. */
  highlighted?: boolean;
}

export const CURRENCY = { ar: 'د.ك', en: 'KWD' } as const;

/** Number of months in each billing period (used to derive the monthly rate). */
export const PERIOD_MONTHS: Record<BillingPeriod, number> = {
  '1month': 1,
  '3months': 3,
};

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: { ar: 'مبتدئ', en: 'Starter' },
    tagline: { ar: 'جرّب مشروعك على المنصة', en: 'Get your business listed' },
    // PLACEHOLDER PRICES
    priceMonth1: 5,
    priceMonth3: 12,
    features: [
      { ar: 'متجر مصغّر باسمك', en: 'Your own mini-store' },
      { ar: 'حتى ١٠ منتجات', en: 'Up to 10 products' },
      { ar: 'طلبات واتساب مباشرة', en: 'Direct WhatsApp leads' },
      { ar: 'ظهور في دليل مشروعي', en: 'Listed in the Mshro3e directory' },
    ],
  },
  {
    id: 'basic',
    name: { ar: 'أساسي', en: 'Basic' },
    tagline: { ar: 'للمشاريع اللي بدت تكبر', en: 'For growing home businesses' },
    // PLACEHOLDER PRICES
    priceMonth1: 9,
    priceMonth3: 22,
    features: [
      { ar: 'كل مزايا «مبتدئ»', en: 'Everything in Starter' },
      { ar: 'منتجات غير محدودة', en: 'Unlimited products' },
      { ar: 'إحصائيات بسيطة', en: 'Simple analytics' },
      { ar: 'نسب الطلبات لمشروعي', en: 'WhatsApp lead attribution' },
    ],
    highlighted: true,
  },
  {
    id: 'pro',
    name: { ar: 'احترافي', en: 'Pro' },
    tagline: { ar: 'ظهور أكبر وأدوات أكثر', en: 'More reach and tools' },
    // PLACEHOLDER PRICES
    priceMonth1: 15,
    priceMonth3: 39,
    features: [
      { ar: 'كل مزايا «أساسي»', en: 'Everything in Basic' },
      { ar: 'ظهور مميّز في الفئة', en: 'Featured placement in your category' },
      { ar: 'شارة بائع موثّق', en: 'Verified vendor badge' },
      { ar: 'دعم أولوية عبر واتساب', en: 'Priority WhatsApp support' },
    ],
  },
  {
    id: 'business',
    name: { ar: 'أعمال', en: 'Business' },
    tagline: { ar: 'للعلامات والمحلات الأكبر', en: 'For larger brands & shops' },
    // PLACEHOLDER PRICES
    priceMonth1: null,
    priceMonth3: null,
    features: [
      { ar: 'كل مزايا «احترافي»', en: 'Everything in Pro' },
      { ar: 'حسابات متعددة للفريق', en: 'Multiple team accounts' },
      { ar: 'دعم مخصّص', en: 'Dedicated support' },
      { ar: 'تسعير حسب الطلب', en: 'Custom pricing' },
    ],
  },
];

/**
 * Format the price to display for a plan + period.
 * Returns null when the price is a placeholder (caller renders "— KWD").
 */
export function planTotal(plan: Plan, period: BillingPeriod): number | null {
  return period === '1month' ? plan.priceMonth1 : plan.priceMonth3;
}

/** Effective monthly rate for a period (null if placeholder). */
export function monthlyRate(plan: Plan, period: BillingPeriod): number | null {
  const total = planTotal(plan, period);
  if (total === null) return null;
  return total / PERIOD_MONTHS[period];
}

/**
 * Percent saved per month on the 3-month term vs paying month-to-month.
 * Returns null if either price is a placeholder or there is no saving.
 */
export function savingPercent(plan: Plan): number | null {
  if (plan.priceMonth1 === null || plan.priceMonth3 === null) return null;
  const monthly3 = plan.priceMonth3 / 3;
  if (monthly3 >= plan.priceMonth1) return null;
  return Math.round((1 - monthly3 / plan.priceMonth1) * 100);
}
