'use client';

/**
 * Vendor-portal Firestore CRUD (client SDK, runs as the authenticated vendor —
 * writes pass the security rules because the vendor is signed in).
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { dbClient } from '@/lib/firebase-client';
import { COL } from '@shared/firestore-paths';
import type { Category, Service, Vendor } from '@shared/types';

function mapDocs<T>(docs: { id: string; data: () => unknown }[]): T[] {
  return docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as T);
}

export interface StorefrontInput {
  nameAr: string;
  nameEn: string;
  bioAr: string;
  bioEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  whatsapp: string;
  logoImage: string;
  /** 0.5–2 — how zoomed the logo sits inside its circle. */
  logoZoom?: number;
  coverImage: string;
  categoryIds: string[];
}

function slugify(s: string): string {
  return (
    s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 40) ||
    `vendor-${Date.now()}`
  );
}

/** Create (first time) or update the signed-in vendor's storefront. Returns the id. */
export async function saveStorefront(
  ownerUid: string,
  existingId: string | null,
  input: StorefrontInput,
): Promise<string> {
  const db = dbClient();
  const slug = slugify(input.nameEn || input.nameAr);
  const base = {
    name: { ar: input.nameAr, en: input.nameEn || input.nameAr },
    bio: { ar: input.bioAr, en: input.bioEn },
    address: { ar: input.addressAr, en: input.addressEn },
    phone: input.phone,
    whatsapp: input.whatsapp || input.phone,
    logoImage: input.logoImage || null,
    logoZoom: input.logoZoom ?? 1,
    coverImage: input.coverImage || null,
    categoryIds: input.categoryIds,
    updatedAt: Date.now(),
  };

  if (existingId) {
    await updateDoc(doc(db, COL.vendors, existingId), base);
    return existingId;
  }

  const ref = await addDoc(collection(db, COL.vendors), {
    ...base,
    ownerUid,
    slug,
    handle: slug,
    workingHours: {},
    rating: 0,
    reviewCount: 0,
    status: 'active',
    tier: null,
    verifiedAt: null,
    createdAt: Date.now(),
    _createdAtServer: serverTimestamp(),
  });
  return ref.id;
}

// ─── products ─────────────────────────────────────────────────────────

export async function listMyProducts(vendorId: string): Promise<Service[]> {
  const snap = await getDocs(query(collection(dbClient(), COL.products), where('vendorId', '==', vendorId)));
  return mapDocs<Service>(snap.docs).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export interface ProductInput {
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  price: number;
  prepHours: number;
  images: string[];
  categoryIds: string[];
  active: boolean;
}

export async function createProduct(vendorId: string, input: ProductInput): Promise<string> {
  const ref = await addDoc(collection(dbClient(), COL.products), {
    vendorId,
    title: { ar: input.titleAr, en: input.titleEn || input.titleAr },
    description: { ar: input.descAr, en: input.descEn },
    images: input.images,
    price: input.price,
    currency: 'KWD',
    durationMinutes: Math.round(input.prepHours * 60),
    categoryIds: input.categoryIds,
    active: input.active,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  await setDoc(
    doc(dbClient(), COL.products, id),
    {
      title: { ar: input.titleAr, en: input.titleEn || input.titleAr },
      description: { ar: input.descAr, en: input.descEn },
      images: input.images,
      price: input.price,
      durationMinutes: Math.round(input.prepHours * 60),
      categoryIds: input.categoryIds,
      active: input.active,
    },
    { merge: true },
  );
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(dbClient(), COL.products, id));
}

export async function getProduct(id: string): Promise<Service | null> {
  const snap = await getDoc(doc(dbClient(), COL.products, id));
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as object) } as Service) : null;
}

// ─── categories (public read) ─────────────────────────────────────────

export async function listCategories(): Promise<Category[]> {
  const snap = await getDocs(collection(dbClient(), COL.categories));
  return mapDocs<Category>(snap.docs).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Vendor proposes a category that doesn't exist yet (owner reviews later). */
export async function suggestCategory(text: string, vendorName?: string): Promise<void> {
  await addDoc(collection(dbClient(), 'categorySuggestions'), {
    text: text.trim(),
    vendorName: vendorName ?? null,
    createdAt: Date.now(),
  });
}

// ─── leads (attribution) ──────────────────────────────────────────────

/** Lead Inbox statuses — the mini-CRM that turns "leads" into "money". */
export type LeadStatus = 'new' | 'replied' | 'sold';

export interface Lead {
  id: string;
  vendorId: string;
  productId?: string;
  productTitle?: string;
  customerUid?: string | null;
  note?: string | null;
  ref: string;
  channel?: string;
  status?: LeadStatus | string;
  /** KWD amount the vendor logged when marking the lead "sold". */
  saleAmount?: number | null;
  createdAt?: number;
}

export async function listMyLeads(vendorId: string): Promise<Lead[]> {
  // Avoid a composite index: filter by vendorId only, sort client-side.
  const snap = await getDocs(query(collection(dbClient(), COL.leads), where('vendorId', '==', vendorId)));
  return mapDocs<Lead>(snap.docs).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

/** Vendor marks a lead replied / sold (+ optional KWD amount). */
export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  saleAmount?: number | null,
): Promise<void> {
  await updateDoc(doc(dbClient(), COL.leads, leadId), {
    status,
    saleAmount: status === 'sold' ? (saleAmount ?? null) : null,
    statusUpdatedAt: Date.now(),
  });
}
