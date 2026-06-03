import * as React from 'react';
import Link from 'next/link';
import { MessageSquareWarning, Star } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { listReviews } from '@/lib/data/reviews';
import { PageHeader } from '@/components/domain/page-header';
import { ActionButton } from '@/components/domain/action-button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/components/domain/rating-stars';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatDate } from '@/lib/utils';
import { seedVendors, seedCustomers } from '@/data/seed';

const pillCls = (active: boolean) =>
  cn(
    'inline-flex items-center h-9 rounded-full border px-4 text-[13px] font-medium',
    active ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-900 border-navy-200 hover:bg-navy-50',
  );

interface PageProps {
  searchParams: Promise<{ tab?: 'flagged' | 'all' }>;
}

export default async function ReviewsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const t = getDict(locale);
  const sp = await searchParams;
  const tab = sp.tab ?? 'flagged';
  const reviews = await listReviews({ flaggedOnly: tab === 'flagged' });
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';

  const vendor = (id: string) => seedVendors.find((v) => v.id === id);
  const cust = (uid: string) => seedCustomers.find((c) => c.uid === uid);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t.reviews.title}
        subtitle={t.reviews.subtitle}
        actions={
          <div className="flex gap-2">
            <Link href={{ pathname: '/reviews', query: { tab: 'flagged' } }} className={pillCls(tab === 'flagged')}>
              {t.reviews.tabFlagged}
            </Link>
            <Link href={{ pathname: '/reviews', query: { tab: 'all' } }} className={pillCls(tab === 'all')}>
              {t.reviews.tabAll}
            </Link>
          </div>
        }
      />

      {reviews.length === 0 ? (
        <Card><EmptyState icon={<MessageSquareWarning className="size-7" />} title={t.reviews.noReviews} /></Card>
      ) : (
        <div className="grid gap-4">
          {reviews.slice(0, 20).map((r) => {
            const v = vendor(r.vendorId);
            const c = cust(r.customerUid);
            return (
              <Card key={r.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{c?.displayName ?? '—'}</span>
                      <span className="text-[12px] text-ink-500">→</span>
                      <span className="text-ink-500">{v?.name[locale] ?? '—'}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <RatingStars value={r.rating} />
                      <span className="text-[12px] text-ink-500">{formatDate(r.createdAt, tag)}</span>
                      {r.flagged ? <Badge tone="danger">{t.reviews.flagged}</Badge> : null}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {r.flagged ? (
                      <ActionButton
                        size="sm"
                        variant="secondary"
                        toastMessage={t.reviews.unflag}
                        toastDescription={t.common.demoAction}
                      >
                        {t.reviews.unflag}
                      </ActionButton>
                    ) : null}
                    <ActionButton
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      confirm={t.reviews.hideConfirm}
                      toastMessage={t.reviews.hide}
                      toastDescription={t.common.demoAction}
                    >
                      {t.reviews.hide}
                    </ActionButton>
                  </div>
                </div>
                {r.comment ? (
                  <p className="mt-3 text-[14px] leading-[22px] text-ink-900 bg-navy-50/60 rounded-[10px] p-3">
                    {r.comment}
                  </p>
                ) : null}
                {r.vendorReply ? (
                  <div className="mt-2 ms-6 text-[13px] text-ink-500">
                    <span className="font-semibold text-navy-700">↳ {v?.name[locale]}: </span>
                    {r.vendorReply}
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
