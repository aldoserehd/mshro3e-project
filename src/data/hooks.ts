/**
 * Firestore-backed data hooks. Each hook subscribes via `onSnapshot` and
 * returns the same `{ data, loading, error? }` shape the mock hooks used,
 * so callers don't have to change.
 *
 * Collections:
 *   - categories  → COL.categories
 *   - vendors     → COL.vendors (active only)
 *   - products    → COL.products  (typed as Service for backward compat)
 *   - reviews     → COL.reviews
 */
import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore';
import type { Vendor, Service, Category, Review } from '@shared/types';
import { firebaseDb } from '@shared/firebase';
import { COL } from '@shared/firestore-paths';
import {
  categories as seedCategories,
  vendors as seedVendors,
  services as seedServices,
  reviews as seedReviews,
  servicesForVendor,
  reviewsForVendor,
  vendorById,
  serviceById,
} from './seed';

/**
 * DEMO MOCK FALLBACK — TEMPORARY.
 * When `true`, any hook whose Firestore query comes back empty (or errors,
 * e.g. rules not published / no network) transparently serves the bundled
 * Kuwaiti seed data so the app is fully viewable with zero backend setup.
 * Real Firestore data, when present, always wins.
 *
 * TO REMOVE for production: set this to `false` (or revert the commit titled
 * "demo: seed-data fallback in hooks"). No other code changes needed.
 */
export const MOCK_FALLBACK = true;

export interface HookResult<T> {
  data: T;
  loading: boolean;
  error?: string;
}

export interface VendorFilter {
  categoryId?: string;
  query?: string;
}

// ─── helpers ──────────────────────────────────────────────────────────

function snapToArray<T>(snap: QuerySnapshot<DocumentData>): T[] {
  const out: T[] = [];
  snap.forEach((d) => {
    out.push({ id: d.id, ...(d.data() as object) } as T);
  });
  return out;
}

// ─── categories ───────────────────────────────────────────────────────

export function useCategories(): HookResult<Category[]> {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    try {
      const q = query(collection(firebaseDb(), COL.categories), orderBy('order', 'asc'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          if (cancelled) return;
          setData(snapToArray<Category>(snap));
          setLoading(false);
        },
        (err) => {
          if (cancelled) return;
          setError(err.message);
          setLoading(false);
        },
      );
      return () => {
        cancelled = true;
        unsub();
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }
  }, []);

  if (MOCK_FALLBACK && data.length === 0) {
    return { data: seedCategories, loading: false, error };
  }
  return { data, loading, error };
}

// ─── vendors ──────────────────────────────────────────────────────────

export function useVendors(filter?: VendorFilter): HookResult<Vendor[]> {
  const [rows, setRows] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    try {
      const q = query(collection(firebaseDb(), COL.vendors), where('status', '==', 'active'));
      const unsub = onSnapshot(
        q,
        (snap) => {
          if (cancelled) return;
          setRows(snapToArray<Vendor>(snap));
          setLoading(false);
        },
        (err) => {
          if (cancelled) return;
          setError(err.message);
          setLoading(false);
        },
      );
      return () => {
        cancelled = true;
        unsub();
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }
  }, []);

  const usingMock = MOCK_FALLBACK && rows.length === 0;
  const data = useMemo(() => {
    let list = usingMock ? seedVendors : rows;
    if (filter?.categoryId) {
      list = list.filter((v) => v.categoryIds?.includes(filter.categoryId!));
    }
    if (filter?.query) {
      const q = filter.query.trim().toLowerCase();
      if (q) {
        list = list.filter(
          (v) =>
            v.name?.ar?.toLowerCase().includes(q) ||
            v.name?.en?.toLowerCase().includes(q),
        );
      }
    }
    return list;
  }, [rows, usingMock, filter?.categoryId, filter?.query]);

  return { data, loading: usingMock ? false : loading, error };
}

export function useVendor(id: string | undefined): HookResult<Vendor | undefined> {
  const [data, setData] = useState<Vendor | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!id) {
      setData(undefined);
      setLoading(false);
      return;
    }
    let cancelled = false;
    try {
      const ref = doc(firebaseDb(), COL.vendors, id);
      const unsub = onSnapshot(
        ref,
        (snap) => {
          if (cancelled) return;
          if (snap.exists()) {
            setData({ id: snap.id, ...(snap.data() as object) } as Vendor);
          } else {
            setData(undefined);
          }
          setLoading(false);
        },
        (err) => {
          if (cancelled) return;
          setError(err.message);
          setLoading(false);
        },
      );
      return () => {
        cancelled = true;
        unsub();
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }
  }, [id]);

  if (MOCK_FALLBACK && !data) {
    const mock = vendorById(id ?? '');
    if (mock) return { data: mock, loading: false, error };
  }
  return { data, loading, error };
}

// ─── services (Firestore collection: products) ────────────────────────

export function useServices(vendorId?: string): HookResult<Service[]> {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    try {
      const base = collection(firebaseDb(), COL.products);
      const q = vendorId ? query(base, where('vendorId', '==', vendorId)) : query(base);
      const unsub = onSnapshot(
        q,
        (snap) => {
          if (cancelled) return;
          setData(snapToArray<Service>(snap));
          setLoading(false);
        },
        (err) => {
          if (cancelled) return;
          setError(err.message);
          setLoading(false);
        },
      );
      return () => {
        cancelled = true;
        unsub();
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }
  }, [vendorId]);

  if (MOCK_FALLBACK && data.length === 0) {
    const mock = vendorId ? servicesForVendor(vendorId) : seedServices;
    return { data: mock, loading: false, error };
  }
  return { data, loading, error };
}

export function useService(id: string | undefined): HookResult<Service | undefined> {
  const [data, setData] = useState<Service | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!id) {
      setData(undefined);
      setLoading(false);
      return;
    }
    let cancelled = false;
    try {
      const ref = doc(firebaseDb(), COL.products, id);
      const unsub = onSnapshot(
        ref,
        (snap) => {
          if (cancelled) return;
          if (snap.exists()) {
            setData({ id: snap.id, ...(snap.data() as object) } as Service);
          } else {
            setData(undefined);
          }
          setLoading(false);
        },
        (err) => {
          if (cancelled) return;
          setError(err.message);
          setLoading(false);
        },
      );
      return () => {
        cancelled = true;
        unsub();
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }
  }, [id]);

  if (MOCK_FALLBACK && !data) {
    const mock = serviceById(id ?? '');
    if (mock) return { data: mock, loading: false, error };
  }
  return { data, loading, error };
}

// ─── reviews ──────────────────────────────────────────────────────────

export function useReviews(vendorId?: string): HookResult<Review[]> {
  const [data, setData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    try {
      const base = collection(firebaseDb(), COL.reviews);
      const q = vendorId ? query(base, where('vendorId', '==', vendorId)) : query(base);
      const unsub = onSnapshot(
        q,
        (snap) => {
          if (cancelled) return;
          setData(snapToArray<Review>(snap));
          setLoading(false);
        },
        (err) => {
          if (cancelled) return;
          setError(err.message);
          setLoading(false);
        },
      );
      return () => {
        cancelled = true;
        unsub();
      };
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }
  }, [vendorId]);

  if (MOCK_FALLBACK && data.length === 0) {
    const mock = vendorId ? reviewsForVendor(vendorId) : seedReviews;
    return { data: mock, loading: false, error };
  }
  return { data, loading, error };
}

// ─── derived: featured + nearby ───────────────────────────────────────

/** Featured vendors = top-rated 4. Derived from `useVendors`. */
export function useFeaturedVendors(): HookResult<Vendor[]> {
  const { data, loading, error } = useVendors();
  const featured = useMemo(
    () => [...data].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 4),
    [data],
  );
  return { data: featured, loading, error };
}

/** Nearby vendors = all active vendors (no geo math for first cut). */
export function useNearbyVendors(): HookResult<Vendor[]> {
  return useVendors();
}
