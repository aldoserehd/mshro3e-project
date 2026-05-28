/**
 * Mock data hooks. Same return shape Firestore queries will use later
 * (data | undefined + loading + error), so swapping to Firebase = zero
 * changes in components.
 */
import { useMemo } from 'react';
import type {
  Vendor,
  Service,
  Category,
  Review,
  Booking,
} from '@shared/types';
import { categories, vendors, services, reviews, bookings } from './seed';

export interface HookResult<T> {
  data: T;
  loading: boolean;
  error?: string;
}

export interface VendorFilter {
  categoryId?: string;
  query?: string;
}

export function useVendors(filter?: VendorFilter): HookResult<Vendor[]> {
  const data = useMemo(() => {
    let list = vendors;
    if (filter?.categoryId) {
      list = list.filter((v) => v.categoryIds.includes(filter.categoryId!));
    }
    if (filter?.query) {
      const q = filter.query.trim().toLowerCase();
      if (q) {
        list = list.filter(
          (v) =>
            v.name.ar.toLowerCase().includes(q) ||
            v.name.en.toLowerCase().includes(q),
        );
      }
    }
    return list;
  }, [filter?.categoryId, filter?.query]);
  return { data, loading: false };
}

export function useVendor(id: string | undefined): HookResult<Vendor | undefined> {
  const data = useMemo(() => vendors.find((v) => v.id === id), [id]);
  return { data, loading: false };
}

export function useCategories(): HookResult<Category[]> {
  return { data: categories, loading: false };
}

export function useServices(vendorId?: string): HookResult<Service[]> {
  const data = useMemo(
    () => (vendorId ? services.filter((s) => s.vendorId === vendorId) : services),
    [vendorId],
  );
  return { data, loading: false };
}

export function useService(id: string | undefined): HookResult<Service | undefined> {
  const data = useMemo(() => services.find((s) => s.id === id), [id]);
  return { data, loading: false };
}

export function useReviews(vendorId?: string): HookResult<Review[]> {
  const data = useMemo(
    () => (vendorId ? reviews.filter((r) => r.vendorId === vendorId) : reviews),
    [vendorId],
  );
  return { data, loading: false };
}

export function useBookings(_userId?: string): HookResult<Booking[]> {
  return { data: bookings, loading: false };
}

/** Featured vendors = top-rated 4 */
export function useFeaturedVendors(): HookResult<Vendor[]> {
  const data = useMemo(
    () => [...vendors].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [],
  );
  return { data, loading: false };
}

/** Nearby vendors = arbitrarily ordered list (no geo math for first cut) */
export function useNearbyVendors(): HookResult<Vendor[]> {
  return { data: vendors, loading: false };
}
