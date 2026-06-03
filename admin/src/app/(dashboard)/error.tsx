'use client';

import * as React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Dashboard-wide error boundary. Copy is intentionally bilingual-neutral here
 * (the locale cookie isn't readable in a client error boundary without extra
 * plumbing), so we show both AR + EN lines.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md w-full p-8 flex flex-col items-center text-center gap-4">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="size-7" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-[18px] font-bold text-ink-900">تعذّر تحميل البيانات</h2>
          <p className="text-[13px] text-ink-500">Couldn’t load this page. Please try again.</p>
        </div>
        <Button onClick={reset}>
          <RotateCcw className="size-4" />
          إعادة المحاولة / Retry
        </Button>
      </Card>
    </div>
  );
}
