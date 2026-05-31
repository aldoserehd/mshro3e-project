/**
 * Centralized Firestore collection names. Keep this file the single source of truth
 * so collection names never go out of sync between mobile, admin, and seed code.
 */
export const COL = {
  categories: 'categories',
  vendors: 'vendors',
  products: 'products', // we renamed services to products
  reviews: 'reviews',
  users: 'users',
  subscriptions: 'subscriptions',
} as const;

export type CollectionName = (typeof COL)[keyof typeof COL];
