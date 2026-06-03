'use client';

import * as React from 'react';
import { use } from 'react';
import { Loader2 } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { getProduct, listCategories } from '@/lib/vendor/data';
import { ProductForm, type ProductFormInitial } from '@/components/vendor/product-form';
import type { Category } from '@shared/types';

export default function EditVendorProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { vendor } = useVendorAuth();
  const locale = useVendorLocale();
  const ar = locale === 'ar';

  const [cats, setCats] = React.useState<Category[] | null>(null);
  const [initial, setInitial] = React.useState<ProductFormInitial | null | undefined>(undefined);

  React.useEffect(() => { listCategories().then(setCats).catch(() => setCats([])); }, []);

  React.useEffect(() => {
    let alive = true;
    getProduct(id)
      .then((p) => {
        if (!alive) return;
        if (!p) { setInitial(null); return; }
        setInitial({
          id: p.id,
          titleAr: p.title?.ar ?? '', titleEn: p.title?.en ?? '',
          descAr: p.description?.ar ?? '', descEn: p.description?.en ?? '',
          price: p.price ?? 0,
          prepHours: Math.round((p.durationMinutes ?? 0) / 60),
          images: p.images ?? [],
          categoryIds: p.categoryIds ?? [],
          active: p.active ?? true,
        });
      })
      .catch(() => { if (alive) setInitial(null); });
    return () => { alive = false; };
  }, [id]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-bold text-ink-900">{ar ? 'تعديل المنتج' : 'Edit product'}</h1>
      {initial === undefined || cats === null ? (
        <Loader2 className="size-6 animate-spin text-navy-600" />
      ) : initial === null ? (
        <p className="text-[15px] text-ink-500">{ar ? 'المنتج غير موجود.' : 'Product not found.'}</p>
      ) : vendor ? (
        <ProductForm vendorId={vendor.id} categories={cats} initial={initial} />
      ) : null}
    </div>
  );
}
