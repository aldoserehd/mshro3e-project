'use server';

/**
 * Owner-admin catalog mutations. These run server-side via the Firebase Admin
 * SDK, which bypasses Firestore security rules — so the owner can create
 * vendors and products that the (free, browse-only) mobile app reads live.
 *
 * Images are stored as URLs (one per line) because Firebase Storage requires
 * the paid Blaze plan; this keeps everything on the free Spark tier.
 */
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { requireOwner } from '@/lib/auth';
import { COL } from '@shared/firestore-paths';
import { liveCategories } from '@/lib/data/live';
import type { Category } from '@shared/types';

export interface ActionState {
  ok: boolean;
  error?: string;
}

/**
 * Categories for client pages (vendor portal). Runs on the server via the
 * Admin SDK, so it works even when the client Firebase SDK can't read
 * (rules/config issues) — the reliable path for the storefront form.
 */
export async function fetchCategoriesAction(): Promise<Category[]> {
  return liveCategories();
}

/** Standard Kuwaiti home-business categories — one-tap starter pack. */
const STARTER_CATEGORIES: { ar: string; en: string; emoji: string; slug: string }[] = [
  { ar: 'حلويات ومخبوزات', en: 'Sweets & Bakery', emoji: '🍰', slug: 'sweets' },
  { ar: 'أكل بيت', en: 'Home Food', emoji: '🍲', slug: 'home-food' },
  { ar: 'عبايات وأزياء', en: 'Abayas & Fashion', emoji: '🧕', slug: 'fashion' },
  { ar: 'عطور وبخور', en: 'Perfumes & Bukhoor', emoji: '🌸', slug: 'perfumes' },
  { ar: 'هدايا وتغليف', en: 'Gifts & Wrapping', emoji: '🎁', slug: 'gifts' },
  { ar: 'إكسسوارات ومجوهرات', en: 'Accessories & Jewelry', emoji: '💍', slug: 'accessories' },
  { ar: 'ورد وتنسيق', en: 'Flowers & Arrangements', emoji: '💐', slug: 'flowers' },
  { ar: 'عناية وجمال', en: 'Beauty & Care', emoji: '✨', slug: 'beauty' },
  { ar: 'قهوة ومشروبات', en: 'Coffee & Drinks', emoji: '☕', slug: 'coffee' },
  { ar: 'أعمال يدوية', en: 'Handmade Crafts', emoji: '🧶', slug: 'handmade' },
  { ar: 'ديكور ومنزل', en: 'Home & Decor', emoji: '🏺', slug: 'decor' },
  { ar: 'أطفال ومواليد', en: 'Kids & Newborns', emoji: '🧸', slug: 'kids' },
  { ar: 'قرطاسية ورسم', en: 'Stationery & Art', emoji: '🎨', slug: 'art' },
  { ar: 'ضيافة وعزائم', en: 'Catering & Gatherings', emoji: '🫖', slug: 'catering' },
];

/** Insert the starter categories, skipping slugs that already exist. */
export async function seedStarterCategoriesAction(): Promise<{ added: number }> {
  await requireOwner();
  const db = adminDb();
  const existing = await db.collection(COL.categories).get();
  const have = new Set(existing.docs.map((d) => d.data().slug));
  let order = existing.size;
  let added = 0;
  const batch = db.batch();
  for (const c of STARTER_CATEGORIES) {
    if (have.has(c.slug)) continue;
    const ref = db.collection(COL.categories).doc();
    batch.set(ref, { name: { ar: c.ar, en: c.en }, emoji: c.emoji, slug: c.slug, icon: c.emoji, order: order++, createdAt: Date.now() });
    added++;
  }
  if (added > 0) await batch.commit();
  revalidatePath('/categories');
  return { added };
}

function slugify(s: string): string {
  const base = s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
  return base || `item-${Date.now()}`;
}

function lines(v: FormDataEntryValue | null): string[] {
  return String(v ?? '')
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}

// ─── vendors ────────────────────────────────────────────────────────────

export async function createVendor(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    await requireOwner();
  } catch {
    return { ok: false, error: 'Not authorized' };
  }
  const nameEn = str(fd, 'nameEn');
  const nameAr = str(fd, 'nameAr') || nameEn;
  if (!nameAr && !nameEn) return { ok: false, error: 'Name is required' };

  const now = Date.now();
  const slug = slugify(nameEn || nameAr);
  const categoryIds = fd.getAll('categoryIds').map(String).filter(Boolean);
  const phone = str(fd, 'phone');

  const doc = {
    ownerUid: 'admin',
    name: { ar: nameAr, en: nameEn || nameAr },
    slug,
    handle: slug,
    bio: { ar: str(fd, 'bioAr'), en: str(fd, 'bioEn') },
    logoImage: str(fd, 'logoImage') || null,
    coverImage: str(fd, 'coverImage') || null,
    categoryIds,
    address: { ar: str(fd, 'addressAr'), en: str(fd, 'addressEn') },
    phone,
    whatsapp: str(fd, 'whatsapp') || phone,
    workingHours: {},
    rating: 0,
    reviewCount: 0,
    status: 'active' as const,
    tier: null,
    verifiedAt: fd.get('verified') ? now : null,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await adminDb().collection(COL.vendors).add(doc);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to create vendor' };
  }
  revalidatePath('/vendors');
  redirect('/vendors');
}

// ─── products ───────────────────────────────────────────────────────────

export async function createProduct(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    await requireOwner();
  } catch {
    return { ok: false, error: 'Not authorized' };
  }
  const vendorId = str(fd, 'vendorId');
  const titleEn = str(fd, 'titleEn');
  const titleAr = str(fd, 'titleAr') || titleEn;
  if (!vendorId) return { ok: false, error: 'Choose a vendor' };
  if (!titleAr && !titleEn) return { ok: false, error: 'Product title is required' };

  const price = Number(str(fd, 'price'));
  if (!Number.isFinite(price) || price < 0) return { ok: false, error: 'Enter a valid price' };

  const images = lines(fd.get('images'));
  const prepHours = Number(str(fd, 'prepHours')) || 0;
  const categoryIds = fd.getAll('categoryIds').map(String).filter(Boolean);
  const now = Date.now();

  const doc = {
    vendorId,
    title: { ar: titleAr, en: titleEn || titleAr },
    description: { ar: str(fd, 'descAr'), en: str(fd, 'descEn') },
    images,
    price,
    currency: 'KWD',
    durationMinutes: Math.round(prepHours * 60),
    categoryIds,
    active: true,
    createdAt: now,
  };

  try {
    await adminDb().collection(COL.products).add(doc);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to create product' };
  }
  revalidatePath('/products');
  redirect('/products');
}

// ─── categories ─────────────────────────────────────────────────────────

export async function createCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    await requireOwner();
  } catch {
    return { ok: false, error: 'Not authorized' };
  }
  const nameEn = str(fd, 'nameEn');
  const nameAr = str(fd, 'nameAr') || nameEn;
  if (!nameAr && !nameEn) return { ok: false, error: 'Name is required' };

  const slug = slugify(nameEn || nameAr);
  const emoji = str(fd, 'emoji') || '🏷️';
  const icon = str(fd, 'icon') || 'pricetag-outline';

  try {
    const db = adminDb();
    // Next display order = max(existing) + 1.
    const snap = await db.collection(COL.categories).get();
    const order = snap.empty
      ? 1
      : Math.max(...snap.docs.map((d) => Number((d.data() as { order?: number }).order) || 0)) + 1;
    await db.collection(COL.categories).add({
      name: { ar: nameAr, en: nameEn || nameAr },
      emoji,
      icon,
      slug,
      order,
    });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to create category' };
  }
  revalidatePath('/categories');
  redirect('/categories');
}

// ─── category suggestions (vendor → owner review) ──────────────────────

/** Approve a vendor suggestion: create a category from its text, then remove it. */
export async function approveCategorySuggestion(id: string): Promise<ActionState> {
  try {
    await requireOwner();
  } catch {
    return { ok: false, error: 'Not authorized' };
  }
  try {
    const db = adminDb();
    const ref = db.collection('categorySuggestions').doc(id);
    const snap = await ref.get();
    const text = (snap.data()?.text as string | undefined)?.trim();
    if (!text) return { ok: false, error: 'Suggestion not found' };
    const all = await db.collection(COL.categories).get();
    const order = all.empty
      ? 1
      : Math.max(...all.docs.map((d) => Number((d.data() as { order?: number }).order) || 0)) + 1;
    await db.collection(COL.categories).add({
      name: { ar: text, en: text },
      emoji: '🏷️',
      icon: 'pricetag-outline',
      slug: slugify(text),
      order,
    });
    await ref.delete();
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed' };
  }
  revalidatePath('/categories');
  return { ok: true };
}

/** Dismiss (delete) a vendor suggestion. */
export async function dismissCategorySuggestion(id: string): Promise<ActionState> {
  try {
    await requireOwner();
    await adminDb().collection('categorySuggestions').doc(id).delete();
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed' };
  }
  revalidatePath('/categories');
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await requireOwner();
    await adminDb().collection(COL.categories).doc(id).delete();
  } catch {
    // best-effort; revalidate either way
  }
  revalidatePath('/categories');
}
