import { create } from 'zustand';

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

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
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
}));
