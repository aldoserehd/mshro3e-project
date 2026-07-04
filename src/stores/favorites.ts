import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Occasion = 'all' | 'eid' | 'baby' | 'graduation' | 'wedding' | 'other';

interface FavoritesState {
  productIds: Set<string>;
  vendorIds: Set<string>;
  occasionMap: Record<string, Occasion>;
  toggleProduct: (id: string) => void;
  toggleVendor: (id: string) => void;
  setOccasion: (productId: string, o: Occasion) => void;
  isProductFavorited: (id: string) => boolean;
  isVendorFavorited: (id: string) => boolean;
}

/** JSON round-trip shape — Sets are stored as arrays. */
interface PersistedFavorites {
  productIds: string[];
  vendorIds: string[];
  occasionMap: Record<string, Occasion>;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      productIds: new Set<string>(),
      vendorIds: new Set<string>(),
      occasionMap: {},
      toggleProduct: (id) =>
        set((s) => {
          const next = new Set(s.productIds);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { productIds: next };
        }),
      toggleVendor: (id) =>
        set((s) => {
          const next = new Set(s.vendorIds);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { vendorIds: next };
        }),
      setOccasion: (productId, o) =>
        set((s) => ({ occasionMap: { ...s.occasionMap, [productId]: o } })),
      isProductFavorited: (id) => get().productIds.has(id),
      isVendorFavorited: (id) => get().vendorIds.has(id),
    }),
    {
      name: '@mshro3e/favorites',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s): PersistedFavorites => ({
        productIds: Array.from(s.productIds),
        vendorIds: Array.from(s.vendorIds),
        occasionMap: s.occasionMap,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PersistedFavorites>;
        return {
          ...current,
          productIds: new Set(p.productIds ?? []),
          vendorIds: new Set(p.vendorIds ?? []),
          occasionMap: p.occasionMap ?? {},
        };
      },
    },
  ),
);
