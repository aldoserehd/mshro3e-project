'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, Package, Pencil, Trash2, Loader2, Store, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { listMyProducts, deleteProduct } from '@/lib/vendor/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState, EmptyState, ErrorState } from '@/components/vendor/states';
import type { Service } from '@shared/types';

export default function VendorProductsPage() {
  const { vendor } = useVendorAuth();
  const locale = useVendorLocale();
  const ar = locale === 'ar';
  const [products, setProducts] = React.useState<Service[] | null>(null);
  const [error, setError] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!vendor) { setProducts([]); return; }
    setProducts(null); setError(false);
    try { setProducts(await listMyProducts(vendor.id)); } catch { setError(true); setProducts([]); }
  }, [vendor]);

  React.useEffect(() => { load(); }, [load]);

  const onDelete = async (id: string) => {
    if (!confirm(ar ? 'حذف هذا المنتج؟' : 'Delete this product?')) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts((p) => (p ?? []).filter((x) => x.id !== id));
      toast.success(ar ? 'تم حذف المنتج.' : 'Product deleted.');
    } catch {
      toast.error(ar ? 'تعذّر حذف المنتج.' : 'Could not delete product.');
    } finally { setDeleting(null); }
  };

  const fmt = (n: number) => (ar ? `${n} د.ك` : `KWD ${n}`);

  if (!vendor) {
    return (
      <EmptyState
        icon={<Store className="size-6" />}
        title={ar ? 'أنشئ متجرك أول شي' : 'Create your storefront first'}
        hint={ar ? 'تحتاج متجراً قبل إضافة المنتجات.' : 'You need a storefront before adding products.'}
        ctaLabel={ar ? 'إنشاء المتجر' : 'Create storefront'}
        ctaHref="/vendor/storefront"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-ink-900">{ar ? 'منتجاتي' : 'My products'}</h1>
          <p className="mt-1 text-[14px] text-ink-500">{ar ? 'تظهر مباشرة في التطبيق.' : 'They appear in the app immediately.'}</p>
        </div>
        <Button asChild><Link href={'/vendor/products/new' as never}><Plus className="size-4" />{ar ? 'منتج جديد' : 'New product'}</Link></Button>
      </div>

      {products === null ? (
        <LoadingState />
      ) : error ? (
        <ErrorState title={ar ? 'تعذّر تحميل المنتجات.' : 'Could not load products.'} retryLabel={ar ? 'إعادة المحاولة' : 'Retry'} onRetry={load} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Package className="size-6" />}
          title={ar ? 'لا توجد منتجات بعد' : 'No products yet'}
          hint={ar ? 'أضف أول منتج وبيظهر مباشرة للعملاء في التطبيق.' : 'Add your first product and it appears to customers right away.'}
          ctaLabel={ar ? 'أضف أول منتج' : 'Add your first product'}
          ctaHref="/vendor/products/new"
        />
      ) : (
        <div className="grid gap-3">
          {products.map((p) => {
            const img = p.images?.[0];
            return (
              <Card key={p.id} className={`flex items-center gap-4 p-3 transition-colors ${p.active ? '' : 'bg-navy-50/40'}`}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className={`size-14 rounded-[10px] object-cover bg-navy-50 shrink-0 ${p.active ? '' : 'opacity-60'}`} />
                ) : (
                  <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-[10px] bg-navy-50 text-navy-300">
                    <Package className="size-5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="font-semibold text-ink-900 truncate">{p.title[locale] || p.title.en}</p>
                    {p.active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-500" />{ar ? 'ظاهر' : 'Live'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-ink-500"><EyeOff className="size-3" />{ar ? 'مخفي' : 'Hidden'}</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[13px] font-semibold text-navy-700 tabular-nums">{fmt(p.price)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button asChild variant="ghost" size="icon" aria-label={ar ? 'تعديل' : 'edit'}><Link href={`/vendor/products/${p.id}` as never}><Pencil className="size-4" /></Link></Button>
                  <Button variant="ghost" size="icon" aria-label={ar ? 'حذف' : 'delete'} onClick={() => onDelete(p.id)} disabled={deleting === p.id}>
                    {deleting === p.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4 text-red-600" />}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
