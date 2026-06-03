import * as React from 'react';
import { CreditCard, Check, Info } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { listVendors } from '@/lib/data/vendors';
import { overviewMetrics } from '@/data/seed';
import { PageHeader } from '@/components/domain/page-header';
import { TierPill, SubscriptionStatusPill } from '@/components/domain/status-pill';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, THead, TBody, TRow, TH, TCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { KpiCard } from '@/components/ui/kpi-card';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { SubscriptionStatus, SubscriptionTier } from '@shared/types';

const initials = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

/**
 * PLACEHOLDER prices — exact amounts are TBD. Each plan is offered on a
 * 1-month or 3-month cycle. `m3` is the total charged for 3 months (a small
 * discount vs. 3× the monthly rate). Replace with real pricing later.
 */
const TIER_PRICES: Record<SubscriptionTier, { m1: number; m3: number }> = {
  basic: { m1: 9, m3: 24 },
  pro: { m1: 15, m3: 39 },
  managed: { m1: 23, m3: 60 },
};

// Phase 2 placeholder — assigns mock tiers/statuses/cycles by index. Real Firestore later.
const fakeTierFor = (i: number): SubscriptionTier => (['basic', 'pro', 'managed'] as const)[i % 3];
const fakeStatusFor = (i: number): SubscriptionStatus =>
  (['active', 'active', 'active', 'trialing', 'past_due', 'paused'] as const)[i % 6];
const fakeCycleFor = (i: number): 1 | 3 => (i % 5 === 0 ? 3 : 1);

export default async function SubscriptionsPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const vendors = await listVendors({});
  const m = overviewMetrics();
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';

  const plans: { tier: SubscriptionTier; label: string; feats: string[]; popular?: boolean }[] = [
    { tier: 'basic', label: t.subscriptions.tierBasic, feats: [t.subscriptions.featBasic1, t.subscriptions.featBasic2, t.subscriptions.featBasic3] },
    { tier: 'pro', label: t.subscriptions.tierPro, feats: [t.subscriptions.featPro1, t.subscriptions.featPro2, t.subscriptions.featPro3], popular: true },
    { tier: 'managed', label: t.subscriptions.tierManaged, feats: [t.subscriptions.featManaged1, t.subscriptions.featManaged2, t.subscriptions.featManaged3] },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.subscriptions.title} subtitle={t.subscriptions.subtitle} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4"><KpiCard label={t.subscriptions.mrr} value={<span className="tabular-nums">{formatCurrency(m.mrr, 'KWD', tag)}</span>} /></Card>
        <Card className="p-4"><KpiCard label={t.subscriptions.tierBasic} value={<span className="tabular-nums">{m.tierBreakdown.basic}</span>} /></Card>
        <Card className="p-4"><KpiCard label={t.subscriptions.tierPro} value={<span className="tabular-nums">{m.tierBreakdown.pro}</span>} /></Card>
        <Card className="p-4"><KpiCard label={t.subscriptions.tierManaged} value={<span className="tabular-nums">{m.tierBreakdown.managed}</span>} /></Card>
      </div>

      {/* Plans & pricing — 1-month / 3-month structure, placeholder prices. */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-[18px] font-bold text-ink-900">{t.subscriptions.plansTitle}</h2>
            <p className="text-[13px] text-ink-500">{t.subscriptions.plansSubtitle}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-500">
            <Info className="size-3.5" />
            {t.subscriptions.placeholderNote}
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

      {/* Active subscriptions table. */}
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
                  <TH>{t.subscriptions.colCycle}</TH>
                  <TH>{t.subscriptions.colStatus}</TH>
                  <TH className="text-end">{t.subscriptions.colPrice}</TH>
                  <TH>{t.subscriptions.colRenewsAt}</TH>
                </TRow>
              </THead>
              <TBody>
                {vendors.map((v, i) => {
                  const tier = fakeTierFor(i);
                  const status = fakeStatusFor(i);
                  const cycle = fakeCycleFor(i);
                  const price = cycle === 3 ? TIER_PRICES[tier].m3 : TIER_PRICES[tier].m1;
                  const renewsAt = Date.now() + ((i % 28) + 2) * 24 * 60 * 60 * 1000;
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
                      <TCell><TierPill tier={tier} t={t} /></TCell>
                      <TCell>
                        <span className="text-ink-500">
                          {cycle === 3 ? t.subscriptions.cycle3mo : t.subscriptions.cycle1mo}
                        </span>
                      </TCell>
                      <TCell><SubscriptionStatusPill status={status} t={t} /></TCell>
                      <TCell className="text-end tabular-nums font-semibold">{formatCurrency(price, 'KWD', tag)}</TCell>
                      <TCell>{formatDate(renewsAt, tag)}</TCell>
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
