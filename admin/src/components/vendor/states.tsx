'use client';

import * as React from 'react';
import Link from 'next/link';
import { Loader2, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/** Centered spinner inside a card — uniform loading state across vendor pages. */
export function LoadingState() {
  return (
    <Card className="p-10 flex justify-center">
      <Loader2 className="size-6 animate-spin text-navy-600" aria-label="loading" />
    </Card>
  );
}

/** Friendly empty state with an icon, message and optional CTA. */
export function EmptyState({
  icon,
  title,
  hint,
  ctaLabel,
  ctaHref,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <Card className="p-10 flex flex-col items-center text-center gap-3">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">{icon}</span>
      <p className="text-[15px] font-semibold text-ink-900">{title}</p>
      {hint && <p className="-mt-1 text-[13px] text-ink-500 max-w-sm">{hint}</p>}
      {ctaLabel && ctaHref && (
        <Button asChild className="mt-1">
          <Link href={ctaHref as never}>{ctaLabel}</Link>
        </Button>
      )}
    </Card>
  );
}

/** Error state with a retry button. */
export function ErrorState({ title, retryLabel, onRetry }: { title: string; retryLabel: string; onRetry: () => void }) {
  return (
    <Card className="p-10 flex flex-col items-center text-center gap-3 border-red-200">
      <p className="text-[15px] font-semibold text-ink-900">{title}</p>
      <Button variant="secondary" onClick={onRetry}>
        <RefreshCw className="size-4" />
        {retryLabel}
      </Button>
    </Card>
  );
}
