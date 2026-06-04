'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button, type ButtonProps } from '@/components/ui/button';
import type { ActionResult } from '@/lib/actions/vendors';

export interface VendorActionButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Bound server action, e.g. approveVendor.bind(null, id). */
  action: () => Promise<ActionResult>;
  /** Optional window.confirm() text shown before running. */
  confirm?: string;
  /** Toast title on success. */
  success: string;
  /** Toast title on failure (the error detail becomes the description). */
  failure: string;
}

/** Runs a real Firestore moderation action with confirm + pending + toast. */
export function VendorActionButton({
  action,
  confirm,
  success,
  failure,
  children,
  ...props
}: VendorActionButtonProps) {
  const [pending, startTransition] = React.useTransition();

  const run = () => {
    if (confirm && !window.confirm(confirm)) return;
    startTransition(async () => {
      const res = await action();
      if (res?.ok) {
        toast.success(success);
      } else {
        toast.error(failure, res?.error ? { description: res.error } : undefined);
      }
    });
  };

  return (
    <Button {...props} loading={pending} onClick={run}>
      {children}
    </Button>
  );
}
