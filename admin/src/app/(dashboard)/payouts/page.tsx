import * as React from 'react';
import { Wallet, Check, X } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { listPayouts } from '@/lib/data/payouts';
import { PageHeader } from '@/components/domain/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, THead, TBody, TRow, TH, TCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrency, formatDate } from '@/lib/utils';
import { seedVendors } from '@/data/seed';
import type { PayoutRequest } from '@shared/types';

const labelFor = (s: PayoutRequest['status'], t: ReturnType<typeof getDict>) =>
  s === 'pending' ? t.payouts.statusPending
  : s === 'approved' ? t.payouts.statusApproved
  : s === 'paid' ? t.payouts.statusPaid
  : t.payouts.statusRejected;

const toneFor = (s: PayoutRequest['status']): 'warning' | 'info' | 'success' | 'danger' =>
  s === 'pending' ? 'warning' : s === 'approved' ? 'info' : s === 'paid' ? 'success' : 'danger';

export default async function PayoutsPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const payouts = await listPayouts();
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';
  const vendor = (id: string) => seedVendors.find((v) => v.id === id);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.payouts.title} subtitle={t.payouts.subtitle} />

      <Card className="p-0 overflow-hidden">
        {payouts.length === 0 ? (
          <EmptyState icon={<Wallet className="size-7" />} title={t.payouts.noPayouts} />
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>{t.payouts.colVendor}</TH>
                <TH className="text-end">{t.payouts.colAmount}</TH>
                <TH className="text-end">{t.payouts.colBalance}</TH>
                <TH>{t.payouts.colLastPayout}</TH>
                <TH>{t.payouts.colRequestedAt}</TH>
                <TH>{t.payouts.colStatus}</TH>
                <TH className="text-end">{t.common.actions}</TH>
              </TRow>
            </THead>
            <TBody>
              {payouts.map((p) => {
                const v = vendor(p.vendorId);
                return (
                  <TRow key={p.id}>
                    <TCell className="font-semibold">{v?.name[locale] ?? '—'}</TCell>
                    <TCell className="text-end tabular-nums">{formatCurrency(p.amount, p.currency, tag)}</TCell>
                    <TCell className="text-end tabular-nums text-ink-500">
                      {formatCurrency(p.vendorBalance, p.currency, tag)}
                    </TCell>
                    <TCell className="text-ink-500">{p.lastPayoutAt ? formatDate(p.lastPayoutAt, tag) : '—'}</TCell>
                    <TCell>{formatDate(p.requestedAt, tag)}</TCell>
                    <TCell><Badge tone={toneFor(p.status)}>{labelFor(p.status, t)}</Badge></TCell>
                    <TCell className="text-end">
                      {p.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="secondary">
                            <Check className="size-3.5" />
                            {t.common.approve}
                          </Button>
                          <Button size="sm" variant="ghost">
                            <X className="size-3.5" />
                            {t.common.reject}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[12px] text-ink-500">—</span>
                      )}
                    </TCell>
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
