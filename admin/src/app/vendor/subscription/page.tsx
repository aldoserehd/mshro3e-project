'use client';

import * as React from 'react';
import { Check, Sparkles, MessageCircle, BadgeCheck } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { PLANS, savingPercent } from '@/lib/marketing/plans';
import { BRAND } from '@/lib/brand';
import { Card } from '@/components/ui/card';

/**
 * Vendor-side subscription picker. Payments are manual for now (KNET payment
 * link): the vendor picks a plan → WhatsApp opens to the owner with a
 * pre-filled request → owner confirms payment and activates the tier in the
 * admin (TierControl). AI quotas unlock automatically from vendor.tier.
 */
export default function VendorSubscriptionPage() {
  const { vendor } = useVendorAuth();
  const locale = useVendorLocale();
  const ar = locale === 'ar';

  const activeTier =
    vendor?.tier && ((vendor.subscriptionUntil ?? 0) as number) > Date.now() ? vendor.tier : null;

  const t = ar
    ? { title: 'اشتراكي', sub: 'اختر خطتك — وميزات الذكاء الاصطناعي تتفعّل حسب الخطة.',
        current: 'خطتك الحالية', free: 'مجاني', month: '/ شهر', or3: 'أو {p} د.ك لكل ٣ أشهر',
        cta: 'اطلب التفعيل عبر واتساب', note: 'بعد الدفع برابط كي نت، تتفعّل خطتك خلال دقائق.',
        until: 'صالح حتى', save: 'وفّر {p}٪' }
    : { title: 'My subscription', sub: 'Pick your plan — AI features unlock based on it.',
        current: 'Your current plan', free: 'Free', month: '/ month', or3: 'or KD {p} per 3 months',
        cta: 'Request activation via WhatsApp', note: 'After paying the KNET link, your plan activates within minutes.',
        until: 'Valid until', save: 'Save {p}%' };

  const waLink = (planName: string) => {
    const msg = ar
      ? `حياكم 👋 أبي أفعّل خطة «${planName}» لمتجري ${vendor?.name?.ar ?? ''} — تدزون لي رابط الدفع؟`
      : `Hi 👋 I'd like to activate the "${planName}" plan for my store ${vendor?.name?.en ?? ''} — can you send the payment link?`;
    return `https://wa.me/${BRAND.supportWhatsapp}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-bold text-ink-900">{t.title}</h1>
        <p className="mt-1 text-[14px] text-ink-500">{t.sub}</p>
      </div>

      {/* current plan banner */}
      <Card className="flex flex-wrap items-center justify-between gap-3 border-navy-200 bg-navy-50/60 p-4">
        <div className="flex items-center gap-2.5">
          <BadgeCheck className="size-5 text-navy-700" />
          <span className="text-[14px] text-ink-900">
            {t.current}: <b>{activeTier ? PLANS.find((p) => p.id === (activeTier === 'managed' ? 'business' : activeTier))?.name[locale] ?? activeTier : t.free}</b>
          </span>
        </div>
        {activeTier && vendor?.subscriptionUntil ? (
          <span className="text-[12.5px] text-ink-500">
            {t.until} {new Date(vendor.subscriptionUntil as number).toLocaleDateString(ar ? 'ar-KW' : 'en-US', { dateStyle: 'medium' })}
          </span>
        ) : null}
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent =
            (plan.id === 'free' && !activeTier) ||
            plan.id === activeTier ||
            (plan.id === 'business' && activeTier === 'managed');
          const saving = savingPercent(plan);
          const paid = (plan.priceMonth1 ?? 0) > 0;
          return (
            <Card key={plan.id} className={`flex flex-col p-5 ${plan.highlighted ? 'border-navy-900 ring-1 ring-navy-900 shadow-[var(--shadow-elev3)]' : ''}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-ink-900">{plan.name[locale]}</h3>
                {isCurrent ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">✓</span>
                ) : plan.highlighted ? (
                  <Sparkles className="size-4 text-navy-700" />
                ) : null}
              </div>
              <p className="mt-2 rounded-[10px] bg-navy-50 px-3 py-2 text-[12.5px] font-bold leading-snug text-navy-900">
                {plan.wow[locale]}
              </p>
              <p className="mt-3 text-[26px] font-extrabold text-ink-900 tabular-nums">
                {paid ? plan.priceMonth1 : t.free}
                {paid ? <span className="text-[12px] font-medium text-ink-500"> {ar ? 'د.ك' : 'KWD'} {t.month}</span> : null}
              </p>
              {paid && plan.priceMonth3 ? (
                <p className="text-[11.5px] text-ink-500">
                  {t.or3.replace('{p}', String(plan.priceMonth3))}
                  {saving ? <span className="ms-1.5 font-bold text-emerald-700">{t.save.replace('{p}', String(saving))}</span> : null}
                </p>
              ) : null}
              <ul className="mt-3 flex flex-1 flex-col gap-1.5">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[12px] leading-snug text-ink-900">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />{f[locale]}
                  </li>
                ))}
              </ul>
              {paid && !isCurrent ? (
                <a
                  href={waLink(plan.name[locale])}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#25D366] text-[13px] font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="size-4" />
                  {t.cta}
                </a>
              ) : null}
            </Card>
          );
        })}
      </div>

      <p className="text-[12.5px] text-ink-500">💡 {t.note}</p>
    </div>
  );
}
