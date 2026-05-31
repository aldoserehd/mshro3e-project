/**
 * One-shot Firestore seeder. Mirrors the mock arrays in `src/data/seed.ts`
 * into real Firestore collections.
 *
 * Idempotent: writes a `_meta/seed` marker doc with `_seeded: true` after the
 * first successful run, and short-circuits on subsequent calls.
 *
 * Batched (max ~500 ops per batch) to stay under Firestore's batch limit.
 */
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { firebaseDb } from '@shared/firebase';
import { COL } from '@shared/firestore-paths';
import { categories, vendors, services, reviews } from '../data/seed';

const BATCH_LIMIT = 450; // leave headroom under Firestore's 500-op cap

export interface SeedResult {
  ok: boolean;
  alreadySeeded?: boolean;
  counts: {
    categories: number;
    vendors: number;
    products: number;
    reviews: number;
  };
  error?: string;
}

interface Writable {
  id: string;
  // arbitrary shape — we strip `id` when writing the doc body
  [key: string]: unknown;
}

/** Firestore rejects `undefined`. Recursively strip it from objects/arrays. */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      out[k] = stripUndefined(v);
    }
    return out as T;
  }
  return value;
}

async function writeAll(
  collectionName: string,
  items: Writable[],
  label: string,
): Promise<number> {
  const db = firebaseDb();
  let written = 0;
  for (let i = 0; i < items.length; i += BATCH_LIMIT) {
    const slice = items.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);
    for (const item of slice) {
      const { id, ...rest } = item;
      const ref = doc(collection(db, collectionName), id);
      const cleaned = stripUndefined(rest);
      batch.set(ref, {
        ...cleaned,
        updatedAt: serverTimestamp(),
        // preserve createdAt if present, otherwise stamp now
        createdAt:
          (cleaned as { createdAt?: unknown }).createdAt ?? serverTimestamp(),
      });
    }
    await batch.commit();
    written += slice.length;
    // eslint-disable-next-line no-console
    console.log(`[seed] ${label}: wrote ${written}/${items.length}`);
  }
  return written;
}

export async function seedFirestore(): Promise<SeedResult> {
  const db = firebaseDb();
  const markerRef = doc(db, '_meta', 'seed');

  try {
    const marker = await getDoc(markerRef);
    if (marker.exists() && (marker.data() as { _seeded?: boolean })._seeded) {
      // eslint-disable-next-line no-console
      console.log('[seed] already seeded, skipping');
      return {
        ok: true,
        alreadySeeded: true,
        counts: {
          categories: categories.length,
          vendors: vendors.length,
          products: services.length,
          reviews: reviews.length,
        },
      };
    }

    // eslint-disable-next-line no-console
    console.log('[seed] starting Firestore seed…');

    const catCount = await writeAll(
      COL.categories,
      categories as unknown as Writable[],
      'categories',
    );
    const venCount = await writeAll(
      COL.vendors,
      vendors as unknown as Writable[],
      'vendors',
    );
    const prodCount = await writeAll(
      COL.products,
      services as unknown as Writable[],
      'products',
    );
    const revCount = await writeAll(
      COL.reviews,
      reviews as unknown as Writable[],
      'reviews',
    );

    await setDoc(markerRef, {
      _seeded: true,
      seededAt: serverTimestamp(),
      counts: {
        categories: catCount,
        vendors: venCount,
        products: prodCount,
        reviews: revCount,
      },
    });

    // eslint-disable-next-line no-console
    console.log('[seed] done');

    return {
      ok: true,
      counts: {
        categories: catCount,
        vendors: venCount,
        products: prodCount,
        reviews: revCount,
      },
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    // eslint-disable-next-line no-console
    console.error('[seed] failed:', message);
    return {
      ok: false,
      error: message,
      counts: { categories: 0, vendors: 0, products: 0, reviews: 0 },
    };
  }
}
