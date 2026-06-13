'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteCategory } from '@/lib/actions/catalog';

export function DeleteCategoryButton({
  id,
  confirmText,
  label,
  successText,
  failureText,
}: {
  id: string;
  confirmText: string;
  label: string;
  successText: string;
  failureText: string;
}) {
  const [pending, startTransition] = React.useTransition();
  const onClick = () => {
    if (!window.confirm(confirmText)) return;
    startTransition(async () => {
      try {
        await deleteCategory(id);
        toast.success(successText);
      } catch {
        toast.error(failureText);
      }
    });
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </button>
  );
}
