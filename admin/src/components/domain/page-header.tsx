import * as React from 'react';
import { cn } from '@/lib/utils';

export const PageHeader = ({
  title,
  subtitle,
  actions,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
    <div className="min-w-0">
      <h1 className="text-[28px] leading-[34px] font-bold tracking-tight text-ink-900">{title}</h1>
      {subtitle ? <p className="mt-1 text-[14px] leading-[20px] text-ink-500 max-w-2xl">{subtitle}</p> : null}
    </div>
    {actions ? <div className="flex items-center gap-2 shrink-0">{actions}</div> : null}
  </div>
);
