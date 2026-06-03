'use client';

import * as React from 'react';
import Link from 'next/link';
import { Loader2, Store } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { listCategories } from '@/lib/vendor/data';
import { ProductForm } from '@/components/vendor/product-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Category } from '@shared/types';

export default function NewVendorProductPage() {
  const { vendor } = useVendorAuth();
  const locale = useVendorLocale();
  const ar = locale === 'ar';
  const [cats, setCats] = React.useState<Category[] | null>(null);

  React.useEffect(() => { listCategories().then(setCats).catch(() => setCats([])); }, []);

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
      <h1 className="text-[28px] font-bold text-ink-900">{ar ? 'منتج جديد' : 'New product'}</h1>
      {cats === null ? <Loader2 className="size-6 animate-spin text-navy-600" /> : <ProductForm vendorId={vendor.id} categories={cats} />}
    </div>
  );
}
