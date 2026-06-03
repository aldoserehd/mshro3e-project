import * as React from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict, tFmt } from '@/i18n/dict';
import { listOrders } from '@/lib/data/orders';
import { PageHeader } from '@/components/domain/page-header';
import { OrderStatusPill } from '@/components/domain/status-pill';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, THead, TBody, TRow, TH, TCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrency, cn, formatDate } from '@/lib/utils';
import { seedVendors, seedCustomers } from '@/data/seed';
import type { OrderStatus } from '@shared/types';

const STATUSES: (OrderStatus | 'all')[] = ['all', 'pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const pillCls = (active: boolean) =>
  cn(
    'inline-flex items-center h-9 rounded-full border px-4 text-[13px] font-medium transition-colors',
    active ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-900 border-navy-200 hover:bg-navy-50',
  );

const labelFor = (s: OrderStatus | 'all', t: ReturnType<typeof getDict>) =>
  s === 'all' ? t.common.all
  : s === 'pending' ? t.orders.statusPending
  : s === 'paid' ? t.orders.statusPaid
  : s === 'preparing' ? t.orders.statusPreparing
  : s === 'shipped' ? t.orders.statusShipped
  : s === 'delivered' ? t.orders.statusDelivered
  : s === 'cancelled' ? t.orders.statusCancelled
  : t.orders.statusRefunded;

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const t = getDict(locale);
  const sp = await searchParams;
  const orders = await listOrders({
    status: (sp.status as OrderStatus | 'all') ?? 'all',
    customerQuery: sp.q,
  });
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';
  const href = (o: Record<string, string>) => ({ pathname: '/orders', query: { ...sp, ...o } });

  const cust = (uid: string) => seedCustomers.find((c) => c.uid === uid);
  const vendor = (id: string) => seedVendors.find((v) => v.id === id);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.orders.title} subtitle={t.orders.subtitle} />

      <Card className="p-4">
        <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Input name="q" defaultValue={sp.q ?? ''} placeholder={t.common.searchPlaceholder} className="lg:max-w-sm" />
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Link key={s} href={href({ status: s })} className={pillCls((sp.status ?? 'all') === s)}>
                {labelFor(s, t)}
              </Link>
            ))}
          </div>
          <Button type="submit" variant="secondary" size="sm" className="lg:ms-auto">{t.common.filter}</Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        {orders.length === 0 ? (
          <EmptyState icon={<Package className="size-7" />} title={t.orders.noOrders} />
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>{t.orders.colId}</TH>
                <TH>{t.orders.colCustomer}</TH>
                <TH>{t.orders.colVendor}</TH>
                <TH className="text-center">{t.orders.colItems}</TH>
                <TH>{t.orders.colStatus}</TH>
                <TH>{t.orders.colDate}</TH>
                <TH className="text-end">{t.orders.colTotal}</TH>
              </TRow>
            </THead>
            <TBody>
              {orders.slice(0, 30).map((o) => (
                <TRow key={o.id}>
                  <TCell className="font-mono text-[12px]">{o.id}</TCell>
                  <TCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{cust(o.customerUid)?.displayName ?? '—'}</span>
                      <span className="text-[12px] text-ink-500">{cust(o.customerUid)?.phone ?? ''}</span>
                    </div>
                  </TCell>
                  <TCell>{vendor(o.vendorId)?.name[locale] ?? '—'}</TCell>
                  <TCell className="text-center">{o.items.reduce((s, i) => s + i.quantity, 0)}</TCell>
                  <TCell><OrderStatusPill status={o.status} t={t} /></TCell>
                  <TCell>{formatDate(o.createdAt, tag)}</TCell>
                  <TCell className="text-end tabular-nums font-semibold">
                    {formatCurrency(o.total, o.currency, tag)}
                  </TCell>
                </TRow>
              ))}
            </TBody>
          </Table>
        )}
        {orders.length > 0 ? (
          <div className="border-t border-ink-200/70 px-4 py-3 text-[12px] text-ink-500">
            {tFmt(t.common.showing, { n: Math.min(orders.length, 30), total: orders.length })}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
