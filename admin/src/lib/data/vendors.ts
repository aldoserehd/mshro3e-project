import 'server-only';
import type { Vendor, VendorStatus } from '@shared/types';
import { seedVendors, vendorById, seedBookings, seedReviews, seedServices } from '@/data/seed';

const useFirebase = !!process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;

export interface VendorFilters {
  search?: string;
  status?: VendorStatus | 'all';
  categoryId?: string | 'all';
  sort?: 'newest' | 'oldest' | 'rating' | 'name';
}

export async function listVendors(filters: VendorFilters = {}): Promise<Vendor[]> {
  if (useFirebase) {
    // TODO: real Firestore query — kept stubbed until env wired.
    return [];
  }
  const q = (filters.search ?? '').trim().toLowerCase();
  let out = seedVendors.slice();
  if (filters.status && filters.status !== 'all') {
    out = out.filter((v) => v.status === filters.status);
  }
  if (filters.categoryId && filters.categoryId !== 'all') {
    out = out.filter((v) => v.categoryIds.includes(filters.categoryId!));
  }
  if (q) {
    out = out.filter(
      (v) =>
        v.name.ar.toLowerCase().includes(q) ||
        v.name.en.toLowerCase().includes(q) ||
        v.slug.toLowerCase().includes(q),
    );
  }
  const sort = filters.sort ?? 'newest';
  out.sort((a, b) => {
    if (sort === 'oldest') return a.createdAt - b.createdAt;
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'name') return a.name.ar.localeCompare(b.name.ar);
    return b.createdAt - a.createdAt;
  });
  return out;
}

export async function getVendor(id: string): Promise<Vendor | null> {
  if (useFirebase) {
    return null; // TODO
  }
  return vendorById(id) ?? null;
}

export async function listPendingVendors(): Promise<Vendor[]> {
  return listVendors({ status: 'pending' });
}

/** Aggregated metrics for a single vendor. */
export async function getVendorMetrics(vendorId: string) {
  const bookings = seedBookings.filter((b) => b.vendorId === vendorId);
  const reviews = seedReviews.filter((r) => r.vendorId === vendorId);
  const services = seedServices.filter((s) => s.vendorId === vendorId);
  const revenueMtd = bookings
    .filter((b) => b.status === 'completed' || b.status === 'confirmed')
    .reduce((s, b) => s + b.totalPrice, 0);
  return { bookings, reviews, services, revenueMtd };
}

/** All-vendors metrics (used by the vendors table). */
export async function listVendorsWithMetrics(filters: VendorFilters = {}) {
  const vendors = await listVendors(filters);
  return vendors.map((v) => {
    const bookings = seedBookings.filter((b) => b.vendorId === v.id);
    const revenueMtd = bookings
      .filter((b) => b.status === 'completed' || b.status === 'confirmed')
      .reduce((s, b) => s + b.totalPrice, 0);
    return { ...v, bookingsCount: bookings.length, revenueMtd };
  });
}

// TODO: real Firestore writes when env is wired.
export async function verifyVendor(_id: string) {
  return { ok: true };
}
export async function suspendVendor(_id: string) {
  return { ok: true };
}
export async function rejectVendor(_id: string) {
  return { ok: true };
}
