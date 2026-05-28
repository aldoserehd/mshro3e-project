import * as React from 'react';
import { cn } from '@/lib/utils';

export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto">
    <table className={cn('w-full caption-bottom text-[14px]', className)} {...props} />
  </div>
);

export const THead = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('bg-navy-50/60', className)} {...props} />
);

export const TBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('[&>tr]:border-b [&>tr]:border-ink-200/70 [&>tr:last-child]:border-0', className)} {...props} />
);

export const TRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn(
      'transition-colors hover:bg-navy-50/40 data-[state=selected]:bg-navy-100',
      className,
    )}
    {...props}
  />
);

export const TH = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      'h-11 px-4 text-start text-[12px] font-semibold text-ink-500 uppercase tracking-[0.04em] whitespace-nowrap',
      className,
    )}
    {...props}
  />
);

export const TCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-4 py-3.5 text-ink-900 align-middle', className)} {...props} />
);
