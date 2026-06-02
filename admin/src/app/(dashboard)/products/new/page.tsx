import { getLocale } from '@/lib/locale';
import { PageHeader } from '@/components/domain/page-header';
import { liveCategories, liveVendors, firestoreConfigured } from '@/lib/data/live';
import { ProductForm } from './product-form';

export default async function NewProductPage() {
  const locale = await getLocale();
  const [categories, vendors] = await Promise.all([liveCategories(), liveVendors()]);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={locale === 'ar' ? 'منتج جديد' : 'New product'}
        subtitle={locale === 'ar' ? 'انشر منتجاً يظهر مباشرة في التطبيق.' : 'Publish a listing — it appears in the app immediately.'}
      />
      <ProductForm locale={locale} categories={categories} vendors={vendors} configured={firestoreConfigured} />
    </div>
  );
}
