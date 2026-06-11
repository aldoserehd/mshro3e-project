import * as React from 'react';
import { CreditCard, Check, Info } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { liveVendors } from '@/lib/data/live';
import { PageHeader } from '@/components/domain/page-header';
import { TierPill } from '@/components/domain/status-pill';
import { TierControl } from '@/components/domain/tier-control';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, THead, TBody, TRow, TH, TCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { KpiCard } from '@/components/ui/kpi-card';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { SubscriptionTier } from '@shared/types';

const initials = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

/**
 * Launch prices (docs/CREATIVE-STRATEGY.md) — Basic 6 / Pro 14 / Business 29
 * KWD/mo; 3-month totals 15 / 36 / 75. The 'managed' tier id = the "Business"
 * plan. Single source for the public site: admin/src/lib/marketing/plans.ts.
 */
const TIER_PRICES: Record<SubscriptionTier, { m1: number; m3: number }> = {
  basic: { m1: 6, m3: 15 },
  pro: { m1: 14, m3: 36 },
  managed: { m1: 29, m3: 75 },
};

export default async function SubscriptionsPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const vendors = await liveVendors();
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';

  const now = Date.now();
  const withTier = vendors.filter((v) => v.tier && (v.subscriptionUntil ?? 0) > now);
  const counts: Record<SubscriptionTier, number> = { basic: 0, pro: 0, managed: 0 };
  let mrr = 0;
  for (const v of withTier) {
    const tier = v.tier as SubscriptionTier;
    counts[tier] += 1;
    mrr += TIER_PRICES[tier].m1;
  }

  const plans: { tier: SubscriptionTier; label: string; feats: string[]; popular?: boolean }[] = [
    { tier: 'basic', label: t.subscriptions.tierBasic, feats: [t.subscriptions.featBasic1, t.subscriptions.featBasic2, t.subscriptions.featBasic3] },
    { tier: 'pro', label: t.subscriptions.tierPro, feats: [t.subscriptions.featPro1, t.subscriptions.featPro2, t.subscriptions.featPro3], popular: true },
    { tier: 'managed', label: t.subscriptions.tierManaged, feats: [t.subscriptions.featManaged1, t.subscriptions.featManaged2, t.subscriptions.featManaged3] },
  ];

  const tierLabels = {
    placeholder: t.subscriptions.setTier,
    free: t.subscriptions.tierFree,
    basic1: `${t.subscriptions.tierBasic} · ${t.subscriptions.cycle1mo}`,
    basic3: `${t.subscriptions.tierBasic} · ${t.subscriptions.cycle3mo}`,
    pro1: `${t.subscriptions.tierPro} · ${t.subscriptions.cycle1mo}`,
    pro3: `${t.subscriptions.tierPro} · ${t.subscriptions.cycle3mo}`,
    business1: `${t.subscriptions.tierManaged} · ${t.subscriptions.cycle1mo}`,
    business3: `${t.subscriptions.tierManaged} · ${t.subscriptions.cycle3mo}`,
    done: t.subscriptions.tierUpdated,
    failed: t.vendors.actionFailed,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.subscriptions.title} subtitle={t.subscriptions.subtitle} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4"><KpiCard label={t.subscriptions.mrr} value={<span className="tabular-nums">{formatCurrency(mrr, 'KWD', tag)}</span>} /></Card>
        <Card className="p-4"><KpiCard label={t.subscriptions.tierBasic} value={<span className="tabular-nums">{counts.basic}</span>} /></Card>
        <Card className="p-4"><KpiCard label={t.subscriptions.tierPro} value={<span className="tabular-nums">{counts.pro}</span>} /></Card>
        <Card className="p-4"><KpiCard label={t.subscriptions.tierManaged} value={<span className="tabular-nums">{counts.managed}</span>} /></Card>
      </div>

      {/* Plans & pricing — 1-month / 3-month structure. */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-[18px] font-bold text-ink-900">{t.subscriptions.plansTitle}</h2>
            <p className="text-[13px] text-ink-500">{t.subscriptions.plansSubtitle}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-500">
            <Info className="size-3.5" />
            {t.subscriptions.manualNote}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => {
            const price = TIER_PRICES[p.tier];
            return (
              <Card
                key={p.tier}
                className={cn('p-5 flex flex-col gap-4 relative', p.popular && 'border-navy-600 shadow-[var(--shadow-elev2)]')}
              >
                {p.popular ? (
                  <Badge tone="brand" className="absolute top-4 end-4">{t.subscriptions.mostPopular}</Badge>
                ) : null}
                <div>
                  <TierPill tier={p.tier} t={t} />
                  <h3 className="mt-2 text-[17px] font-bold text-ink-900">{p.label}</h3>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-baseline justify-between rounded-[10px] border border-navy-100 bg-navy-50/50 px-3 py-2">
                    <span className="text-[12px] font-semibold text-ink-500">{t.subscriptions.cycle1mo}</span>
                    <span className="tabular-nums font-bold text-ink-900">
                      {formatCurrency(price.m1, 'KWD', tag)}
                      <span className="text-[11px] font-medium text-ink-500"> {t.subscriptions.perMonth}</span>
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between rounded-[10px] border border-navy-200 bg-white px-3 py-2">
                    <span className="text-[12px] font-semibold text-navy-700">{t.subscriptions.cycle3mo}</span>
                    <span className="tabular-nums font-bold text-ink-900">
                      {formatCurrency(price.m3, 'KWD', tag)}
                      <span className="text-[11px] font-medium text-ink-500"> {t.subscriptions.per3Months}</span>
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-emerald-700">{t.subscriptions.save3mo}</p>
                </div>

                <ul className="flex flex-col gap-2 pt-1">
                  {p.feats.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-ink-900">
                      <Check className="size-4 mt-0.5 shrink-0 text-navy-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>

      {/* All vendors and their real subscription state. */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[18px] font-bold text-ink-900">{t.subscriptions.activeSubs}</h2>
        <Card className="p-0 overflow-hidden">
          {vendors.length === 0 ? (
            <EmptyState icon={<CreditCard className="size-7" />} title={t.subscriptions.noSubscriptions} />
          ) : (
            <Table>
              <THead>
                <TRow>
                  <TH>{t.subscriptions.colVendor}</TH>
                  <TH>{t.subscriptions.colTier}</TH>
                  <TH>{t.subscriptions.colRenewsAt}</TH>
                  <TH className="text-end">{t.subscriptions.colActions}</TH>
                </TRow>
              </THead>
              <TBody>
                {vendors.map((v) => {
                  const tier = v.tier as SubscriptionTier | null | undefined;
                  const until = v.subscriptionUntil as number | undefined;
                  const live = tier && (until ?? 0) > now;
                  return (
                    <TRow key={v.id}>
                      <TCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {v.logoImage ? <AvatarImage src={v.logoImage} alt={v.name[locale]} /> : null}
                            <AvatarFallback className="text-[11px] font-semibold text-navy-700">{initials(v.name.en)}</AvatarFallback>
                          </Avatar>
                          <span className="font-semibold">{v.name[locale]}</span>
                        </div>
                      </TCell>
                      <TCell>
                        {live ? <TierPill tier={tier!} t={t} /> : <Badge tone="neutral">{t.subscriptions.tierFree}</Badge>}
                      </TCell>
                      <TCell>{live && until ? formatDate(until, tag) : '—'}</TCell>
                      <TCell className="text-end">
                        <TierControl vendorId={v.id} labels={tierLabels} />
                      </TCell>
                    </TRow>
                  );
                })}
              </TBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
