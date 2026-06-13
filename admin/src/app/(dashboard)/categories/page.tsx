import * as React from 'react';
import Link from 'next/link';
import { Tag, Plus } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict, tFmt } from '@/i18n/dict';
import { liveCategories, liveVendors } from '@/lib/data/live';
import { PageHeader } from '@/components/domain/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { DeleteCategoryButton } from './delete-category-button';
import { StarterPackButton } from './starter-pack-button';

export default async function CategoriesPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const [categories, vendors] = await Promise.all([liveCategories(), liveVendors()]);
  const countFor = (id: string) => vendors.filter((v) => v.categoryIds?.includes(id)).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t.categories.title}
        subtitle={t.categories.subtitle}
        actions={
          <div className="flex gap-2">
            <StarterPackButton
              label={t.categories.starterPack}
              done={t.categories.starterPackDone}
            />
            <Button asChild>
              <Link href={'/categories/new' as never}>
                <Plus className="size-4" />
                {t.categories.addNew}
              </Link>
            </Button>
          </div>
        }
      />

      {categories.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Tag className="size-7" />}
            title={t.categories.noCategories}
            body={t.categories.noCategoriesBody}
            action={
              <Button asChild variant="secondary" size="sm">
                <Link href={'/categories/new' as never}>{t.categories.addNew}</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="p-0">
          <ul className="divide-y divide-ink-200/70">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-[18px]">
                  {c.emoji ?? <Tag className="size-4 text-navy-700" />}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-semibold">{c.name[locale]}</span>
                  <span className="text-[12px] text-ink-500">
                    {c.slug} · {countFor(c.id)} {t.categories.vendorsLabel}
                  </span>
                </div>
                <DeleteCategoryButton
                  id={c.id}
                  confirmText={t.categories.deleteConfirm}
                  label={t.common.delete}
                  successText={t.categories.deleted}
                  failureText={t.vendors.actionFailed}
                />
              </li>
            ))}
          </ul>
          <div className="border-t border-ink-200/70 px-5 py-3 text-[12px] text-ink-500">
            {tFmt(t.common.showingN, { n: categories.length })}
          </div>
        </Card>
      )}
    </div>
  );
}
