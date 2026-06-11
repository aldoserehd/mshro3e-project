import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Asymmetric grid tile per brief move #1 ("Bento dashboards").
 * Sizes use the same r-lg radius for cohesion; col/row spans encoded as utility classes.
 */
const tile = cva(
  'relative overflow-hidden rounded-[16px] border border-ink-200 bg-white shadow-[var(--shadow-elev1)] transition-shadow hover:shadow-[var(--shadow-elev2)]',
  {
    variants: {
      variant: {
        hero: 'join-hero join-noise text-white border-transparent shadow-[var(--shadow-elev3)]',
        mid: 'bg-white',
        kpi: 'bg-white',
        accent: 'bg-navy-50 border-navy-100',
        chart: 'bg-white',
      },
      span: {
        '1x1': 'col-span-12 sm:col-span-6 lg:col-span-3 row-span-1',
        '2x1': 'col-span-12 sm:col-span-6 lg:col-span-6 row-span-1',
        '2x2': 'col-span-12 sm:col-span-12 lg:col-span-6 row-span-2',
        '3x2': 'col-span-12 sm:col-span-12 lg:col-span-6 row-span-2',
        '6x1': 'col-span-12 row-span-1',
        '1x2': 'col-span-12 sm:col-span-6 lg:col-span-3 row-span-2',
      },
    },
    defaultVariants: { variant: 'kpi', span: '1x1' },
  },
);

export interface BentoTileProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tile> {
  /** Optional decorative background pattern (only for hero variant). */
  pattern?: 'grid' | 'dots' | 'none';
}

export const BentoTile = React.forwardRef<HTMLDivElement, BentoTileProps>(
  ({ className, variant, span, pattern, children, ...props }, ref) => (
    <div ref={ref} className={cn(tile({ variant, span }), className)} {...props}>
      {variant === 'hero' && pattern && pattern !== 'none' ? (
        <div
          aria-hidden
          className={cn(
            'absolute inset-0 opacity-60 pointer-events-none',
            pattern === 'grid' ? 'bg-grid-navy' : 'bg-dot-navy',
          )}
        />
      ) : null}
      <div className="relative h-full">{children}</div>
    </div>
  ),
);
BentoTile.displayName = 'BentoTile';
