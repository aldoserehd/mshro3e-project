'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Faq } from '@/lib/marketing/copy';

export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="overflow-hidden rounded-[14px] border border-ink-200 bg-white">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
            >
              <span className="text-[15px] font-semibold text-ink-900">{f.q}</span>
              <ChevronDown className={cn('size-5 shrink-0 text-ink-500 transition-transform', isOpen && 'rotate-180')} />
            </button>
            <div className={cn('grid transition-all duration-200', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-[14px] leading-relaxed text-ink-500">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
