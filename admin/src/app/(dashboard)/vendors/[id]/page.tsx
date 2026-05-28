import * as React from 'react';
import { notFound } from 'next/navigation';
import { Tag, MapPin, Phone, MessageCircle, CheckCircle2, Ban } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { getVendor, getVendorMetrics } from '@/lib/data/vendors';
import { PageHeader } from '@/components/domain/page-header';
import { VendorStatusPill, OrderStatusPill } from '@/components/domain/status-pill';
import { RatingStars } from '@/components/domain/rating-stars';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, THead, TBody, TRow, TH, TCell } from '@/components/ui/table';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { seedCategories, seedCustomers } from '@/data/seed';

const initials = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VendorDetailPage({ params }: PageProps) {
  const locale = await getLocale();
  const t = getDict(locale);
  const { id } = await params;
  const vendor = await getVendor(id);
  if (!vendor) notFound();

  const { orders, reviews, products, revenueMtd } = await getVendorMetrics(id);
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';
  const categories = vendor!.categoryIds
    .map((cid) => seedCategories.find((c) => c.id === cid))
    .filter(Boolean);
  const cust = (uid: string) => seedCustomers.find((c) => c.uid === uid);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={vendor!.name[locale]}
        subtitle={vendor!.address?.[locale] ?? ''}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary">
              <CheckCircle2 className="size-4" />
              {t.common.verify}
            </Button>
            <Button variant="ghost" className="text-red-600 hover:text-red-700">
              <Ban className="size-4" />
              {t.common.suspend}
            </Button>
          </div>
        }
      />

      <Card className="p-0 overflow-hidden">
        <div className="h-40 w-full bg-gradient-to-br from-navy-700 to-navy-900 bg-grid-navy relative">
          {vendor!.coverImage ? (
            <img src={vendor!.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          ) : null}
        </div>
        <div className="-mt-10 px-6 pb-5 flex items-end gap-4">
          <Avatar className="h-20 w-20 ring-4 ring-white">
            {vendor!.logoImage ? <AvatarImage src={vendor!.logoImage} /> : null}
            <AvatarFallback className="text-[18px] font-bold text-navy-700">
              {initials(vendor!.name.en)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[22px] font-bold">{vendor!.name[locale]}</h2>
              <VendorStatusPill status={vendor!.status} t={t} />
              {vendor!.verifiedAt ? <Badge tone="info">{t.vendors.verified}</Badge> : null}
            </div>
            <div className="mt-1 flex items-center gap-3 text-[13px] text-ink-500">
              <RatingStars value={vendor!.rating} />
              <span>· {vendor!.reviewCount} {t.vendors.reviewsCount.replace('{n}', '')}</span>
              {categories[0] ? <span>· {categories[0]!.name[locale]}</span> : null}
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t.vendors.tabsOverview}</TabsTrigger>
          <TabsTrigger value="products">{t.vendors.tabsProducts}</TabsTrigger>
          <TabsTrigger value="orders">{t.vendors.tabsOrders}</TabsTrigger>
          <TabsTrigger value="revenue">{t.vendors.tabsRevenue}</TabsTrigger>
          <TabsTrigger value="reviews">{t.vendors.tabsReviews}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <h3 className="font-semibold mb-3">{t.vendors.colCategory}</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Badge key={c!.id} tone="neutral">{c!.name[locale]}</Badge>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-3">{t.common.profile}</h3>
              <ul className="text-[13px] space-y-2 text-ink-500">
                <li className="flex items-center gap-2"><Phone className="size-3.5" />{vendor!.phone}</li>
                {vendor!.whatsapp ? (
                  <li className="flex items-center gap-2"><MessageCircle className="size-3.5" />{vendor!.whatsapp}</li>
                ) : null}
                <li className="flex items-center gap-2"><MapPin className="size-3.5" />{vendor!.address?.[locale]}</li>
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-1">{t.overview.gmvMonth}</h3>
              <div className="text-[28px] font-bold tabular-nums">
                {formatCurrency(revenueMtd, 'KWD', tag)}
              </div>
              <p className="text-[12px] text-ink-500">{orders.length} {t.orders.title}</p>
            </Card>
          </div>
          {vendor!.bio ? (
            <Card className="p-5 mt-4">
              <h3 className="font-semibold mb-2">{t.vendors.tabsOverview}</h3>
              <p className="text-[14px] leading-[22px] text-ink-900">{vendor!.bio[locale]}</p>
            </Card>
          ) : null}
        </TabsContent>

        <TabsContent value="products">
          <Card className="p-0 overflow-hidden">
            <Table>
              <THead>
                <TRow>
                  <TH>{t.vendors.tabsProducts}</TH>
                  <TH className="text-center">{t.common.status}</TH>
                  <TH className="text-end">{t.orders.colTotal}</TH>
                </TRow>
              </THead>
              <TBody>
                {products.map((p) => (
                  <TRow key={p.id}>
                    <TCell className="font-medium">{p.title[locale]}</TCell>
                    <TCell className="text-center">
                      {p.active ? (
                        <Badge tone="success">{t.subscriptions.statusActive}</Badge>
                      ) : (
                        <Badge tone="neutral">{t.common.cancel}</Badge>
                      )}
                    </TCell>
                    <TCell className="text-end tabular-nums font-semibold">
                      {formatCurrency(p.price, p.currency, tag)}
                    </TCell>
                  </TRow>
                ))}
              </TBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="p-0 overflow-hidden">
            <Table>
              <THead>
                <TRow>
                  <TH>{t.orders.colCustomer}</TH>
                  <TH>{t.orders.colDate}</TH>
                  <TH>{t.orders.colStatus}</TH>
                  <TH className="text-end">{t.orders.colTotal}</TH>
                </TRow>
              </THead>
              <TBody>
                {orders.slice(0, 20).map((o) => (
                  <TRow key={o.id}>
                    <TCell>{cust(o.customerUid)?.displayName ?? '—'}</TCell>
                    <TCell>{formatDateTime(o.createdAt, tag)}</TCell>
                    <TCell><OrderStatusPill status={o.status} t={t} /></TCell>
                    <TCell className="text-end tabular-nums font-semibold">
                      {formatCurrency(o.total, o.currency, tag)}
                    </TCell>
                  </TRow>
                ))}
              </TBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card className="p-6">
            <div className="text-[14px] text-ink-500">{t.overview.gmvMonth}</div>
            <div className="text-[40px] font-bold tabular-nums">
              {formatCurrency(revenueMtd, 'KWD', tag)}
            </div>
            <div className="mt-4 text-[12px] text-ink-500">
              {/* TODO: revenue chart per month */}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="grid gap-3">
            {reviews.slice(0, 8).map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-center gap-3">
                  <RatingStars value={r.rating} />
                  <span className="text-[12px] text-ink-500">· {formatDate(r.createdAt, tag)}</span>
                </div>
                {r.comment ? <p className="mt-2 text-[14px]">{r.comment}</p> : null}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
