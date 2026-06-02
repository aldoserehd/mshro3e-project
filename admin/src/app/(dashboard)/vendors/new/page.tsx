import { getLocale } from '@/lib/locale';
import { PageHeader } from '@/components/domain/page-header';
import { liveCategories, firestoreConfigured } from '@/lib/data/live';
import { VendorForm } from './vendor-form';

export default async function NewVendorPage() {
  const locale = await getLocale();
  const categories = await liveCategories();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={locale === 'ar' ? 'بائع جديد' : 'New vendor'}
        subtitle={locale === 'ar' ? 'أضف متجراً يظهر مباشرة في التطبيق.' : 'Add a storefront — it appears in the app immediately.'}
      />
      <VendorForm locale={locale} categories={categories} configured={firestoreConfigured} />
    </div>
  );
}
