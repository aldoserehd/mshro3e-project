import 'server-only';
import type { Order, OrderStatus } from '@shared/types';
import { seedOrders } from '@/data/seed';

export interface OrderFilters {
  status?: OrderStatus | 'all';
  vendorId?: string | 'all';
  customerQuery?: string;
}

export async function listOrders(filters: OrderFilters = {}): Promise<Order[]> {
  let out = seedOrders.slice();
  if (filters.status && filters.status !== 'all') {
    out = out.filter((o) => o.status === filters.status);
  }
  if (filters.vendorId && filters.vendorId !== 'all') {
    out = out.filter((o) => o.vendorId === filters.vendorId);
  }
  if (filters.customerQuery) {
    const q = filters.customerQuery.trim().toLowerCase();
    out = out.filter((o) => o.customerUid.toLowerCase().includes(q) || o.id.includes(q));
  }
  out.sort((a, b) => b.createdAt - a.createdAt);
  return out;
}
