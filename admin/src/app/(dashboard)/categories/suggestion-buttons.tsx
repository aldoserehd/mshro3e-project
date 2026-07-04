'use client';

import * as React from 'react';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { approveCategorySuggestion, dismissCategorySuggestion } from '@/lib/actions/catalog';

/** Approve / dismiss controls for one vendor category suggestion. */
export function SuggestionButtons({
  id,
  approveLabel,
  dismissLabel,
  approvedText,
  failureText,
}: {
  id: string;
  approveLabel: string;
  dismissLabel: string;
  approvedText: string;
  failureText: string;
}) {
  const [pending, startTransition] = React.useTransition();

  const run = (action: (id: string) => Promise<{ ok: boolean; error?: string }>, successMsg?: string) =>
    startTransition(async () => {
      const res = await action(id);
      if (res.ok) {
        if (successMsg) toast.success(successMsg);
      } else {
        toast.error(res.error ?? failureText);
      }
    });

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" disabled={pending} onClick={() => run(approveCategorySuggestion, approvedText)}>
        <Check className="size-3.5" />
        {approveLabel}
      </Button>
      <Button size="sm" variant="ghost" disabled={pending} onClick={() => run(dismissCategorySuggestion)}>
        <X className="size-3.5" />
        {dismissLabel}
      </Button>
    </div>
  );
}
