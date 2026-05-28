'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number;
}

export const Pill = React.forwardRef<HTMLButtonElement, PillProps>(
  ({ className, active, count, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center gap-2 h-9 rounded-full border px-3.5 text-[13px] font-medium transition-colors whitespace-nowrap',
        active
          ? 'bg-navy-900 text-white border-navy-900 hover:bg-navy-700'
          : 'bg-white text-navy-900 border-navy-200 hover:bg-navy-50',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {typeof count === 'number' && (
        <span
          className={cn(
            'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold',
            active ? 'bg-white/15 text-white' : 'bg-navy-100 text-navy-700',
          )}
        >
          {count}
        </span>
      )}
    </button>
  ),
);
Pill.displayName = 'Pill';
