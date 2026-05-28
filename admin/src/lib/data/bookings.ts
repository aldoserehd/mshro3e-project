import 'server-only';
import type { Booking, BookingStatus } from '@shared/types';
import { seedBookings } from '@/data/seed';

export interface BookingFilters {
  status?: BookingStatus | 'all';
  vendorId?: string | 'all';
  customerQuery?: string;
  from?: number;
  to?: number;
}

export async function listBookings(filters: BookingFilters = {}): Promise<Booking[]> {
  let out = seedBookings.slice();
  if (filters.status && filters.status !== 'all') {
    out = out.filter((b) => b.status === filters.status);
  }
  if (filters.vendorId && filters.vendorId !== 'all') {
    out = out.filter((b) => b.vendorId === filters.vendorId);
  }
  if (filters.from) {
    out = out.filter((b) => b.startAt >= filters.from!);
  }
  if (filters.to) {
    out = out.filter((b) => b.startAt <= filters.to!);
  }
  if (filters.customerQuery) {
    const q = filters.customerQuery.trim().toLowerCase();
    out = out.filter((b) => b.customerUid.toLowerCase().includes(q));
  }
  out.sort((a, b) => b.startAt - a.startAt);
  return out;
}
