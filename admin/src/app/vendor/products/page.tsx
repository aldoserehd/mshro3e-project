'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, Package, Pencil, Trash2, Loader2, Store, EyeOff } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { listMyProducts, deleteProduct } from '@/lib/vendor/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Service } from '@shared/types';

export default function VendorProductsPage() {
  const { vendor } = useVendorAuth();
  const locale = useVendorLocale();
  const ar = locale === 'ar';
  const [products, setProducts] = React.useState<Service[] | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!vendor) { setProducts([]); return; }
    try { setProducts(await listMyProducts(vendor.id)); } catch { setProducts([]); }
  }, [vendor]);

  React.useEffect(() => { load(); }, [load]);

  const onDelete = async (id: string) => {
    if (!confirm(ar ? 'حذف هذا المنتج؟' : 'Delete this product?')) return;
    setDeleting(id);
    try { await deleteProduct(id); setProducts((p) => (p ?? []).filter((x) => x.id !== id)); }
    catch { /* ignore */ }
    finally { setDeleting(null); }
  };

  const fmt = (n: number) => (ar ? `${n} د.ك` : `KWD ${n}`);

  if (!vendor) {
    return (
      <Card className="p-8 flex flex-col items-center text-center gap-3 max-w-lg">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-navy-50 text-navy-700"><Store className="size-6" /></span>
        <p className="text-[15px] text-ink-900">{ar ? 'أنشئ متجرك أول شي.' : 'Create your storefront first.'}</p>
        <Button asChild><Link href={'/vendor/storefront' as never}>{ar ? 'إنشاء المتجر' : 'Create storefront'}</Link></Button>
      </Card>
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
        <Card className="p-10 flex justify-center"><Loader2 className="size-6 animate-spin text-navy-600" /></Card>
      ) : products.length === 0 ? (
        <Card className="p-10 flex flex-col items-center text-center gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-navy-50 text-navy-700"><Package className="size-6" /></span>
          <p className="text-[15px] text-ink-900">{ar ? 'لا توجد منتجات بعد' : 'No products yet'}</p>
          <Button asChild><Link href={'/vendor/products/new' as never}>{ar ? 'أضف أول منتج' : 'Add your first product'}</Link></Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {products.map((p) => (
            <Card key={p.id} className="flex items-center gap-4 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.images?.[0] || ''} alt="" className="size-14 rounded-[10px] object-cover bg-navy-50 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink-900 truncate">{p.title[locale] || p.title.en}</p>
                  {!p.active && <span className="inline-flex items-center gap-1 text-[11px] text-ink-500"><EyeOff className="size-3" />{ar ? 'مخفي' : 'Hidden'}</span>}
                </div>
                <p className="text-[13px] font-semibold text-navy-700 tabular-nums">{fmt(p.price)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button asChild variant="ghost" size="icon" aria-label="edit"><Link href={`/vendor/products/${p.id}` as never}><Pencil className="size-4" /></Link></Button>
                <Button variant="ghost" size="icon" aria-label="delete" onClick={() => onDelete(p.id)} disabled={deleting === p.id}>
                  {deleting === p.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4 text-red-600" />}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
