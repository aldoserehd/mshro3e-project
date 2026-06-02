import Link from 'next/link';
import { Plus, Package } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { PageHeader } from '@/components/domain/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Table, THead, TBody, TRow, TH, TCell } from '@/components/ui/table';
import { liveProducts, liveVendors } from '@/lib/data/live';
import { formatCurrency } from '@/lib/utils';

export default async function ProductsPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const [products, vendors] = await Promise.all([liveProducts(), liveVendors()]);
  const vendorName = (id: string) => {
    const v = vendors.find((x) => x.id === id);
    return v ? v.name[locale] || v.name.en : '—';
  };
  const localeTag = locale === 'ar' ? 'ar-KW' : 'en-US';

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t.nav.products}
        subtitle={locale === 'ar' ? 'كل المنتجات المنشورة في التطبيق.' : 'Every listing published to the app.'}
        actions={
          <Button asChild>
            <Link href={'/products/new' as never}>
              <Plus className="size-4" />
              {locale === 'ar' ? 'منتج جديد' : 'New product'}
            </Link>
          </Button>
        }
      />

      <Card className="p-0 overflow-hidden">
        {products.length === 0 ? (
          <EmptyState
            icon={<Package className="size-7" />}
            title={locale === 'ar' ? 'لا توجد منتجات بعد' : 'No products yet'}
          />
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>{locale === 'ar' ? 'المنتج' : 'Product'}</TH>
                <TH>{locale === 'ar' ? 'البائع' : 'Vendor'}</TH>
                <TH className="text-end">{locale === 'ar' ? 'السعر' : 'Price'}</TH>
              </TRow>
            </THead>
            <TBody>
              {products.map((p) => (
                <TRow key={p.id}>
                  <TCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.images?.[0] || ''}
                        alt=""
                        className="h-10 w-10 rounded-[8px] object-cover bg-navy-50 shrink-0"
                      />
                      <span className="font-semibold text-ink-900">{p.title[locale] || p.title.en}</span>
                    </div>
                  </TCell>
                  <TCell><span className="text-ink-500">{vendorName(p.vendorId)}</span></TCell>
                  <TCell className="text-end tabular-nums font-semibold">
                    {formatCurrency(p.price, p.currency || 'KWD', localeTag)}
                  </TCell>
                </TRow>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
