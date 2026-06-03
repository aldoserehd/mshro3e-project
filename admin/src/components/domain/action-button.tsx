'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button, type ButtonProps } from '@/components/ui/button';

export interface ActionButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Optional window.confirm() text shown before the action runs. */
  confirm?: string;
  /** Toast title shown after the (demo) action succeeds. */
  toastMessage: string;
  /** Optional toast description, e.g. a "demo only" note. */
  toastDescription?: string;
}

/**
 * Button for owner-admin moderation actions (verify, suspend, approve, …).
 *
 * The underlying mutations are still stubs (see lib/data/vendors), so instead
 * of silent no-ops this gives honest inline feedback: an optional confirm
 * dialog, a brief pending state, then a toast. Swap the timeout for the real
 * server action once Firestore writes are wired.
 */
export function ActionButton({
  confirm,
  toastMessage,
  toastDescription,
  children,
  ...props
}: ActionButtonProps) {
  const [pending, setPending] = React.useState(false);

  const run = async () => {
    if (confirm && !window.confirm(confirm)) return;
    setPending(true);
    await new Promise((r) => setTimeout(r, 450));
    setPending(false);
    toast.success(toastMessage, toastDescription ? { description: toastDescription } : undefined);
  };

  return (
    <Button {...props} loading={pending} onClick={run}>
      {children}
    </Button>
  );
}
