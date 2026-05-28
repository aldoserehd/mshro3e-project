'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-navy-950/55 backdrop-blur-sm motion-safe:transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

const sheetVariants = cva(
  'fixed z-50 bg-white shadow-[var(--shadow-elev4)] motion-safe:transition-transform duration-300 ease-out flex flex-col',
  {
    variants: {
      side: {
        end: 'top-0 end-0 h-full w-full max-w-md border-s border-navy-200 data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full rtl:data-[state=closed]:-translate-x-full',
        start:
          'top-0 start-0 h-full w-full max-w-md border-e border-navy-200 data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full rtl:data-[state=closed]:translate-x-full',
        top: 'top-0 inset-x-0 max-h-[80vh] border-b border-navy-200 data-[state=open]:translate-y-0 data-[state=closed]:-translate-y-full',
        bottom: 'bottom-0 inset-x-0 max-h-[80vh] rounded-t-[16px] border-t border-navy-200 data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full',
      },
    },
    defaultVariants: { side: 'end' },
  },
);

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side, className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      {children}
      <DialogPrimitive.Close
        aria-label="إغلاق"
        className="absolute end-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-navy-50 hover:text-ink-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600"
      >
        <X className="size-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1.5 px-5 py-4 border-b border-ink-200 pe-12', className)} {...props} />
);

export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto flex flex-row justify-end gap-2 px-5 py-4 border-t border-ink-200', className)} {...props} />
);

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-[17px] leading-[24px] font-semibold text-ink-900', className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-[13px] leading-[18px] text-ink-500', className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;
