import * as React from 'react';
import { cn } from '@/lib/utils';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-[10px] bg-navy-100',
      'before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:animate-[shimmer_1.1s_ease-in-out_infinite]',
      'rtl:before:translate-x-full rtl:before:animate-[shimmer-rtl_1.1s_ease-in-out_infinite]',
      className,
    )}
    {...props}
  />
);
