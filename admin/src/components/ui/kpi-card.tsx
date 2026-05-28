import * as React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  trend?: { direction: 'up' | 'down' | 'flat'; label: string };
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  tone?: 'default' | 'dark';
  className?: string;
}

export const KpiCard = ({
  label,
  value,
  trend,
  icon,
  footer,
  tone = 'default',
  className,
}: KpiCardProps) => {
  const isDark = tone === 'dark';
  return (
    <div className={cn('flex flex-col gap-3 p-5 h-full', className)}>
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            'text-[12px] font-semibold uppercase tracking-[0.06em]',
            isDark ? 'text-navy-200' : 'text-ink-500',
          )}
        >
          {label}
        </span>
        {icon ? (
          <span
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-[10px]',
              isDark ? 'bg-white/10 text-white' : 'bg-navy-50 text-navy-700',
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <div className={cn('text-[32px] leading-[36px] font-bold tracking-tight', isDark ? 'text-white' : 'text-ink-900')}>
        {value}
      </div>
      {trend ? (
        <div className="flex items-center gap-1.5 text-[12px]">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold',
              trend.direction === 'up'
                ? 'bg-emerald-50 text-emerald-700'
                : trend.direction === 'down'
                ? 'bg-red-50 text-red-700'
                : isDark
                ? 'bg-white/10 text-navy-200'
                : 'bg-navy-50 text-navy-700',
            )}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="size-3" />
            ) : trend.direction === 'down' ? (
              <TrendingDown className="size-3" />
            ) : null}
            {trend.label}
          </span>
        </div>
      ) : null}
      {footer ? <div className="mt-auto pt-2">{footer}</div> : null}
    </div>
  );
};
