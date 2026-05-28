'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-[15px] leading-[20px] font-semibold transition-[background-color,color,border-color,box-shadow,transform] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-navy-900 text-white hover:bg-navy-700 shadow-[var(--shadow-elev1)]',
        secondary:
          'bg-navy-50 text-navy-900 hover:bg-navy-100 border border-navy-200',
        outline:
          'bg-transparent text-navy-900 border border-navy-200 hover:bg-navy-50',
        ghost: 'bg-transparent text-navy-900 hover:bg-navy-100',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 shadow-[var(--shadow-elev1)]',
        link:
          'bg-transparent text-navy-500 hover:text-navy-700 hover:underline underline-offset-4 px-0 py-0',
      },
      size: {
        sm: 'h-8 px-3 text-[13px]',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-[16px]',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
