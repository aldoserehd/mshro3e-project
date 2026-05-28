import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const ChartCard = ({
  title,
  subtitle,
  toolbar,
  children,
  className,
  bodyClassName,
}: ChartCardProps) => (
  <div className={cn('flex flex-col h-full', className)}>
    <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
      <div className="min-w-0">
        <h3 className="text-[15px] leading-[22px] font-semibold text-ink-900 truncate">{title}</h3>
        {subtitle ? <p className="text-[12px] leading-[16px] text-ink-500 mt-0.5">{subtitle}</p> : null}
      </div>
      {toolbar ? <div className="flex items-center gap-2 shrink-0">{toolbar}</div> : null}
    </div>
    <div className={cn('flex-1 px-3 pb-3', bodyClassName)}>{children}</div>
  </div>
);
