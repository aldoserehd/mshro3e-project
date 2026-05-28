import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export const RatingStars = ({
  value,
  size = 14,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) => {
  const rounded = Math.round(value);
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="inline-flex items-center" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={cn(
              'shrink-0',
              i < rounded ? 'text-amber-500 fill-amber-500' : 'text-navy-200 fill-navy-100',
            )}
          />
        ))}
      </span>
      <span className="text-[12px] font-semibold text-ink-900 tabular-nums">{value.toFixed(1)}</span>
    </span>
  );
};
