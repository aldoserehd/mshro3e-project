import 'server-only';
import type { Category, Service, Vendor } from '@shared/types';
import { COL } from '@shared/firestore-paths';
import { adminDb } from '@/lib/firebase-admin';
import { seedCategories, seedVendors, seedServices } from '@/data/seed';

const useFirebase = !!process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;

function mapDocs<T>(snap: FirebaseFirestore.QuerySnapshot): T[] {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

/** Categories from Firestore (falls back to seed when no service account). */
export async function liveCategories(): Promise<Category[]> {
  if (!useFirebase) return seedCategories.slice().sort((a, b) => a.order - b.order);
  try {
    const snap = await adminDb().collection(COL.categories).get();
    const rows = mapDocs<Category>(snap);
    return rows.length ? rows.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : seedCategories.slice();
  } catch {
    return seedCategories.slice().sort((a, b) => a.order - b.order);
  }
}

/** Vendors from Firestore. */
export async function liveVendors(): Promise<Vendor[]> {
  if (!useFirebase) return seedVendors.slice();
  try {
    const snap = await adminDb().collection(COL.vendors).get();
    return mapDocs<Vendor>(snap).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  } catch {
    return [];
  }
}

/** Products from Firestore. */
export async function liveProducts(): Promise<Service[]> {
  if (!useFirebase) return seedServices.slice();
  try {
    const snap = await adminDb().collection(COL.products).get();
    return mapDocs<Service>(snap).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  } catch {
    return [];
  }
}

export const firestoreConfigured = useFirebase;
