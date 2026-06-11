import 'server-only';
import { cache } from 'react';
import type { Vendor, VendorStatus } from '@shared/types';
import { seedVendors, vendorById } from '@/data/seed';
import { liveLeads, liveProducts, liveReviews } from '@/lib/data/live';
import { adminDb } from '@/lib/firebase-admin';
import { COL } from '@shared/firestore-paths';

const useFirebase = !!process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;

/** One Firestore read per request, shared across every filtered listVendors call. */
const fetchVendorsFromFirestore = cache(async (): Promise<Vendor[]> => {
  const snap = await adminDb().collection(COL.vendors).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Vendor);
});

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

/**
 * Aggregated metrics for a single vendor — lead/attribution based.
 * We never process payments, so "value" = WhatsApp leads + vendor-logged sales.
 */
export async function getVendorMetrics(vendorId: string) {
  const [allLeads, allProducts, allReviews] = await Promise.all([
    liveLeads(),
    liveProducts(),
    liveReviews(),
  ]);
  const leads = allLeads.filter((l) => l.vendorId === vendorId);
  const products = allProducts.filter((p) => p.vendorId === vendorId);
  const reviews = allReviews.filter((r) => r.vendorId === vendorId);
  const soldKwd = leads
    .filter((l) => l.status === 'sold')
    .reduce((sum, l) => sum + (l.saleAmount ?? 0), 0);
  return { leads, products, reviews, soldKwd };
}

/** All-vendors metrics (used by the vendors table) — lead counts, not orders. */
export async function listVendorsWithMetrics(filters: VendorFilters = {}) {
  const [vendors, allLeads] = await Promise.all([listVendors(filters), liveLeads()]);
  return vendors.map((v) => {
    const leads = allLeads.filter((l) => l.vendorId === v.id);
    const soldKwd = leads
      .filter((l) => l.status === 'sold')
      .reduce((sum, l) => sum + (l.saleAmount ?? 0), 0);
    return { ...v, leadsCount: leads.length, soldKwd };
  });
}
