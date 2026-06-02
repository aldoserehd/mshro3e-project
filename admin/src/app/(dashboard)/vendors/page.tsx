import * as React from 'react';
import Link from 'next/link';
import { Plus, Store } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { listVendors, type VendorFilters } from '@/lib/data/vendors';
import { PageHeader } from '@/components/domain/page-header';
import { VendorStatusPill } from '@/components/domain/status-pill';
import { RatingStars } from '@/components/domain/rating-stars';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  THead,
  TBody,
  TRow,
  TH,
  TCell,
} from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrency, cn } from '@/lib/utils';
import { seedCategories } from '@/data/seed';
import type { VendorStatus } from '@shared/types';

const STATUSES: (VendorStatus | 'all')[] = ['all', 'active', 'pending', 'suspended', 'rejected'];

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

const pillCls = (active: boolean) =>
  cn(
    'inline-flex items-center h-9 rounded-full border px-4 text-[13px] font-medium transition-colors',
    active
      ? 'bg-navy-900 text-white border-navy-900 hover:bg-navy-700'
      : 'bg-white text-navy-900 border-navy-200 hover:bg-navy-50',
  );

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string; cat?: string }>;
}

export default async function VendorsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const t = getDict(locale);
  const sp = await searchParams;
  const filters: VendorFilters = {
    search: sp.q,
    status: (sp.status as VendorStatus | 'all') ?? 'all',
    categoryId: sp.cat ?? 'all',
  };
  const vendors = await listVendors(filters);
  const localeTag = locale === 'ar' ? 'ar-KW' : 'en-US';
  const buildHref = (overrides: Record<string, string>) => ({
    pathname: '/vendors',
    query: { ...sp, ...overrides },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t.vendors.title}
        subtitle={t.vendors.subtitle}
        actions={
          <Button asChild>
            <Link href={'/vendors/new' as never}>
              <Plus className="size-4" />
              {t.vendors.addNew}
            </Link>
          </Button>
        }
      />

      <Card className="p-4">
        <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Input
            name="q"
            defaultValue={sp.q ?? ''}
            placeholder={t.common.searchPlaceholder}
            className="lg:max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Link key={s} href={buildHref({ status: s })} className={pillCls((sp.status ?? 'all') === s)}>
                {s === 'all'
                  ? t.common.all
                  : s === 'active'
                    ? t.vendors.filterActive
                    : s === 'pending'
                      ? t.vendors.filterPending
                      : s === 'suspended'
                        ? t.vendors.filterSuspended
                        : t.vendors.filterRejected}
              </Link>
            ))}
          </div>
          <div className="lg:ms-auto flex items-center gap-2">
            <select
              name="cat"
              defaultValue={sp.cat ?? 'all'}
              className="h-9 rounded-[10px] border border-ink-200 bg-white px-3 text-[13px] outline-none focus:border-navy-600"
            >
              <option value="all">{t.common.category} — {t.common.all}</option>
              {seedCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name[locale]}</option>
              ))}
            </select>
            <Button type="submit" variant="secondary" size="sm">{t.common.filter}</Button>
          </div>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        {vendors.length === 0 ? (
          <EmptyState icon={<Store className="size-7" />} title={t.vendors.noVendors} />
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>{t.vendors.colName}</TH>
                <TH>{t.vendors.colCategory}</TH>
                <TH>{t.vendors.colStatus}</TH>
                <TH className="text-center">{t.vendors.colRating}</TH>
                <TH className="text-end">{t.vendors.colRevenueMtd}</TH>
              </TRow>
            </THead>
            <TBody>
              {vendors.map((v) => {
                const cat = seedCategories.find((c) => v.categoryIds.includes(c.id));
                const revenue = (v.reviewCount % 100) * 3 + 50;
                return (
                  <TRow key={v.id}>
                    <TCell>
                      <Link href={`/vendors/${v.id}`} className="flex items-center gap-3 hover:text-navy-700">
                        <Avatar className="h-9 w-9">
                          {v.logoImage ? <AvatarImage src={v.logoImage} alt={v.name[locale]} /> : null}
                          <AvatarFallback className="text-[11px] font-semibold text-navy-700">
                            {initials(v.name.en)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-ink-900">{v.name[locale]}</span>
                          <span className="text-[12px] text-ink-500">{v.address?.[locale] ?? ''}</span>
                        </div>
                      </Link>
                    </TCell>
                    <TCell><span className="text-ink-500">{cat?.name[locale] ?? '—'}</span></TCell>
                    <TCell><VendorStatusPill status={v.status} t={t} /></TCell>
                    <TCell className="text-center"><RatingStars value={v.rating} /></TCell>
                    <TCell className="text-end tabular-nums font-semibold">
                      {formatCurrency(revenue, 'KWD', localeTag)}
                    </TCell>
                  </TRow>
                );
              })}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
