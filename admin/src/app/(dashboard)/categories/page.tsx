import * as React from 'react';
import { Tag, Plus, ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { listCategories } from '@/lib/data/categories';
import { PageHeader } from '@/components/domain/page-header';
import { ActionButton } from '@/components/domain/action-button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { seedVendors } from '@/data/seed';

export default async function CategoriesPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const categories = await listCategories();
  const countFor = (id: string) => seedVendors.filter((v) => v.categoryIds.includes(id)).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t.categories.title}
        subtitle={t.categories.subtitle}
        actions={
          <ActionButton toastMessage={t.categories.addedSoon} toastDescription={t.common.demoAction}>
            <Plus className="size-4" />
            {t.categories.addNew}
          </ActionButton>
        }
      />

      {categories.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Tag className="size-7" />}
            title={t.categories.noCategories}
            body={t.categories.noCategoriesBody}
          />
        </Card>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-ink-200/70">
            {categories.map((c, i) => (
              <li key={c.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-navy-700">
                  <Tag className="size-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-semibold">{c.name[locale]}</span>
                  <span className="text-[12px] text-ink-500">
                    {c.slug} · {countFor(c.id)} {t.categories.vendorsLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ActionButton size="icon" variant="ghost" disabled={i === 0} aria-label={t.categories.moveUp} toastMessage={t.categories.reordered} toastDescription={t.common.demoAction}>
                    <ChevronUp className="size-4" />
                  </ActionButton>
                  <ActionButton size="icon" variant="ghost" disabled={i === categories.length - 1} aria-label={t.categories.moveDown} toastMessage={t.categories.reordered} toastDescription={t.common.demoAction}>
                    <ChevronDown className="size-4" />
                  </ActionButton>
                  <ActionButton size="icon" variant="ghost" aria-label={t.common.edit} toastMessage={t.categories.addedSoon} toastDescription={t.common.demoAction}>
                    <Pencil className="size-4" />
                  </ActionButton>
                  <ActionButton size="icon" variant="ghost" aria-label={t.common.delete} className="text-red-600 hover:text-red-700" confirm={t.categories.deleteConfirm} toastMessage={t.categories.deleted} toastDescription={t.common.demoAction}>
                    <Trash2 className="size-4" />
                  </ActionButton>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
