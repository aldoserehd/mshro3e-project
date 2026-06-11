/**
 * Deterministic mock seed for the admin dashboard.
 *
 * Used when FIREBASE_ADMIN_SERVICE_ACCOUNT env is missing.
 * All shapes conform to `shared/types.ts`. Arabic strings target a
 * Saudi/Gulf marketplace context (salons, kitchens, home services, etc.).
 */

import type { Vendor, Category, Service } from '@shared/types';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const NOW = Date.UTC(2026, 4, 28, 9, 0, 0); // 2026-05-28 09:00 UTC — deterministic anchor

const pick = <T,>(arr: T[], i: number): T => arr[i % arr.length]!;
const between = (seed: number, min: number, max: number) =>
  min + Math.floor(((Math.sin(seed * 9301 + 49297) + 1) / 2) * (max - min + 1));

// -------------------- Categories --------------------
export const seedCategories: Category[] = [
  { id: 'cat_beauty', name: { ar: 'الجمال والعناية', en: 'Beauty & Care' }, icon: 'sparkles', slug: 'beauty', order: 1 },
  { id: 'cat_food', name: { ar: 'الأطعمة المنزلية', en: 'Home Kitchens' }, icon: 'utensils', slug: 'food', order: 2 },
  { id: 'cat_home', name: { ar: 'خدمات منزلية', en: 'Home Services' }, icon: 'wrench', slug: 'home', order: 3 },
  { id: 'cat_events', name: { ar: 'مناسبات وحفلات', en: 'Events' }, icon: 'cake', slug: 'events', order: 4 },
  { id: 'cat_fitness', name: { ar: 'لياقة وصحة', en: 'Fitness' }, icon: 'dumbbell', slug: 'fitness', order: 5 },
  { id: 'cat_education', name: { ar: 'تعليم ودروس', en: 'Education' }, icon: 'book-open', slug: 'education', order: 6 },
  { id: 'cat_auto', name: { ar: 'سيارات', en: 'Automotive' }, icon: 'car', slug: 'auto', order: 7 },
  { id: 'cat_handmade', name: { ar: 'مشغولات يدوية', en: 'Handmade' }, icon: 'palette', slug: 'handmade', order: 8 },
];

// -------------------- Vendors --------------------
const vendorTemplates: {
  nameAr: string;
  nameEn: string;
  catId: string;
  status: Vendor['status'];
  city: string;
  bioAr: string;
}[] = [
  { nameAr: 'صالون السالمية للحلاقة', nameEn: 'Salmiya Barbershop', catId: 'cat_beauty', status: 'active', city: 'السالمية', bioAr: 'حلاقة كلاسيكية وتشذيب لحية على يد محترفين' },
  { nameAr: 'مطعم بيت الكويت', nameEn: 'Bayt Al Kuwait', catId: 'cat_food', status: 'active', city: 'الكويت العاصمة', bioAr: 'أطباق كويتية أصيلة — مجبوس، مرقوق، جريش' },
  { nameAr: 'صيانة المكيفات السريعة', nameEn: 'Fast AC Service', catId: 'cat_home', status: 'active', city: 'الفروانية', bioAr: 'صيانة وتنظيف مكيفات سبليت وشباك ومركزية' },
  { nameAr: 'كوافير لمسة الذهب', nameEn: 'Lamsat Al Dahab', catId: 'cat_beauty', status: 'active', city: 'حولي', bioAr: 'صبغة، تسريحات، عناية شعر للسيدات فقط' },
  { nameAr: 'حلويات أم خالد', nameEn: 'Um Khaled Sweets', catId: 'cat_food', status: 'pending', city: 'الجابرية', bioAr: 'حلويات شعبية وكيك مناسبات بطلب مسبق' },
  { nameAr: 'سباكة الكويت السريعة', nameEn: 'Kuwait Fast Plumbers', catId: 'cat_home', status: 'active', city: 'الفروانية', bioAr: 'إصلاح تسرّبات، تركيب خزانات، صيانة سخّانات' },
  { nameAr: 'استوديو الديوانية للتصوير', nameEn: 'Diwaniya Photo Studio', catId: 'cat_events', status: 'active', city: 'مشرف', bioAr: 'تصوير أعراس، خطوبات، حفلات تخرّج' },
  { nameAr: 'نادي الخليج للياقة', nameEn: 'Gulf Fitness Club', catId: 'cat_fitness', status: 'active', city: 'السالمية', bioAr: 'تدريب شخصي ودروس جماعية للرجال والنساء' },
  { nameAr: 'أكاديمية النجاح للتدريس', nameEn: 'Najah Tutoring Academy', catId: 'cat_education', status: 'active', city: 'الجابرية', bioAr: 'دروس خصوصية في الرياضيات والفيزياء واللغة الإنجليزية' },
  { nameAr: 'مغسلة الراية للسيارات', nameEn: 'Al Raya Car Wash', catId: 'cat_auto', status: 'active', city: 'الفنطاس', bioAr: 'غسيل بخار، تلميع، نانو سيراميك' },
  { nameAr: 'بيت التطريز الكويتي', nameEn: 'Kuwaiti Embroidery House', catId: 'cat_handmade', status: 'pending', city: 'العديلية', bioAr: 'تطريز يدوي على القماش والدراعات التقليدية' },
  { nameAr: 'مطعم الديوانية', nameEn: 'Diwaniya Restaurant', catId: 'cat_food', status: 'suspended', city: 'مشرف', bioAr: 'موقوف مؤقتًا بسبب شكاوى جودة الخدمة' },
  { nameAr: 'مطبخ شيف فيصل', nameEn: 'Chef Faisal Kitchen', catId: 'cat_food', status: 'active', city: 'الجابرية', bioAr: 'وجبات منزلية صحية بنظام الاشتراك الأسبوعي' },
  { nameAr: 'كهربائي الكويت ٢٤', nameEn: 'Kuwait 24h Electrician', catId: 'cat_home', status: 'active', city: 'حولي', bioAr: 'استجابة فورية لأعطال الكهرباء على مدار الساعة' },
  { nameAr: 'ديكور الخليج', nameEn: 'Gulf Décor', catId: 'cat_events', status: 'rejected', city: 'السالمية', bioAr: 'مرفوض — مستندات الترخيص التجاري غير مطابقة' },
];

const isoCover = (i: number) =>
  `https://images.unsplash.com/photo-${1500000000000 + i * 11}?w=1200&h=675&fit=crop`;

export const seedVendors: Vendor[] = vendorTemplates.map((t, i): Vendor => {
  const createdAt = NOW - (15 - i) * 7 * DAY;
  const rating = 3.4 + (i * 0.13) % 1.6;
  return {
    id: `vendor_${i + 1}`,
    ownerUid: `uid_vendor_${i + 1}`,
    name: { ar: t.nameAr, en: t.nameEn },
    slug: `${t.nameEn.toLowerCase().replace(/[^a-z]+/g, '-')}-${i + 1}`,
    bio: { ar: t.bioAr, en: t.bioAr },
    coverImage: isoCover(i),
    logoImage: `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(t.nameEn)}`,
    categoryIds: [t.catId],
    location: { lat: 29.3 + (i % 5) * 0.05, lng: 47.95 + (i % 5) * 0.04 },
    address: { ar: `${t.city}، قطعة ${(i % 9) + 1}`, en: `${t.city}, Block ${(i % 9) + 1}` },
    phone: `+9655${(0 + i * 137 + 1000000).toString().padStart(7, '0').slice(0, 7)}`,
    whatsapp: `+9655${(0 + i * 137 + 1000000).toString().padStart(7, '0').slice(0, 7)}`,
    workingHours: {},
    rating: Math.round(rating * 10) / 10,
    reviewCount: between(i + 1, 12, 240),
    status: t.status,
    verifiedAt: t.status === 'active' ? createdAt + 2 * DAY : undefined,
    createdAt,
    updatedAt: NOW - i * HOUR,
  };
});

// -------------------- Services per vendor --------------------
const servicesByVendor: Record<string, { ar: string; en: string; price: number; mins: number }[]> = {
  vendor_1: [
    { ar: 'حلاقة كلاسيك',  en: 'Classic Haircut',   price: 5, mins: 30 },
    { ar: 'تشذيب لحية',   en: 'Beard Trim',        price: 4, mins: 20 },
    { ar: 'حلاقة + لحية', en: 'Haircut + Beard',   price: 8, mins: 45 },
  ],
  vendor_2: [
    { ar: 'مجبوس دجاج عائلي', en: 'Family Chicken Machboos', price: 18, mins: 90 },
    { ar: 'مجبوس لحم',         en: 'Lamb Machboos',           price: 25, mins: 120 },
    { ar: 'كنافة بالقشطة',     en: 'Cream Kunafa',            price: 9,  mins: 45 },
  ],
  vendor_3: [
    { ar: 'تنظيف مكيف سبليت', en: 'Split AC Cleaning', price: 12, mins: 60 },
    { ar: 'تعبئة فريون',       en: 'Freon Refill',      price: 20, mins: 45 },
  ],
  vendor_4: [
    { ar: 'صبغة + قص',        en: 'Color + Cut',       price: 35, mins: 120 },
    { ar: 'تسريحة مناسبات',   en: 'Event Styling',     price: 22, mins: 60 },
  ],
  vendor_7: [
    { ar: 'تصوير عرس كامل',   en: 'Full Wedding Coverage', price: 450, mins: 360 },
    { ar: 'جلسة خطوبة',        en: 'Engagement Session',    price: 120, mins: 120 },
  ],
};

export const seedServices: Service[] = seedVendors.flatMap((v): Service[] => {
  const list = servicesByVendor[v.id] ?? [
    { ar: 'خدمة أساسية', en: 'Standard service', price: 15, mins: 60 },
    { ar: 'خدمة بريميوم', en: 'Premium service', price: 28, mins: 90 },
  ];
  return list.map((s, j) => ({
    id: `svc_${v.id}_${j}`,
    vendorId: v.id,
    title: { ar: s.ar, en: s.en },
    description: { ar: s.ar, en: s.en },
    images: [],
    price: s.price,
    currency: 'KWD',
    durationMinutes: s.mins,
    categoryIds: v.categoryIds,
    active: true,
    createdAt: v.createdAt + j * DAY,
  }));
});

// -------------------- Lookups --------------------
export const vendorById = (id: string) => seedVendors.find((v) => v.id === id);
export const serviceById = (id: string) => seedServices.find((s) => s.id === id);
export const categoryById = (id: string) => seedCategories.find((c) => c.id === id);
