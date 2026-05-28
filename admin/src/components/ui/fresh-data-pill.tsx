'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { getDict, tFmt, type Locale } from '@/i18n/dict';

export interface FreshDataPillProps {
  /** epoch ms */
  since: number;
  locale?: Locale;
  className?: string;
  /** Render only the dot — no label. */
  dotOnly?: boolean;
}

function relativeLabel(deltaMs: number, t: ReturnType<typeof getDict>['common']): string {
  const s = Math.floor(deltaMs / 1000);
  if (s < 5) return t.freshNow;
  if (s < 60) return tFmt(t.freshSecAgo, { n: s });
  const m = Math.floor(s / 60);
  if (m < 60) return tFmt(t.freshMinAgo, { n: m });
  const h = Math.floor(m / 60);
  return tFmt(t.freshHourAgo, { n: h });
}

export function FreshDataPill({ since, locale = 'ar', className, dotOnly }: FreshDataPillProps) {
  const [now, setNow] = React.useState<number>(since);

  React.useEffect(() => {
    // Initial render syncs with real wall-clock to avoid SSR/CSR mismatch
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const t = getDict(locale).common;
  const label = relativeLabel(Math.max(0, now - since), t);

  if (dotOnly) {
    return <span className={cn('pulse-dot', className)} aria-label={t.live} />;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-navy-50 border border-navy-100 px-2.5 py-1 text-[11px] font-medium text-navy-700',
        className,
      )}
      title={t.live}
    >
      <span className="pulse-dot" />
      <span suppressHydrationWarning>{label}</span>
    </span>
  );
}
