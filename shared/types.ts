/**
 * Shared domain types for Mshro3e marketplace + booking platform.
 * Used by both mobile (RN) and admin (Next.js).
 */

export type ID = string;
export type Timestamp = number; // epoch ms

export type Locale = 'ar' | 'en';
export type LocalizedString = { ar: string; en: string };

export type UserRole = 'owner' | 'vendor' | 'staff' | 'customer';

export interface UserProfile {
  uid: ID;
  role: UserRole;
  phone?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  locale: Locale;
  createdAt: Timestamp;
  vendorId?: ID;        // populated if role === 'vendor' | 'staff'
  staffPermissions?: StaffPermission[];
}

export type StaffPermission =
  | 'bookings.read'
  | 'bookings.write'
  | 'services.write'
  | 'products.write'
  | 'orders.write'
  | 'customers.read'
  | 'analytics.read'
  | 'payouts.read';

export type VendorStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export interface Vendor {
  id: ID;
  ownerUid: ID;
  name: LocalizedString;
  slug: string;
  /** Public handle for mini-store URL: mshro3e.com/@<handle> */
  handle?: string;
  bio?: LocalizedString;
  coverImage?: string;
  logoImage?: string;
  categoryIds: ID[];
  location?: GeoLocation;
  address?: LocalizedString;
  /** Kuwait governorate for delivery presets */
  governorate?: 'capital' | 'hawalli' | 'farwaniya' | 'ahmadi' | 'jahra' | 'mubarak_al_kabeer';
  phone?: string;
  whatsapp?: string;
  workingHours: WorkingHours;
  rating: number;
  reviewCount: number;
  status: VendorStatus;
  /** Current subscription tier — null = no active subscription (Free) */
  tier?: 'basic' | 'pro' | 'managed' | null;
  /** Epoch ms when the paid subscription expires; <= now means Free. */
  subscriptionUntil?: Timestamp | null;
  verifiedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  geohash?: string;
}

export interface WorkingHours {
  // 0 = Sunday … 6 = Saturday
  [dayOfWeek: number]: { open: string; close: string; closed?: boolean }[];
}

export interface Category {
  id: ID;
  name: LocalizedString;
  icon: string;          // ionicons / material name
  emoji?: string;        // displayed in chips/rails
  slug: string;
  order: number;
  parentId?: ID;
}

export interface Service {
  id: ID;
  vendorId: ID;
  title: LocalizedString;
  description?: LocalizedString;
  images: string[];
  price: number;
  currency: string;       // 'SAR' | 'AED' | ...
  durationMinutes: number;
  categoryIds: ID[];
  active: boolean;
  createdAt: Timestamp;
}

export interface Product {
  id: ID;
  vendorId: ID;
  title: LocalizedString;
  description?: LocalizedString;
  images: string[];
  price: number;
  currency: string;
  stock: number;
  variants?: ProductVariant[];
  categoryIds: ID[];
  active: boolean;
  createdAt: Timestamp;
}

export interface ProductVariant {
  id: ID;
  label: LocalizedString;
  priceDelta: number;
  stock: number;
}

export type SubscriptionTier = 'basic' | 'pro' | 'managed';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'paused';

export interface Subscription {
  id: ID;
  vendorId: ID;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  /** KWD monthly price snapshot at signup (lets us grandfather old prices) */
  monthlyPriceKwd: number;
  /** Annual billing toggle */
  isAnnual: boolean;
  trialEndsAt?: Timestamp;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: ID;
  customerUid: ID;
  vendorId: ID;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  status: OrderStatus;
  shippingAddress?: Address;
  createdAt: Timestamp;
}

export interface OrderItem {
  productId: ID;
  variantId?: ID;
  title: LocalizedString;
  quantity: number;
  unitPrice: number;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  country: string;
  postalCode?: string;
  geo?: GeoLocation;
}

export interface Review {
  id: ID;
  vendorId: ID;
  customerUid: ID;
  bookingId?: ID;
  orderId?: ID;
  rating: number;        // 1-5
  comment?: string;
  flagged: boolean;
  vendorReply?: string;
  createdAt: Timestamp;
}

export interface PayoutRequest {
  id: ID;
  vendorId: ID;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  requestedAt: Timestamp;
  resolvedAt?: Timestamp;
  resolvedBy?: ID;
}
