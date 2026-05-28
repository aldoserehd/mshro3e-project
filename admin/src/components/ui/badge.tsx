import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] leading-[14px] font-medium uppercase tracking-[0.04em]',
  {
    variants: {
      tone: {
        neutral: 'bg-navy-100 text-navy-700 border border-navy-200',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
        danger: 'bg-red-50 text-red-700 border border-red-200',
        info: 'bg-sky-50 text-sky-700 border border-sky-200',
        brand: 'bg-navy-900 text-white border border-navy-900',
      },
      size: {
        sm: 'h-5 px-2 text-[10px]',
        md: 'h-6 px-2.5',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, tone, size, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ tone, size }), className)} {...props} />
);
