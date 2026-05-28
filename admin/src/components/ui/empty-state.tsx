import * as React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ icon, title, body, action, className }: EmptyStateProps) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center text-center px-6 py-12 gap-3',
      className,
    )}
  >
    {icon ? (
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-500">
        {icon}
      </div>
    ) : null}
    <h3 className="text-[17px] leading-[24px] font-semibold text-ink-900">{title}</h3>
    {body ? <p className="max-w-sm text-[14px] leading-[20px] text-ink-500">{body}</p> : null}
    {action ? <div className="mt-2">{action}</div> : null}
  </div>
);
