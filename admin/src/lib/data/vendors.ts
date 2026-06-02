import 'server-only';
import type { Vendor, VendorStatus } from '@shared/types';
import { seedVendors, vendorById, seedOrders, seedReviews, seedServices } from '@/data/seed';
import { adminDb } from '@/lib/firebase-admin';
import { COL } from '@shared/firestore-paths';

const useFirebase = !!process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;

async function fetchVendorsFromFirestore(): Promise<Vendor[]> {
  const snap = await adminDb().collection(COL.vendors).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Vendor);
}

export interface VendorFilters {
  search?: string;
  status?: VendorStatus | 'all';
  categoryId?: string | 'all';
  sort?: 'newest' | 'oldest' | 'rating' | 'name';
}

export async function listVendors(filters: VendorFilters = {}): Promise<Vendor[]> {
  const q = (filters.search ?? '').trim().toLowerCase();
  let out: Vendor[];
  if (useFirebase) {
    try {
      out = await fetchVendorsFromFirestore();
    } catch {
      out = [];
    }
  } else {
    out = seedVendors.slice();
  }
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
    try {
      const doc = await adminDb().collection(COL.vendors).doc(id).get();
      return doc.exists ? ({ id: doc.id, ...doc.data() } as Vendor) : null;
    } catch {
      return null;
    }
  }
  return vendorById(id) ?? null;
}

export async function listPendingVendors(): Promise<Vendor[]> {
  return listVendors({ status: 'pending' });
}

/** Aggregated metrics for a single vendor — uses product sales as revenue source. */
export async function getVendorMetrics(vendorId: string) {
  const orders = seedOrders.filter((o) => o.vendorId === vendorId);
  const reviews = seedReviews.filter((r) => r.vendorId === vendorId);
  const products = seedServices.filter((s) => s.vendorId === vendorId);
  const revenueMtd = orders
    .filter((o) => o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped')
    .reduce((sum, o) => sum + o.total, 0);
  return { orders, reviews, products, revenueMtd };
}

/** All-vendors metrics (used by the vendors table). */
export async function listVendorsWithMetrics(filters: VendorFilters = {}) {
  const vendors = await listVendors(filters);
  return vendors.map((v) => {
    const orders = seedOrders.filter((o) => o.vendorId === v.id);
    const revenueMtd = orders
      .filter((o) => o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped')
      .reduce((sum, o) => sum + o.total, 0);
    return { ...v, ordersCount: orders.length, revenueMtd };
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
