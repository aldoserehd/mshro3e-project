import * as React from 'react';
import { MessageSquareWarning } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { liveReviews, liveVendors } from '@/lib/data/live';
import { PageHeader } from '@/components/domain/page-header';
import { Card } from '@/components/ui/card';
import { RatingStars } from '@/components/domain/rating-stars';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';

export default async function ReviewsPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const [reviews, vendors] = await Promise.all([liveReviews(), liveVendors()]);
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';
  const vendor = (id: string) => vendors.find((v) => v.id === id);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.reviews.title} subtitle={t.reviews.subtitle} />

      {reviews.length === 0 ? (
        <Card>
          <EmptyState
            icon={<MessageSquareWarning className="size-7" />}
            title={t.reviews.noReviews}
            body={t.reviews.noReviewsBody}
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {reviews.slice(0, 30).map((r) => {
            const v = vendor(r.vendorId);
            return (
              <Card key={r.id} className="p-5">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{v?.name[locale] ?? '—'}</span>
                  <RatingStars value={r.rating} />
                  <span className="text-[12px] text-ink-500">{r.createdAt ? formatDate(r.createdAt, tag) : ''}</span>
                </div>
                {r.comment ? (
                  <p className="mt-3 text-[14px] leading-[22px] text-ink-900 bg-navy-50/60 rounded-[10px] p-3">
                    {r.comment}
                  </p>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
