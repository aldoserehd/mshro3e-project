import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import type { Dict } from '@/i18n/dict';
import type { VendorStatus, BookingStatus, OrderStatus } from '@shared/types';

export function VendorStatusPill({ status, t }: { status: VendorStatus; t: Dict }) {
  const map: Record<VendorStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> = {
    active: { label: t.vendors.filterActive, tone: 'success' },
    pending: { label: t.vendors.filterPending, tone: 'warning' },
    suspended: { label: t.vendors.filterSuspended, tone: 'danger' },
    rejected: { label: t.vendors.filterRejected, tone: 'neutral' },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function BookingStatusPill({ status, t }: { status: BookingStatus; t: Dict }) {
  const map: Record<BookingStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'brand' }> = {
    pending: { label: t.bookings.statusPending, tone: 'warning' },
    confirmed: { label: t.bookings.statusConfirmed, tone: 'info' },
    in_progress: { label: t.bookings.statusInProgress, tone: 'brand' },
    completed: { label: t.bookings.statusCompleted, tone: 'success' },
    cancelled_by_customer: { label: t.bookings.statusCancelledCustomer, tone: 'neutral' },
    cancelled_by_vendor: { label: t.bookings.statusCancelledVendor, tone: 'danger' },
    no_show: { label: t.bookings.statusNoShow, tone: 'danger' },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function OrderStatusPill({ status, t }: { status: OrderStatus; t: Dict }) {
  const map: Record<OrderStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'brand' }> = {
    pending: { label: t.orders.statusPending, tone: 'warning' },
    paid: { label: t.orders.statusPaid, tone: 'info' },
    preparing: { label: t.orders.statusPreparing, tone: 'brand' },
    shipped: { label: t.orders.statusShipped, tone: 'info' },
    delivered: { label: t.orders.statusDelivered, tone: 'success' },
    cancelled: { label: t.orders.statusCancelled, tone: 'neutral' },
    refunded: { label: t.orders.statusRefunded, tone: 'danger' },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
