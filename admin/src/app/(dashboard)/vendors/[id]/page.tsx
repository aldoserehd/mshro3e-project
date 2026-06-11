import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Phone, MessageCircle, CheckCircle2, Ban, ChevronLeft, ChevronRight } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { tFmt } from '@/i18n/dict';
import { getVendor, getVendorMetrics } from '@/lib/data/vendors';
import { liveCategories } from '@/lib/data/live';
import { PageHeader } from '@/components/domain/page-header';
import { VendorActionButton } from '@/components/domain/vendor-action-button';
import { approveVendor, rejectVendor, verifyVendor, suspendVendor, activateVendor } from '@/lib/actions/vendors';
import { EmptyState } from '@/components/ui/empty-state';
import { Package as PackageIcon, Inbox, MessageSquare, TrendingUp } from 'lucide-react';
import { VendorStatusPill } from '@/components/domain/status-pill';
import { RatingStars } from '@/components/domain/rating-stars';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, THead, TBody, TRow, TH, TCell } from '@/components/ui/table';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

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

  const [{ leads, reviews, products, soldKwd }, allCategories] = await Promise.all([
    getVendorMetrics(id),
    liveCategories(),
  ]);
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';
  const categories = (vendor!.categoryIds ?? [])
    .map((cid) => allCategories.find((c) => c.id === cid))
    .filter(Boolean);
  const BackIcon = locale === 'ar' ? ChevronRight : ChevronLeft;

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-[13px] text-ink-500">
        <Link
          href="/vendors"
          className="inline-flex items-center gap-1 font-medium text-navy-500 hover:text-navy-700"
        >
          <BackIcon className="size-4" />
          {t.vendors.title}
        </Link>
        <span aria-hidden className="text-ink-200">/</span>
        <span className="text-ink-900 font-medium truncate max-w-[40ch]">{vendor!.name[locale]}</span>
      </nav>

      <PageHeader
        title={vendor!.name[locale]}
        subtitle={vendor!.address?.[locale] ?? ''}
        actions={
          <div className="flex gap-2">
            {vendor!.status === 'pending' && (
              <>
                <VendorActionButton
                  variant="secondary"
                  action={approveVendor.bind(null, id)}
                  confirm={t.vendors.approveConfirm}
                  success={t.vendors.approved}
                  failure={t.vendors.actionFailed}
                >
                  <CheckCircle2 className="size-4" />
                  {t.common.approve}
                </VendorActionButton>
                <VendorActionButton
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                  action={rejectVendor.bind(null, id)}
                  confirm={t.vendors.rejectConfirm}
                  success={t.vendors.rejected}
                  failure={t.vendors.actionFailed}
                >
                  {t.common.reject}
                </VendorActionButton>
              </>
            )}

            {vendor!.status !== 'pending' && !vendor!.verifiedAt && (
              <VendorActionButton
                variant="secondary"
                action={verifyVendor.bind(null, id)}
                success={t.vendors.verifiedDone}
                failure={t.vendors.actionFailed}
              >
                <CheckCircle2 className="size-4" />
                {t.common.verify}
              </VendorActionButton>
            )}

            {vendor!.status === 'suspended' ? (
              <VendorActionButton
                variant="secondary"
                action={activateVendor.bind(null, id)}
                success={t.vendors.activated}
                failure={t.vendors.actionFailed}
              >
                <CheckCircle2 className="size-4" />
                {t.common.activate}
              </VendorActionButton>
            ) : vendor!.status !== 'pending' && vendor!.status !== 'rejected' ? (
              <VendorActionButton
                variant="ghost"
                className="text-red-600 hover:text-red-700"
                action={suspendVendor.bind(null, id)}
                confirm={t.vendors.suspendConfirm}
                success={t.vendors.suspended}
                failure={t.vendors.actionFailed}
              >
                <Ban className="size-4" />
                {t.common.suspend}
              </VendorActionButton>
            ) : null}
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
              <span>· {tFmt(t.vendors.reviewsCount, { n: vendor!.reviewCount })}</span>
              {categories[0] ? <span>· {categories[0]!.name[locale]}</span> : null}
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t.vendors.tabsOverview}</TabsTrigger>
          <TabsTrigger value="products">{t.vendors.tabsProducts}</TabsTrigger>
          <TabsTrigger value="leads">{t.vendors.tabsLeads}</TabsTrigger>
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
              <h3 className="font-semibold mb-1">{t.vendors.leadsMonth}</h3>
              <div className="text-[28px] font-bold tabular-nums">{leads.length}</div>
              <p className="text-[12px] text-ink-500">
                {soldKwd > 0
                  ? `${formatCurrency(soldKwd, 'KWD', tag)} · ${t.vendors.trackedSales}`
                  : t.vendors.tabsLeads}
              </p>
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
            {products.length === 0 ? (
              <EmptyState icon={<PackageIcon className="size-7" />} title={t.products.empty} />
            ) : (
            <Table>
              <THead>
                <TRow>
                  <TH>{t.vendors.tabsProducts}</TH>
                  <TH className="text-center">{t.common.status}</TH>
                  <TH className="text-end">{t.products.colPrice}</TH>
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
            )}
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card className="p-0 overflow-hidden">
            {leads.length === 0 ? (
              <EmptyState icon={<Inbox className="size-7" />} title={t.vendors.noLeads} />
            ) : (
            <Table>
              <THead>
                <TRow>
                  <TH>{t.vendors.tabsProducts}</TH>
                  <TH>{t.vendors.joinedAt}</TH>
                  <TH className="text-center">{t.common.status}</TH>
                  <TH className="text-end">{t.vendors.colRef}</TH>
                </TRow>
              </THead>
              <TBody>
                {leads.slice(0, 30).map((l) => (
                  <TRow key={l.id}>
                    <TCell className="font-medium">{l.productTitle ?? '—'}</TCell>
                    <TCell>{formatDateTime(l.createdAt ?? 0, tag)}</TCell>
                    <TCell className="text-center">
                      {l.status === 'sold' ? (
                        <Badge tone="success">
                          <TrendingUp className="size-3" />
                          {l.saleAmount ? formatCurrency(l.saleAmount, 'KWD', tag) : t.vendors.soldLabel}
                        </Badge>
                      ) : l.status === 'replied' ? (
                        <Badge tone="info">{t.vendors.repliedLabel}</Badge>
                      ) : (
                        <Badge tone="warning">{t.vendors.newLabel}</Badge>
                      )}
                    </TCell>
                    <TCell className="text-end font-mono text-[12px] text-navy-700">{l.ref}</TCell>
                  </TRow>
                ))}
              </TBody>
            </Table>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          {reviews.length === 0 ? (
            <Card><EmptyState icon={<MessageSquare className="size-7" />} title={t.reviews.noReviews} /></Card>
          ) : (
            <div className="grid gap-3">
              {reviews.slice(0, 8).map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <RatingStars value={r.rating} />
                    <span className="text-[12px] text-ink-500">· {formatDate(r.createdAt ?? 0, tag)}</span>
                  </div>
                  {r.comment ? <p className="mt-2 text-[14px]">{r.comment}</p> : null}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
