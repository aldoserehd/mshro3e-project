'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Loader2, Wand2 } from 'lucide-react';
import { seedStarterCategoriesAction } from '@/lib/actions/catalog';
import { Button } from '@/components/ui/button';

/** One-tap insert of the 14 standard Kuwaiti home-business categories. */
export function StarterPackButton({ label, done }: { label: string; done: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      onClick={() =>
        start(async () => {
          const { added } = await seedStarterCategoriesAction();
          toast.success(`${done} (+${added})`);
          router.refresh();
        })
      }
      disabled={pending}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
      {label}
    </Button>
  );
}
