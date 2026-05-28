'use client';

/**
 * Direction-aware icon wrappers. Mirror chevrons/arrows in RTL per brief.
 */

import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export { Check };

/** Chevron that always visually points to the "previous" / start edge. */
export const ChevronStart = ({ className }: { className?: string }) => (
  <>
    <ChevronLeft className={`${className ?? ''} block ltr:inline rtl:hidden`} />
    <ChevronRight className={`${className ?? ''} hidden rtl:inline`} />
  </>
);

/** Chevron that always visually points to the "next" / end edge. */
export const ChevronEnd = ({ className }: { className?: string }) => (
  <>
    <ChevronRight className={`${className ?? ''} block ltr:inline rtl:hidden`} />
    <ChevronLeft className={`${className ?? ''} hidden rtl:inline`} />
  </>
);

/** Arrow pointing toward the start edge. */
export const ArrowStart = ({ className }: { className?: string }) => (
  <>
    <ArrowLeft className={`${className ?? ''} block ltr:inline rtl:hidden`} />
    <ArrowRight className={`${className ?? ''} hidden rtl:inline`} />
  </>
);

/** Arrow pointing toward the end edge. */
export const ArrowEnd = ({ className }: { className?: string }) => (
  <>
    <ArrowRight className={`${className ?? ''} block ltr:inline rtl:hidden`} />
    <ArrowLeft className={`${className ?? ''} hidden rtl:inline`} />
  </>
);
