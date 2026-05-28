import * as React from 'react';
import Link from 'next/link';
import {
  Store,
  CalendarCheck,
  UserPlus,
  Wallet,
  AlertTriangle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { overviewMetrics } from '@/data/seed';
import { BentoTile } from '@/components/ui/bento-tile';
import { KpiCard } from '@/components/ui/kpi-card';
import { ChartCard } from '@/components/ui/chart-card';
import { PageHeader } from '@/components/domain/page-header';
import { FreshDataPill } from '@/components/ui/fresh-data-pill';
import { SparkLine } from '@/components/charts/spark-line';
import { SignupsLine } from '@/components/charts/signups-line';
import { CategoryDonut } from '@/components/charts/category-donut';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function OverviewPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const m = overviewMetrics();
  const since = Date.now() - 12_000; // 12s ago — fresh

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t.overview.title}
        subtitle={t.overview.subtitle}
        actions={
          <>
            <Badge tone="info" className="hidden md:inline-flex">{t.overview.last30Days}</Badge>
            <FreshDataPill since={since} locale={locale} />
          </>
        }
      />

      {/* Bento grid — 12-col mosaic. */}
      <div className="grid grid-cols-12 auto-rows-[140px] gap-4">
        {/* HERO — GMV tile, 6x2 dark */}
        <BentoTile variant="hero" span="3x2" pattern="grid" className="col-span-12 lg:col-span-6 row-span-2">
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-navy-200">
                    {t.overview.gmvMonth}
                  </span>
                  <FreshDataPill since={since} locale={locale} dotOnly className="text-white" />
                </div>
                <div className="mt-3 text-[44px] leading-[52px] font-extrabold text-white tabular-nums">
                  {formatCurrency(m.gmvMonth, 'KWD', locale === 'ar' ? 'ar-KW' : 'en-US')}
                </div>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-2.5 py-1 text-[12px] font-semibold text-white">
                  <TrendingUp className="size-3" />
                  +18.4% {t.overview.vsLastMonth}
                </div>
              </div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/10 backdrop-blur-sm border border-white/10 text-white">
                <Sparkles className="size-4" />
              </span>
            </div>
            <div className="-mx-2">
              <SparkLine data={m.gmvSpark.map((s) => ({ value: s.value }))} height={88} />
            </div>
          </div>
        </BentoTile>

        {/* MID stacked — Active vendors */}
        <BentoTile variant="mid" span="1x1" className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-1">
          <KpiCard
            label={t.overview.activeVendors}
            value={<span className="tabular-nums">{m.activeVendors}</span>}
            icon={<Store className="size-4" />}
            trend={{ direction: 'up', label: '+3' }}
            footer={
              <Link href="/vendors" className="text-[12px] font-medium text-navy-500 hover:text-navy-700">
                {t.overview.viewDetails} →
              </Link>
            }
          />
        </BentoTile>

        {/* MID stacked — Active subscriptions */}
        <BentoTile variant="mid" span="1x1" className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-1">
          <KpiCard
            label={t.overview.activeSubscriptions}
            value={<span className="tabular-nums">{m.activeVendors}</span>}
            icon={<CalendarCheck className="size-4" />}
            trend={{ direction: 'up', label: '+2' }}
            footer={
              <Link href="/subscriptions" className="text-[12px] font-medium text-navy-500 hover:text-navy-700">
                {t.overview.viewDetails} →
              </Link>
            }
          />
        </BentoTile>

        {/* 3 small KPI tiles */}
        <BentoTile variant="kpi" span="1x1" className="col-span-12 sm:col-span-4 lg:col-span-2 row-span-1">
          <KpiCard
            label={t.overview.newUsers}
            value={<span className="tabular-nums">{m.newUsers}</span>}
            icon={<UserPlus className="size-4" />}
            trend={{ direction: 'up', label: '+5' }}
          />
        </BentoTile>
        <BentoTile variant="kpi" span="1x1" className="col-span-12 sm:col-span-4 lg:col-span-2 row-span-1">
          <KpiCard
            label={t.overview.pendingPayouts}
            value={<span className="tabular-nums">{m.pendingPayouts}</span>}
            icon={<Wallet className="size-4" />}
            trend={{ direction: 'flat', label: '—' }}
          />
        </BentoTile>
        <BentoTile variant="kpi" span="1x1" className="col-span-12 sm:col-span-4 lg:col-span-2 row-span-1">
          <KpiCard
            label={t.overview.openDisputes}
            value={<span className="tabular-nums">{m.openDisputes}</span>}
            icon={<AlertTriangle className="size-4" />}
            trend={{ direction: 'down', label: '-1' }}
          />
        </BentoTile>

        {/* Wide: signups over time */}
        <BentoTile variant="chart" span="3x2" className="col-span-12 lg:col-span-7 row-span-2">
          <ChartCard
            title={t.overview.signupsOverTime}
            subtitle={t.overview.last30Days}
            toolbar={<FreshDataPill since={since} locale={locale} />}
          >
            <SignupsLine data={m.signups.map((p) => ({ label: p.label, value: p.value }))} />
          </ChartCard>
        </BentoTile>

        {/* Wide: donut */}
        <BentoTile variant="chart" span="2x2" className="col-span-12 lg:col-span-5 row-span-2">
          <ChartCard
            title={t.overview.vendorsByCategory}
            subtitle={t.vendors.title}
            toolbar={
              <Button asChild variant="ghost" size="sm">
                <Link href="/vendors">{t.common.seeAll}</Link>
              </Button>
            }
          >
            <CategoryDonut
              data={m.byCategory.map((b) => ({ id: b.id, label: b.name[locale], value: b.value }))}
            />
          </ChartCard>
        </BentoTile>
      </div>
    </div>
  );
}
