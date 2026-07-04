import * as React from 'react';
import Link from 'next/link';
import { Tag, Plus, Lightbulb } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict, tFmt } from '@/i18n/dict';
import { liveCategories, liveSuggestions, liveVendors } from '@/lib/data/live';
import { PageHeader } from '@/components/domain/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { DeleteCategoryButton } from './delete-category-button';
import { StarterPackButton } from './starter-pack-button';
import { SuggestionButtons } from './suggestion-buttons';
import { formatDate } from '@/lib/utils';

export default async function CategoriesPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const ar = locale === 'ar';
  const [categories, vendors, suggestions] = await Promise.all([
    liveCategories(),
    liveVendors(),
    liveSuggestions(),
  ]);
  const tag = ar ? 'ar-KW' : 'en-US';
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

      {/* Vendor suggestions — approve turns one into a category. */}
      {suggestions.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-ink-200/70 bg-amber-50/60 px-5 py-3">
            <Lightbulb className="size-4 text-amber-600" />
            <span className="text-[13px] font-semibold text-ink-900">
              {ar ? `اقتراحات البائعين (${suggestions.length})` : `Vendor suggestions (${suggestions.length})`}
            </span>
          </div>
          <ul className="divide-y divide-ink-200/70">
            {suggestions.map((s) => (
              <li key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-medium truncate">{s.text}</span>
                  <span className="text-[12px] text-ink-500">
                    {s.vendorName ? `${s.vendorName} · ` : ''}
                    {s.createdAt ? formatDate(s.createdAt, tag) : ''}
                  </span>
                </div>
                <SuggestionButtons
                  id={s.id}
                  approveLabel={ar ? 'اعتماد كفئة' : 'Approve'}
                  dismissLabel={ar ? 'تجاهل' : 'Dismiss'}
                  approvedText={ar ? 'تمت إضافة الفئة — عدّل اسمها الإنجليزي إذا حاب.' : 'Category added — edit its English name if needed.'}
                  failureText={t.vendors.actionFailed}
                />
              </li>
            ))}
          </ul>
        </Card>
      )}

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
