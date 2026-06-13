import * as React from 'react';
import Link from 'next/link';
import {
  Store,
  UserPlus,
  Package,
  UserCheck,
  TrendingUp,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict, tFmt } from '@/i18n/dict';
import { liveVendors, liveProducts, liveLeads, liveUsers, liveCategories } from '@/lib/data/live';
import { BentoTile } from '@/components/ui/bento-tile';
import { KpiCard } from '@/components/ui/kpi-card';
import { ChartCard } from '@/components/ui/chart-card';
import { PageHeader } from '@/components/domain/page-header';
import { SparkLine } from '@/components/charts/spark-line';
import { SignupsLine } from '@/components/charts/signups-line';
import { CategoryDonut } from '@/components/charts/category-donut';

const DAY = 24 * 60 * 60 * 1000;

export default async function OverviewPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const [vendors, products, leads, users, categories] = await Promise.all([
    liveVendors(),
    liveProducts(),
    liveLeads(),
    liveUsers(),
    liveCategories(),
  ]);

  const now = Date.now();
  const monthStart = now - 30 * DAY;
  const leadsMonth = leads.filter((l) => (l.createdAt ?? 0) >= monthStart);
  const soldKwd = leadsMonth
    .filter((l) => l.status === 'sold')
    .reduce((s, l) => s + (l.saleAmount ?? 0), 0);
  const activeVendors = vendors.filter((v) => v.status === 'active').length;
  const pendingVendors = vendors.filter((v) => v.status === 'pending').length;
  const newUsers7d = users.filter((u) => (u.createdAt ?? 0) >= now - 7 * DAY).length;

  // Leads per day, last 14 days — the hero sparkline.
  const leadSpark = Array.from({ length: 14 }, (_, i) => {
    const dayStart = now - (13 - i) * DAY;
    return {
      value: leads.filter((l) => (l.createdAt ?? 0) >= dayStart && (l.createdAt ?? 0) < dayStart + DAY).length,
    };
  });

  // Vendor signups per week, last 8 weeks.
  const signups = Array.from({ length: 8 }, (_, i) => {
    const weekStart = now - (7 - i) * 7 * DAY;
    const label = new Date(weekStart).toLocaleDateString(locale === 'ar' ? 'ar-KW' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
    return {
      label,
      value: vendors.filter((v) => (v.createdAt ?? 0) >= weekStart && (v.createdAt ?? 0) < weekStart + 7 * DAY).length,
    };
  });

  const byCategory = categories
    .map((c) => ({
      id: c.id,
      label: c.name[locale],
      value: vendors.filter((v) => v.categoryIds?.includes(c.id)).length,
    }))
    .filter((b) => b.value > 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.overview.title} subtitle={t.overview.subtitle} />

      {/* Bento grid — 12-col mosaic. */}
      <div className="grid grid-cols-12 auto-rows-[140px] gap-4">
        {/* HERO — WhatsApp leads this month */}
        <BentoTile variant="hero" span="3x2" pattern="grid" className="col-span-12 lg:col-span-6 row-span-2">
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-navy-200">
                  {t.overview.leadsMonth}
                </span>
                <div className="mt-3 text-[44px] leading-[52px] font-extrabold text-white tabular-nums">
                  {leadsMonth.length}
                </div>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-2.5 py-1 text-[12px] font-semibold text-white">
                  <TrendingUp className="size-3" />
                  {soldKwd > 0
                    ? tFmt(t.overview.soldKwd, { n: soldKwd })
                    : t.overview.leadsHint}
                </div>
              </div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/10 backdrop-blur-sm border border-white/10 text-white">
                <Sparkles className="size-4" />
              </span>
            </div>
            <div className="-mx-2">
              <SparkLine data={leadSpark} height={88} />
            </div>
          </div>
        </BentoTile>

        {/* MID — Active vendors */}
        <BentoTile variant="mid" span="1x1" className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-1">
          <KpiCard
            label={t.overview.activeVendors}
            value={<span className="tabular-nums">{activeVendors}</span>}
            icon={<Store className="size-4" />}
            footer={
              <Link href="/vendors" className="text-[12px] font-medium text-navy-500 hover:text-navy-700">
                {t.overview.viewDetails} →
              </Link>
            }
          />
        </BentoTile>

        {/* MID — Pending approvals */}
        <BentoTile variant="mid" span="1x1" className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-1">
          <KpiCard
            label={t.nav.vendorsPending}
            value={<span className="tabular-nums">{pendingVendors}</span>}
            icon={<UserCheck className="size-4" />}
            footer={
              <Link href="/vendors/pending" className="text-[12px] font-medium text-navy-500 hover:text-navy-700">
                {t.overview.viewDetails} →
              </Link>
            }
          />
        </BentoTile>

        {/* 3 small KPI tiles */}
        <BentoTile variant="kpi" span="1x1" className="col-span-12 sm:col-span-4 lg:col-span-2 row-span-1">
          <KpiCard
            label={t.nav.products}
            value={<span className="tabular-nums">{products.length}</span>}
            icon={<Package className="size-4" />}
          />
        </BentoTile>
        <BentoTile variant="kpi" span="1x1" className="col-span-12 sm:col-span-4 lg:col-span-2 row-span-1">
          <KpiCard
            label={t.overview.newUsers}
            value={<span className="tabular-nums">{newUsers7d}</span>}
            icon={<UserPlus className="size-4" />}
          />
        </BentoTile>
        <BentoTile variant="kpi" span="1x1" className="col-span-12 sm:col-span-4 lg:col-span-2 row-span-1">
          <KpiCard
            label={t.overview.totalCustomers}
            value={<span className="tabular-nums">{users.length}</span>}
            icon={<MessageCircle className="size-4" />}
          />
        </BentoTile>

        {/* Wide: vendor signups over time */}
        <BentoTile variant="chart" span="3x2" className="col-span-12 lg:col-span-7 row-span-2">
          <ChartCard title={t.overview.signupsOverTime} subtitle={t.overview.last8Weeks}>
            <SignupsLine data={signups} emptyLabel={t.overview.noSignups} />
          </ChartCard>
        </BentoTile>

        {/* Wide: donut */}
        <BentoTile variant="chart" span="2x2" className="col-span-12 lg:col-span-5 row-span-2">
          <ChartCard
            title={t.overview.vendorsByCategory}
            subtitle={t.vendors.title}
            toolbar={
              <Link href="/vendors" className="text-[12px] font-medium text-navy-500 hover:text-navy-700">
                {t.common.seeAll}
              </Link>
            }
          >
            <CategoryDonut
              data={byCategory}
              unitLabel={t.overview.vendorsUnit}
              emptyLabel={t.overview.noCategoryData}
            />
          </ChartCard>
        </BentoTile>
      </div>
    </div>
  );
}
