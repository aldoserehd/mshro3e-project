/**
 * Vendor subscription plans — marketing/landing config.
 *
 * Pricing model (June 2026 strategy, docs/CREATIVE-STRATEGY.md):
 * each tier sells ONE headline "wow" a home-business owner instantly gets,
 * with AI features as the differentiator. Launch prices below — tweak here
 * and the whole /join page + admin follow. `priceMonth3` is the TOTAL for a
 * 3-month term (not per month); the page derives the effective monthly rate
 * and the "save vs monthly" badge.
 */
import { BRAND } from '@/lib/brand';

export type BillingPeriod = '1month' | '3months';

export interface Plan {
  /** Stable id (also used as React key). */
  id: string;
  name: { ar: string; en: string };
  /** One-line positioning under the plan name. */
  tagline: { ar: string; en: string };
  /** The ONE headline benefit — shown big on the plan card. */
  wow: { ar: string; en: string };
  /** Price for a single month. 0 → "Free". `null` → shown as "— KWD". */
  priceMonth1: number | null;
  /** TOTAL price for a 3-month term. */
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
    id: 'free',
    name: { ar: 'مجاني', en: 'Free' },
    tagline: { ar: 'جرّبنا بدون أي التزام', en: 'Try it, zero commitment' },
    wow: { ar: 'خلّ الكويت تلقاك — مجاناً', en: 'Get found by Kuwait — free' },
    priceMonth1: 0,
    priceMonth3: 0,
    features: [
      { ar: 'ظهور في الدليل', en: 'Listed in the directory' },
      { ar: 'حتى ٥ منتجات', en: 'Up to 5 products' },
      { ar: 'زر واتساب مع عدّاد طلبات', en: 'WhatsApp button + lead counter' },
      { ar: `شعار «${BRAND.ar}» على متجرك`, en: `"Powered by ${BRAND.en}" watermark` },
    ],
  },
  {
    id: 'basic',
    name: { ar: 'أساسي', en: 'Basic' },
    tagline: { ar: 'متجر كامل يشتغل عنك', en: 'A full store, built for you' },
    wow: {
      ar: '٥ صور + رسالة صوتية = متجرك جاهز',
      en: 'Send 5 photos + a voice note. Wake up to a full store.',
    },
    priceMonth1: 6,
    priceMonth3: 15,
    features: [
      { ar: 'منشئ المتجر بالذكاء الاصطناعي 🪄', en: 'AI Storefront Builder 🪄' },
      { ar: 'كاتب أوصاف بالعربي والإنجليزي', en: 'AI product descriptions (AR + EN)' },
      { ar: 'منتجات غير محدودة وبدون شعارنا', en: 'Unlimited products, no watermark' },
      { ar: 'تفاصيل كل طلب: المنتج والوقت', en: 'Full lead detail: product, time, ref' },
      { ar: 'ردود واتساب جاهزة من منتجاتك', en: 'AI WhatsApp quick-reply kit' },
    ],
  },
  {
    id: 'pro',
    name: { ar: 'احترافي', en: 'Pro' },
    tagline: { ar: 'الأكثر اختياراً للمشاريع الجادة', en: 'The serious-growth tier' },
    wow: {
      ar: 'موظّف تسويق ذكي يشتغل لك ٢٤ ساعة',
      en: 'Your own AI marketing employee, 24/7',
    },
    priceMonth1: 14,
    priceMonth3: 36,
    features: [
      { ar: 'كل مزايا «أساسي»', en: 'Everything in Basic' },
      { ar: 'تقرير أسبوعي بالعربي على واتساب 📊', en: 'Weekly Arabic report on WhatsApp 📊' },
      { ar: 'مولّد كابشنات وهاشتاقات انستقرام', en: 'Instagram caption + hashtag generator' },
      { ar: 'تحسين الصور بضغطة وحدة', en: 'One-tap AI photo cleanup' },
      { ar: 'حملات رمضان والعيد والأعياد الوطنية', en: 'Seasonal campaign packs (Ramadan, Eid…)' },
      { ar: 'شارة موثّق + ظهور مميّز شهرياً', en: 'Verified badge + 1 featured slot/mo' },
    ],
    highlighted: true,
  },
  {
    id: 'business',
    name: { ar: 'أعمال', en: 'Business' },
    tagline: { ar: 'للي يبي يتفرّغ لشغله', en: 'For owners who want it handled' },
    wow: { ar: 'حنّا نديره عنك', en: 'We run your store for you' },
    priceMonth1: 29,
    priceMonth3: 75,
    features: [
      { ar: 'كل مزايا «احترافي»', en: 'Everything in Pro' },
      { ar: 'نرفع منتجاتك ونحدّثها شهرياً 🤝', en: 'We upload + refresh your products monthly 🤝' },
      { ar: 'حملاتك الموسمية جاهزة بدون تعب', en: 'Seasonal campaigns done for you' },
      { ar: 'بانر الصفحة الرئيسية + صدارة الفئة', en: 'Homepage banner + top-of-category' },
      { ar: 'فروع متعددة وحسابات للفريق', en: 'Multi-branch + team accounts' },
      { ar: 'دعم أولوية مباشر', en: 'Priority human support' },
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
 * Returns null if either price is a placeholder/free or there is no saving.
 */
export function savingPercent(plan: Plan): number | null {
  if (!plan.priceMonth1 || plan.priceMonth3 === null) return null;
  const monthly3 = plan.priceMonth3 / 3;
  if (monthly3 >= plan.priceMonth1) return null;
  return Math.round((1 - monthly3 / plan.priceMonth1) * 100);
}
