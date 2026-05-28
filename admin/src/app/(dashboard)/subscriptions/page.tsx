import * as React from 'react';
import { CreditCard } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { listVendors } from '@/lib/data/vendors';
import { overviewMetrics } from '@/data/seed';
import { PageHeader } from '@/components/domain/page-header';
import { TierPill, SubscriptionStatusPill } from '@/components/domain/status-pill';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, THead, TBody, TRow, TH, TCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { KpiCard } from '@/components/ui/kpi-card';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { SubscriptionStatus, SubscriptionTier } from '@shared/types';

const initials = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

const TIER_PRICES: Record<SubscriptionTier, number> = {
  basic: 9,
  pro: 15,
  managed: 23,
};

// Phase 2 placeholder — assigns mock tiers and statuses by index. Real Firestore later.
const fakeTierFor = (i: number): SubscriptionTier => (['basic', 'pro', 'managed'] as const)[i % 3];
const fakeStatusFor = (i: number): SubscriptionStatus =>
  (['active', 'active', 'active', 'trialing', 'past_due', 'paused'] as const)[i % 6];

export default async function SubscriptionsPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const vendors = await listVendors({});
  const m = overviewMetrics();
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.subscriptions.title} subtitle={t.subscriptions.subtitle} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4"><KpiCard label={t.subscriptions.mrr} value={<span className="tabular-nums">{formatCurrency(m.mrr, 'KWD', tag)}</span>} /></Card>
        <Card className="p-4"><KpiCard label={t.subscriptions.tierBasic} value={<span className="tabular-nums">{m.tierBreakdown.basic}</span>} /></Card>
        <Card className="p-4"><KpiCard label={t.subscriptions.tierPro} value={<span className="tabular-nums">{m.tierBreakdown.pro}</span>} /></Card>
        <Card className="p-4"><KpiCard label={t.subscriptions.tierManaged} value={<span className="tabular-nums">{m.tierBreakdown.managed}</span>} /></Card>
      </div>

      <Card className="p-0 overflow-hidden">
        {vendors.length === 0 ? (
          <EmptyState icon={<CreditCard className="size-7" />} title={t.subscriptions.noSubscriptions} />
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>{t.subscriptions.colVendor}</TH>
                <TH>{t.subscriptions.colTier}</TH>
                <TH>{t.subscriptions.colStatus}</TH>
                <TH className="text-end">{t.subscriptions.colPrice}</TH>
                <TH>{t.subscriptions.colRenewsAt}</TH>
              </TRow>
            </THead>
            <TBody>
              {vendors.map((v, i) => {
                const tier = fakeTierFor(i);
                const status = fakeStatusFor(i);
                const price = TIER_PRICES[tier];
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
  );
}
