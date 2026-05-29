/**
 * Kuwait home-business marketplace mock data.
 * Service type is reused as "Product" — durationMinutes acts as prep-time hours.
 */
import type {
  Category,
  Vendor,
  Service,
  Review,
} from '@shared/types';

const now = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const logoFor = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A1020&color=fff&size=200&bold=true`;

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories: Category[] = [
  { id: 'cat-bakery',   emoji: '🧁', name: { ar: 'مخبوزات وحلويات', en: 'Bakes & sweets' },    icon: 'cafe-outline',         slug: 'bakery',   order: 1 },
  { id: 'cat-perfumes', emoji: '🌹', name: { ar: 'عطور وبخور',       en: 'Perfumes & bukhoor' }, icon: 'sparkles-outline',     slug: 'perfumes', order: 2 },
  { id: 'cat-jewelry',  emoji: '💍', name: { ar: 'مجوهرات',          en: 'Jewelry' },           icon: 'diamond-outline',      slug: 'jewelry',  order: 3 },
  { id: 'cat-clothing', emoji: '👗', name: { ar: 'ملابس وعبايات',    en: 'Clothing' },          icon: 'shirt-outline',        slug: 'clothing', order: 4 },
  { id: 'cat-beauty',   emoji: '💄', name: { ar: 'جمال وعناية',      en: 'Beauty & care' },     icon: 'flower-outline',       slug: 'beauty',   order: 5 },
  { id: 'cat-decor',    emoji: '🏠', name: { ar: 'ديكور المنزل',     en: 'Home decor' },        icon: 'bed-outline',          slug: 'decor',    order: 6 },
  { id: 'cat-kids',     emoji: '👶', name: { ar: 'أطفال ومواليد',    en: 'Kids & babies' },     icon: 'happy-outline',        slug: 'kids',     order: 7 },
  { id: 'cat-art',      emoji: '🎨', name: { ar: 'فن ومطبوعات',      en: 'Art & prints' },      icon: 'color-palette-outline',slug: 'art',      order: 8 },
  { id: 'cat-plants',   emoji: '🪴', name: { ar: 'نباتات',           en: 'Plants' },            icon: 'leaf-outline',         slug: 'plants',   order: 9 },
  { id: 'cat-pets',     emoji: '🐾', name: { ar: 'حيوانات أليفة',    en: 'Pets' },              icon: 'paw-outline',          slug: 'pets',     order: 10 },
  { id: 'cat-gifts',    emoji: '🎁', name: { ar: 'هدايا ومناسبات',   en: 'Gifts & occasions' }, icon: 'gift-outline',         slug: 'gifts',    order: 11 },
];

const std = {
  0: [{ open: '10:00', close: '22:00' }],
  1: [{ open: '10:00', close: '22:00' }],
  2: [{ open: '10:00', close: '22:00' }],
  3: [{ open: '10:00', close: '22:00' }],
  4: [{ open: '10:00', close: '22:00' }],
  5: [{ open: '14:00', close: '00:00' }],
  6: [{ open: '10:00', close: '22:00' }],
};

const vendor = (
  id: string,
  ownerUid: string,
  nameAr: string,
  nameEn: string,
  handle: string,
  bioAr: string,
  bioEn: string,
  catId: string,
  area: string,
  coverId: string,
  rating: number,
  reviewCount: number,
  tier: 'basic' | 'pro' | 'managed',
): Vendor => ({
  id,
  ownerUid,
  name: { ar: nameAr, en: nameEn },
  slug: handle,
  handle,
  bio: { ar: bioAr, en: bioEn },
  coverImage: u(coverId),
  logoImage: logoFor(nameEn),
  categoryIds: [catId],
  location: { lat: 29.3338, lng: 48.0728 },
  address: { ar: `${area}، الكويت`, en: `${area}, Kuwait` },
  governorate: 'capital',
  phone: '+96550000001',
  whatsapp: '+96550000001',
  workingHours: std,
  rating,
  reviewCount,
  status: 'active',
  tier,
  verifiedAt: now - 60 * DAY,
  createdAt: now - 200 * DAY,
  updatedAt: now - 2 * HOUR,
});

export const vendors: Vendor[] = [
  vendor('v-boutique-bakery',  'u-1', 'بوتيك بيكري',         'Boutique Bakery',    'boutique.bakery',  'حلويات وكيك مناسبات بلمسة فاخرة، صنع كويتي.',  'Artisan bakes and event cakes, made in Kuwait.', 'cat-bakery',   'العقيلة',  '1542826438-bd32f43d626f', 4.9, 312, 'pro'),
  vendor('v-salmiya-oud',      'u-2', 'عود السالمية',        'Salmiya Oud',        'salmiya.oud',      'عود وبخور وعطور شرقية فاخرة.',                  'Premium oud, bukhoor and oriental perfumes.',     'cat-perfumes', 'السالمية', '1592945403244-b3fbafd7f539', 4.8, 184, 'pro'),
  vendor('v-noor-jewelry',     'u-3', 'مجوهرات نور',          'Noor Jewelry',       'noor.jewelry',     'مجوهرات يدوية الصنع بتصاميم كويتية.',           'Handmade jewelry with Kuwaiti design.',           'cat-jewelry',  'حولي',     '1515562141207-7a88fb7ce338', 4.9, 412, 'pro'),
  vendor('v-haya-abaya',       'u-4', 'هيا للعبايات',         'Haya Abayas',        'haya.abaya',       'عبايات تصاميم خاصة بقياسات مفصّلة.',           'Custom abayas tailored to your measurements.',    'cat-clothing', 'الجابرية', '1583391733956-3e0a91c5d9c5', 4.7, 96,  'basic'),
  vendor('v-bayt-decor',       'u-5', 'بيت الديكور',          'Bayt Decor',         'bayt.decor',       'سيراميك ومنحوتات يدوية لتزيين بيتك.',          'Handmade ceramics and decor for your home.',      'cat-decor',    'مشرف',     '1556909114-f6e7ad7d3136', 4.8, 142, 'managed'),
  vendor('v-rose-beauty',      'u-6', 'روز للتجميل',          'Rose Beauty',        'rose.beauty',      'منتجات عناية بالبشرة بمكونات طبيعية.',         'Natural skincare from a Kuwaiti studio.',         'cat-beauty',   'الفنطاس',  '1612817288484-6f916006741a', 4.6, 78,  'basic'),
  vendor('v-little-things',    'u-7', 'لتل ثنغز',             'Little Things',      'little.things',    'هدايا وألعاب أطفال بصنع منزلي.',               'Handmade gifts and toys for kids.',               'cat-kids',     'بيان',     '1605664041952-4a2855d6e8b4', 4.8, 56,  'basic'),
  vendor('v-khat-arabia',      'u-8', 'خط العربية',           'Khat Arabia',        'khat.arabia',      'لوحات خط عربي وحروف ديكور مخصصة.',            'Custom Arabic calligraphy art prints.',           'cat-art',      'السالمية', '1565647952915-15d8c5e2e3df', 4.9, 224, 'pro'),
];

const KWD = 'KWD';

const product = (
  id: string,
  vendorId: string,
  titleAr: string,
  titleEn: string,
  price: number,
  imgId: string,
  categoryId: string,
  descAr?: string,
  descEn?: string,
  prepHours = 24,
): Service => ({
  id,
  vendorId,
  title: { ar: titleAr, en: titleEn },
  description: descAr ? { ar: descAr, en: descEn ?? descAr } : undefined,
  images: [u(imgId)],
  price,
  currency: KWD,
  durationMinutes: prepHours * 60,
  categoryIds: [categoryId],
  active: true,
  createdAt: now - 60 * DAY,
});

export const services: Service[] = [
  // Boutique Bakery
  product('p-bb-1', 'v-boutique-bakery', 'كيكة زعفران فاخرة',   'Luxury Saffron Cake',  15,    '1542826438-bd32f43d626f', 'cat-bakery', 'كيكة الزعفران الفاخرة محضّرة يدوياً بمكونات عالية الجودة. تنزّل قلوبها أعلى المخبوزات معاكم.', 'A luxury saffron cake, handmade with premium ingredients. Serves 10.', 24),
  product('p-bb-2', 'v-boutique-bakery', 'كيكة فستق وردي',      'Rose Pistachio Cake',  8,     '1565958011703-44f9829ba187', 'cat-bakery', undefined, undefined, 24),
  product('p-bb-3', 'v-boutique-bakery', 'كيكة الشوكولاتة',     'Chocolate Fudge Cake', 12.5,  '1606313564200-e75d5e30476c', 'cat-bakery', undefined, undefined, 24),
  product('p-bb-4', 'v-boutique-bakery', 'عبوة كوكيز مشكّلة',   'Assorted Cookies Box', 6,     '1499636136210-6f4ee915583e', 'cat-bakery', undefined, undefined, 12),

  // Salmiya Oud
  product('p-so-1', 'v-salmiya-oud',     'دهن العود فاخر 6 مل', 'Premium Oud Oil 6ml',  45,    '1592945403244-b3fbafd7f539', 'cat-perfumes', undefined, undefined, 1),
  product('p-so-2', 'v-salmiya-oud',     'بخور الفخر',           'Royal Bukhoor',        25,    '1599948128020-9a44505b58da', 'cat-perfumes', undefined, undefined, 1),
  product('p-so-3', 'v-salmiya-oud',     'عطر مسك المساء',       'Misk Evening Perfume', 18,    '1574494661395-9b3b32fbc7c0', 'cat-perfumes', undefined, undefined, 1),

  // Noor Jewelry
  product('p-nj-1', 'v-noor-jewelry',    'قلادة ذهب 18',        'Gold Necklace 18k',    88,    '1515562141207-7a88fb7ce338', 'cat-jewelry', undefined, undefined, 48),
  product('p-nj-2', 'v-noor-jewelry',    'خاتم لؤلؤ كويتي',     'Kuwaiti Pearl Ring',   45,    '1606760227091-3dd870d97f1d', 'cat-jewelry', undefined, undefined, 48),
  product('p-nj-3', 'v-noor-jewelry',    'سوار مينا',           'Enamel Bracelet',      32,    '1599643478518-a784e5dc4c8f', 'cat-jewelry', undefined, undefined, 48),

  // Haya Abayas
  product('p-ha-1', 'v-haya-abaya',      'عباية كلاسيكية',      'Classic Abaya',        35,    '1583391733956-3e0a91c5d9c5', 'cat-clothing', undefined, undefined, 72),
  product('p-ha-2', 'v-haya-abaya',      'عباية فاخرة مطرّزة',  'Embroidered Abaya',    65,    '1495121605193-b116b5b9c5fe', 'cat-clothing', undefined, undefined, 72),

  // Bayt Decor
  product('p-bd-1', 'v-bayt-decor',      'فازة سيراميك يدوية',  'Handmade Ceramic Vase', 25,   '1556909114-f6e7ad7d3136', 'cat-decor', undefined, undefined, 24),
  product('p-bd-2', 'v-bayt-decor',      'شمعة لافندر معطرة',   'Lavender Scented Candle', 12, '1602874801006-2bd1ddc8b9c6', 'cat-decor', undefined, undefined, 24),
  product('p-bd-3', 'v-bayt-decor',      'مرآة أرضية',          'Floor Mirror',          32,   '1554995207-c18c203602cb', 'cat-decor', undefined, undefined, 24),

  // Rose Beauty
  product('p-rb-1', 'v-rose-beauty',     'كريم ترطيب طبيعي',    'Natural Moisturizer',   14,   '1612817288484-6f916006741a', 'cat-beauty', undefined, undefined, 24),
  product('p-rb-2', 'v-rose-beauty',     'مقشّر شفاه',          'Lip Scrub',             6,    '1556228720-da4c1c44e2c2', 'cat-beauty', undefined, undefined, 24),

  // Little Things
  product('p-lt-1', 'v-little-things',   'صندوق مولود ذهبي',    'Newborn Gift Box',      25,   '1605664041952-4a2855d6e8b4', 'cat-kids', undefined, undefined, 48),
  product('p-lt-2', 'v-little-things',   'دمية محبوكة يدوياً',   'Handmade Plush',        15,   '1558877385-be88be4daeb1', 'cat-kids', undefined, undefined, 48),

  // Khat Arabia
  product('p-ka-1', 'v-khat-arabia',     'لوحة فنية حروف عربية', 'Arabic Letters Art',   45,   '1565647952915-15d8c5e2e3df', 'cat-art', undefined, undefined, 72),
  product('p-ka-2', 'v-khat-arabia',     'لوحة بسم الله',        'Bismillah Calligraphy', 65,  '1551806235-aab1ac21c11d', 'cat-art', undefined, undefined, 72),
];

export const reviews: Review[] = vendors.flatMap((v, vi) =>
  [
    { rating: 5, comment: 'خدمة ممتازة وسريعة، شكراً.' },
    { rating: 5, comment: 'أنصح فيهم، احترافيين.' },
    { rating: 4, comment: 'جيد، بس وصلوا متأخرين شوي.' },
    { rating: 5, comment: 'كل شي تمام، رح ارجعلهم.' },
    { rating: 4, comment: 'السعر معقول والشغل نظيف.' },
  ].map((r, i): Review => ({
    id: `rev-${v.id}-${i}`,
    vendorId: v.id,
    customerUid: `c-${vi}-${i}`,
    rating: r.rating,
    comment: r.comment,
    flagged: false,
    createdAt: now - (i + 1) * 7 * DAY,
  })),
);

export const servicesForVendor = (vendorId: string) => services.filter((s) => s.vendorId === vendorId);
export const reviewsForVendor  = (vendorId: string) => reviews.filter((r) => r.vendorId === vendorId);
export const vendorById        = (id: string) => vendors.find((v) => v.id === id);
export const serviceById       = (id: string) => services.find((s) => s.id === id);
export const categoryById      = (id: string) => categories.find((c) => c.id === id);
