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
import { COL } from '@shared/firestore-paths';

export interface ActionState {
  ok: boolean;
  error?: string;
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

export async function deleteCategory(id: string): Promise<void> {
  try {
    await adminDb().collection(COL.categories).doc(id).delete();
  } catch {
    // best-effort; revalidate either way
  }
  revalidatePath('/categories');
}
