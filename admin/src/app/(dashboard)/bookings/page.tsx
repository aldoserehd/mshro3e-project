import * as React from 'react';
import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { listBookings } from '@/lib/data/bookings';
import { PageHeader } from '@/components/domain/page-header';
import { BookingStatusPill } from '@/components/domain/status-pill';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, THead, TBody, TRow, TH, TCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrency, cn, formatDateTime } from '@/lib/utils';
import { seedVendors, seedCustomers, seedServices } from '@/data/seed';
import type { BookingStatus } from '@shared/types';

const STATUSES: (BookingStatus | 'all')[] = [
  'all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled_by_customer', 'no_show',
];

const pillCls = (active: boolean) =>
  cn(
    'inline-flex items-center h-9 rounded-full border px-4 text-[13px] font-medium transition-colors',
    active
      ? 'bg-navy-900 text-white border-navy-900'
      : 'bg-white text-navy-900 border-navy-200 hover:bg-navy-50',
  );

const labelFor = (s: BookingStatus | 'all', t: ReturnType<typeof getDict>) =>
  s === 'all' ? t.common.all
  : s === 'pending' ? t.bookings.statusPending
  : s === 'confirmed' ? t.bookings.statusConfirmed
  : s === 'in_progress' ? t.bookings.statusInProgress
  : s === 'completed' ? t.bookings.statusCompleted
  : s === 'cancelled_by_customer' ? t.bookings.statusCancelledCustomer
  : s === 'cancelled_by_vendor' ? t.bookings.statusCancelledVendor
  : t.bookings.statusNoShow;

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string; vendor?: string }>;
}

export default async function BookingsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const t = getDict(locale);
  const sp = await searchParams;
  const bookings = await listBookings({
    status: (sp.status as BookingStatus | 'all') ?? 'all',
    vendorId: sp.vendor ?? 'all',
    customerQuery: sp.q,
  });
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';
  const href = (o: Record<string, string>) => ({ pathname: '/bookings', query: { ...sp, ...o } });

  const lookup = (uid: string) => seedCustomers.find((c) => c.uid === uid);
  const vendorOf = (id: string) => seedVendors.find((v) => v.id === id);
  const svcOf = (id: string) => seedServices.find((s) => s.id === id);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.bookings.title} subtitle={t.bookings.subtitle} />

      <Card className="p-4">
        <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Input name="q" defaultValue={sp.q ?? ''} placeholder={t.bookings.customerFilter} className="lg:max-w-sm" />
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Link key={s} href={href({ status: s })} className={pillCls((sp.status ?? 'all') === s)}>
                {labelFor(s, t)}
              </Link>
            ))}
          </div>
          <Button type="submit" variant="secondary" size="sm" className="lg:ms-auto">
            {t.common.filter}
          </Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        {bookings.length === 0 ? (
          <EmptyState icon={<CalendarCheck className="size-7" />} title={t.bookings.noBookings} />
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>{t.bookings.colCustomer}</TH>
                <TH>{t.bookings.colVendor}</TH>
                <TH>{t.bookings.colService}</TH>
                <TH>{t.bookings.colDate}</TH>
                <TH>{t.bookings.colStatus}</TH>
                <TH className="text-end">{t.bookings.colTotal}</TH>
              </TRow>
            </THead>
            <TBody>
              {bookings.slice(0, 30).map((b) => {
                const cust = lookup(b.customerUid);
                const v = vendorOf(b.vendorId);
                const s = svcOf(b.serviceId);
                return (
                  <TRow key={b.id}>
                    <TCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{cust?.displayName ?? b.customerUid}</span>
                        <span className="text-[12px] text-ink-500">{cust?.phone ?? ''}</span>
                      </div>
                    </TCell>
                    <TCell>{v?.name[locale] ?? '—'}</TCell>
                    <TCell className="text-ink-500">{s?.title[locale] ?? '—'}</TCell>
                    <TCell>{formatDateTime(b.startAt, tag)}</TCell>
                    <TCell><BookingStatusPill status={b.status} t={t} /></TCell>
                    <TCell className="text-end tabular-nums font-semibold">
                      {formatCurrency(b.totalPrice, b.currency, tag)}
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
