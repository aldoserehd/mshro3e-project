'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  PLANS,
  CURRENCY,
  type BillingPeriod,
  planTotal,
  monthlyRate,
  savingPercent,
} from '@/lib/marketing/plans';
import type { JoinCopy } from '@/lib/marketing/copy';
import type { Locale } from '@/i18n/dict';

/** Pretty KWD amount: drop trailing zeros, keep up to 3 decimals (fils). */
function fmtAmount(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(3).replace(/\.?0+$/, '');
}

export function Pricing({ locale, copy }: { locale: Locale; copy: JoinCopy }) {
  const [period, setPeriod] = React.useState<BillingPeriod>('3months');
  const cur = CURRENCY[locale === 'en' ? 'en' : 'ar'];
  const p = copy.pricing;

  return (
    <div className="flex flex-col items-center">
      {/* Billing toggle */}
      <div
        role="tablist"
        aria-label={p.title}
        className="inline-flex items-center rounded-full border border-navy-200 bg-white p-1 shadow-[var(--shadow-elev1)]"
      >
        {(['1month', '3months'] as const).map((opt) => {
          const active = period === opt;
          return (
            <button
              key={opt}
              role="tab"
              aria-selected={active}
              onClick={() => setPeriod(opt)}
              className={cn(
                'relative h-9 rounded-full px-4 text-[13px] font-semibold transition-colors',
                active ? 'bg-navy-900 text-white' : 'text-ink-500 hover:text-ink-900',
              )}
            >
              {opt === '1month' ? p.toggle1 : p.toggle3}
              {opt === '3months' && (
                <span
                  className={cn(
                    'ms-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                    active ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700',
                  )}
                >
                  {locale === 'en' ? 'best value' : 'الأوفر'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const total = planTotal(plan, period);
          const perMonth = monthlyRate(plan, period);
          const saving = period === '3months' ? savingPercent(plan) : null;
          const isPlaceholder = total === null;
          const isFree = total === 0;
          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-[22px] border bg-white p-6 transition-shadow',
                plan.highlighted
                  ? 'border-navy-900 shadow-[var(--shadow-elev4)] ring-1 ring-navy-900 lg:-my-2 lg:py-8'
                  : 'border-ink-200 shadow-[var(--shadow-elev1)] hover:shadow-[var(--shadow-elev2)]',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3.5 start-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-navy-900 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[var(--shadow-elev2)] rtl:translate-x-1/2">
                  <Sparkles className="size-3" />
                  {p.popular}
                </span>
              )}

              <h3 className="text-[17px] font-bold text-ink-900">{plan.name[locale]}</h3>
              <p className="mt-0.5 text-[12.5px] text-ink-500">{plan.tagline[locale]}</p>

              {/* The ONE headline wow */}
              <p
                className={cn(
                  'mt-4 min-h-[72px] rounded-[12px] px-3.5 py-3 text-[14px] font-bold leading-snug',
                  plan.highlighted ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-900',
                )}
              >
                {plan.wow[locale]}
              </p>

              <div className="mt-5 min-h-[64px]">
                {isPlaceholder ? (
                  <p className="text-[28px] font-extrabold text-ink-900">{p.placeholder}</p>
                ) : isFree ? (
                  <p className="text-[32px] font-extrabold text-ink-900">{p.free}</p>
                ) : (
                  <>
                    <p className="flex items-baseline gap-1.5">
                      <span className="text-[32px] font-extrabold text-ink-900 tabular-nums">
                        {fmtAmount(perMonth as number)}
                      </span>
                      <span className="text-[13px] text-ink-500">
                        {cur} {p.perMonth}
                      </span>
                    </p>
                    {period === '3months' && (
                      <p className="mt-0.5 text-[12px] text-ink-500">
                        {p.billed3.replace('{total}', fmtAmount(total as number)).replace('{currency}', cur)}
                      </p>
                    )}
                    {saving !== null && (
                      <span className="mt-1.5 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                        {p.save.replace('{pct}', String(saving))}
                      </span>
                    )}
                  </>
                )}
              </div>

              <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] leading-snug text-ink-900">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <span>{f[locale]}</span>
                  </li>
                ))}
              </ul>

              <Button asChild variant={plan.highlighted ? 'primary' : 'secondary'} className="mt-6 w-full">
                <Link href={'/vendor/login' as never}>{isFree ? p.ctaFree : p.cta}</Link>
              </Button>
            </div>
          );
        })}
      </div>

      <p className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[12.5px] font-semibold text-amber-800">
        <Sparkles className="size-3.5" />
        {p.launchNote}
      </p>
    </div>
  );
}
