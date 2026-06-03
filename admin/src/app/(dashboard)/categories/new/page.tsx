import { getLocale } from '@/lib/locale';
import { PageHeader } from '@/components/domain/page-header';
import { firestoreConfigured } from '@/lib/data/live';
import { CategoryForm } from './category-form';

export default async function NewCategoryPage() {
  const locale = await getLocale();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={locale === 'ar' ? 'فئة جديدة' : 'New category'}
        subtitle={locale === 'ar' ? 'تظهر مباشرة في التطبيق وفي اختيارات البائعين.' : 'Appears in the app and in vendor pickers immediately.'}
      />
      <CategoryForm locale={locale} configured={firestoreConfigured} />
    </div>
  );
}
