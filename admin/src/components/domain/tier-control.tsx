'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { setVendorTier } from '@/lib/actions/vendors';

type Tier = 'basic' | 'pro' | 'managed' | null;

/**
 * Owner activates / changes a vendor's subscription after confirming an
 * out-of-band payment (KNET payment link). Select a tier+term → writes
 * tier + subscriptionUntil to the vendor doc.
 */
export function TierControl({
  vendorId,
  labels,
}: {
  vendorId: string;
  labels: {
    placeholder: string;
    free: string;
    basic1: string;
    basic3: string;
    pro1: string;
    pro3: string;
    business1: string;
    business3: string;
    done: string;
    failed: string;
  };
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const apply = (value: string) => {
    if (!value) return;
    const [tierRaw, monthsRaw] = value.split(':');
    const tier = (tierRaw === 'free' ? null : tierRaw) as Tier;
    const months = (monthsRaw === '3' ? 3 : 1) as 1 | 3;
    startTransition(async () => {
      const res = await setVendorTier(vendorId, tier, months);
      if (res.ok) {
        toast.success(labels.done);
        router.refresh();
      } else {
        toast.error(res.error || labels.failed);
      }
    });
  };

  return (
    <span className="inline-flex items-center gap-1.5">
      <select
        disabled={pending}
        defaultValue=""
        onChange={(e) => {
          apply(e.target.value);
          e.target.value = '';
        }}
        className="h-8 rounded-[8px] border border-ink-200 bg-white px-2 text-[12px] font-medium text-ink-900 hover:border-navy-300 disabled:opacity-50"
      >
        <option value="" disabled>{labels.placeholder}</option>
        <option value="free:1">{labels.free}</option>
        <option value="basic:1">{labels.basic1}</option>
        <option value="basic:3">{labels.basic3}</option>
        <option value="pro:1">{labels.pro1}</option>
        <option value="pro:3">{labels.pro3}</option>
        <option value="managed:1">{labels.business1}</option>
        <option value="managed:3">{labels.business3}</option>
      </select>
      {pending ? <Loader2 className="size-3.5 animate-spin text-ink-500" /> : null}
    </span>
  );
}
