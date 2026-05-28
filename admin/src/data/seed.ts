/**
 * Deterministic mock seed for the admin dashboard.
 *
 * Used when FIREBASE_ADMIN_SERVICE_ACCOUNT env is missing.
 * All shapes conform to `shared/types.ts`. Arabic strings target a
 * Saudi/Gulf marketplace context (salons, kitchens, home services, etc.).
 */

import type {
  Vendor,
  Booking,
  Order,
  Review,
  PayoutRequest,
  UserProfile,
  Category,
  Service,
  BookingStatus,
  OrderStatus,
} from '@shared/types';

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
  { nameAr: 'صالون النور للحلاقة', nameEn: 'Al Noor Barbershop', catId: 'cat_beauty', status: 'active', city: 'الرياض', bioAr: 'حلاقة كلاسيكية وتشذيب لحية على يد محترفين' },
  { nameAr: 'مطبخ بيت الجدة', nameEn: 'Grandmas Kitchen', catId: 'cat_food', status: 'active', city: 'جدة', bioAr: 'أطباق منزلية بنكهة الأم — كبسة، مندي، حلويات' },
  { nameAr: 'صيانة المكيفات السريعة', nameEn: 'Fast AC Service', catId: 'cat_home', status: 'active', city: 'الدمام', bioAr: 'صيانة وتنظيف مكيفات سبليت وشباك ومركزية' },
  { nameAr: 'كوافير لمسات', nameEn: 'Lamsat Salon', catId: 'cat_beauty', status: 'active', city: 'الرياض', bioAr: 'صبغة، تسريحات، عناية شعر للسيدات فقط' },
  { nameAr: 'حلويات أم سلطان', nameEn: 'Um Sultan Sweets', catId: 'cat_food', status: 'pending', city: 'مكة', bioAr: 'حلويات شعبية وكيك مناسبات بطلب مسبق' },
  { nameAr: 'سباكة الحرفيين', nameEn: 'Pro Plumbers', catId: 'cat_home', status: 'active', city: 'الرياض', bioAr: 'إصلاح تسرّبات، تركيب خزانات، صيانة سخّانات' },
  { nameAr: 'استوديو هلا للتصوير', nameEn: 'Hala Photo Studio', catId: 'cat_events', status: 'active', city: 'جدة', bioAr: 'تصوير أعراس، خطوبات، حفلات تخرّج' },
  { nameAr: 'نادي إنرجي للياقة', nameEn: 'Energy Fitness Club', catId: 'cat_fitness', status: 'active', city: 'الخبر', bioAr: 'تدريب شخصي ودروس جماعية للرجال والنساء' },
  { nameAr: 'أكاديمية المتفوقين', nameEn: 'Top Scholars Academy', catId: 'cat_education', status: 'active', city: 'الرياض', bioAr: 'دروس خصوصية في الرياضيات والفيزياء واللغة الإنجليزية' },
  { nameAr: 'مغسلة درر السيارات', nameEn: 'Durar Car Wash', catId: 'cat_auto', status: 'active', city: 'الرياض', bioAr: 'غسيل بخار، تلميع، نانو سيراميك' },
  { nameAr: 'بيت الإبرة للتطريز', nameEn: 'Embroidery House', catId: 'cat_handmade', status: 'pending', city: 'المدينة', bioAr: 'تطريز يدوي على القماش والثياب التقليدية' },
  { nameAr: 'باراش بربر شوب', nameEn: 'Paragraph Barbershop', catId: 'cat_beauty', status: 'suspended', city: 'الدمام', bioAr: 'موقوف مؤقتًا بسبب شكاوى جودة الخدمة' },
  { nameAr: 'مطعم زاد البيت', nameEn: 'Zad Albayt', catId: 'cat_food', status: 'active', city: 'الرياض', bioAr: 'وجبات منزلية صحية بنظام الاشتراك الأسبوعي' },
  { nameAr: 'كهربائي 24 ساعة', nameEn: '24h Electrician', catId: 'cat_home', status: 'active', city: 'جدة', bioAr: 'استجابة فورية لأعطال الكهرباء على مدار الساعة' },
  { nameAr: 'محترفو الديكور', nameEn: 'Décor Pros', catId: 'cat_events', status: 'rejected', city: 'الرياض', bioAr: 'مرفوض — مستندات سجل تجاري غير مطابقة' },
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
    location: { lat: 24.7 + i * 0.05, lng: 46.7 + i * 0.05 },
    address: { ar: `${t.city}، حي العليا`, en: `${t.city}, Al Olaya` },
    phone: `+9665${(50000000 + i * 137).toString().padStart(8, '0').slice(0, 8)}`,
    whatsapp: `+9665${(50000000 + i * 137).toString().padStart(8, '0').slice(0, 8)}`,
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
    { ar: 'حلاقة كلاسيك', en: 'Classic Haircut', price: 50, mins: 30 },
    { ar: 'تشذيب لحية', en: 'Beard Trim', price: 35, mins: 20 },
    { ar: 'حلاقة + لحية', en: 'Haircut + Beard', price: 75, mins: 45 },
  ],
  vendor_2: [
    { ar: 'كبسة دجاج عائلية', en: 'Family Chicken Kabsa', price: 180, mins: 90 },
    { ar: 'مندي لحم', en: 'Lamb Mandi', price: 260, mins: 120 },
    { ar: 'كنافة بالقشطة', en: 'Cream Kunafa', price: 95, mins: 45 },
  ],
  vendor_3: [
    { ar: 'تنظيف مكيف سبليت', en: 'Split AC Cleaning', price: 120, mins: 60 },
    { ar: 'تعبئة فريون', en: 'Freon Refill', price: 200, mins: 45 },
  ],
  vendor_4: [
    { ar: 'صبغة + قص', en: 'Color + Cut', price: 350, mins: 120 },
    { ar: 'تسريحة مناسبات', en: 'Event Styling', price: 220, mins: 60 },
  ],
  vendor_7: [
    { ar: 'تصوير عرس كامل', en: 'Full Wedding Coverage', price: 4500, mins: 360 },
    { ar: 'جلسة خطوبة', en: 'Engagement Session', price: 1200, mins: 120 },
  ],
};

export const seedServices: Service[] = seedVendors.flatMap((v): Service[] => {
  const list = servicesByVendor[v.id] ?? [
    { ar: 'خدمة أساسية', en: 'Standard service', price: 150, mins: 60 },
    { ar: 'خدمة بريميوم', en: 'Premium service', price: 280, mins: 90 },
  ];
  return list.map((s, j) => ({
    id: `svc_${v.id}_${j}`,
    vendorId: v.id,
    title: { ar: s.ar, en: s.en },
    description: { ar: s.ar, en: s.en },
    images: [],
    price: s.price,
    currency: 'SAR',
    durationMinutes: s.mins,
    categoryIds: v.categoryIds,
    active: true,
    createdAt: v.createdAt + j * DAY,
  }));
});

// -------------------- Customers --------------------
const customerNames = [
  'أحمد العمري',
  'فاطمة الزهراني',
  'محمد القحطاني',
  'نورة الشمري',
  'خالد الحربي',
  'ريم الدوسري',
  'عبدالله الغامدي',
  'سارة العتيبي',
  'يوسف المالكي',
  'هدى الرشيد',
  'بدر السبيعي',
  'لينا الشهراني',
  'تركي المطيري',
  'منيرة العنزي',
  'فهد البلوي',
  'دانة الجهني',
  'سلمان الفهد',
  'مريم القرشي',
  'ناصر الزهراني',
  'جوهرة العمري',
];

export const seedCustomers: (UserProfile & { bookingsCount: number; ordersCount: number; banned?: boolean })[] =
  customerNames.map((name, i) => ({
    uid: `uid_cust_${i + 1}`,
    role: 'customer' as const,
    phone: `+9665${(70000000 + i * 31).toString().padStart(8, '0').slice(0, 8)}`,
    email: `customer${i + 1}@example.sa`,
    displayName: name,
    photoURL: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
    locale: 'ar' as const,
    createdAt: NOW - (60 - i) * DAY,
    bookingsCount: between(i + 1, 0, 14),
    ordersCount: between(i + 7, 0, 8),
    banned: i === 11, // one banned customer for the UI to show
  }));

// -------------------- Bookings (~40) --------------------
const bookingStatuses: BookingStatus[] = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'completed',
  'completed',
  'cancelled_by_customer',
  'cancelled_by_vendor',
  'no_show',
];

export const seedBookings: Booking[] = Array.from({ length: 42 }, (_, i): Booking => {
  const vendor = pick(seedVendors.filter((v) => v.status === 'active'), i);
  const services = seedServices.filter((s) => s.vendorId === vendor.id);
  const svc = services[i % services.length] ?? seedServices[0]!;
  const customer = pick(seedCustomers, i + 3);
  const offsetDays = (i % 14) - 4; // some past, some today, some future
  const startAt = NOW + offsetDays * DAY + (8 + (i % 10)) * HOUR;
  const status = pick(bookingStatuses, i);
  return {
    id: `bk_${(1000 + i).toString()}`,
    customerUid: customer.uid,
    vendorId: vendor.id,
    serviceId: svc.id,
    startAt,
    endAt: startAt + svc.durationMinutes * 60 * 1000,
    status,
    totalPrice: svc.price,
    currency: 'SAR',
    notes: i % 4 === 0 ? 'يرجى الاتصال قبل الوصول' : undefined,
    createdAt: startAt - 2 * DAY,
  };
});

// -------------------- Orders (~22) --------------------
const orderStatuses: OrderStatus[] = ['pending', 'paid', 'preparing', 'shipped', 'delivered', 'delivered', 'cancelled', 'refunded'];

export const seedOrders: Order[] = Array.from({ length: 22 }, (_, i): Order => {
  const vendor = pick(seedVendors, i + 1);
  const customer = pick(seedCustomers, i + 5);
  const qty = 1 + (i % 4);
  const unit = 60 + (i % 6) * 30;
  const subtotal = qty * unit;
  const tax = Math.round(subtotal * 0.15);
  const shipping = i % 3 === 0 ? 0 : 25;
  return {
    id: `ord_${(2000 + i).toString()}`,
    customerUid: customer.uid,
    vendorId: vendor.id,
    items: [
      {
        productId: `prod_${vendor.id}_1`,
        title: { ar: `منتج من ${vendor.name.ar}`, en: `Product from ${vendor.name.en}` },
        quantity: qty,
        unitPrice: unit,
      },
    ],
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
    currency: 'SAR',
    status: pick(orderStatuses, i),
    shippingAddress: {
      line1: `شارع الملك فهد ${100 + i}`,
      city: 'الرياض',
      country: 'SA',
    },
    createdAt: NOW - i * DAY * 0.5,
  };
});

// -------------------- Reviews (~52) --------------------
const reviewComments = [
  'خدمة ممتازة والتعامل راقي جدًا، أنصح بهم بشدة',
  'الجودة جيدة لكن التأخير قليلاً عن الموعد',
  'الأسعار مناسبة والنتيجة فاقت توقعاتي',
  'لم تكن التجربة كما توقّعت، الخدمة متوسطة',
  'فريق محترف وملتزم بالمواعيد',
  'الطعام لذيذ والتوصيل سريع، شكراً لكم',
  'سعر مرتفع نسبيًا لكن الجودة تستحق',
  'تعامل سيء من الموظف، لن أعود مرة أخرى',
  'مكان نظيف وأجواء رائعة',
];

export const seedReviews: Review[] = Array.from({ length: 52 }, (_, i): Review => {
  const vendor = pick(seedVendors, i);
  const customer = pick(seedCustomers, i + 2);
  const rating = ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5;
  const flagged = i % 7 === 0; // ~7 flagged
  return {
    id: `rev_${(3000 + i).toString()}`,
    vendorId: vendor.id,
    customerUid: customer.uid,
    rating,
    comment: pick(reviewComments, i),
    flagged,
    vendorReply: i % 5 === 0 ? 'شكرًا لتعليقك، نسعد بخدمتكم دائمًا' : undefined,
    createdAt: NOW - i * DAY * 0.7,
  };
});

// -------------------- Payouts (~12) --------------------
export const seedPayouts: (PayoutRequest & { vendorBalance: number; lastPayoutAt?: number })[] = Array.from(
  { length: 12 },
  (_, i) => {
    const vendor = pick(
      seedVendors.filter((v) => v.status === 'active'),
      i,
    );
    const amount = 800 + i * 350;
    const status = pick(
      ['pending', 'pending', 'pending', 'approved', 'paid', 'rejected'] as PayoutRequest['status'][],
      i,
    );
    return {
      id: `po_${(4000 + i).toString()}`,
      vendorId: vendor.id,
      amount,
      currency: 'SAR',
      status,
      requestedAt: NOW - i * DAY,
      resolvedAt: status === 'paid' || status === 'approved' || status === 'rejected' ? NOW - i * DAY + 6 * HOUR : undefined,
      vendorBalance: amount + 1200 + i * 80,
      lastPayoutAt: i % 3 === 0 ? undefined : NOW - (30 + i * 2) * DAY,
    };
  },
);

// -------------------- Lookups --------------------
export const vendorById = (id: string) => seedVendors.find((v) => v.id === id);
export const customerByUid = (uid: string) => seedCustomers.find((c) => c.uid === uid);
export const serviceById = (id: string) => seedServices.find((s) => s.id === id);
export const categoryById = (id: string) => seedCategories.find((c) => c.id === id);

// -------------------- Aggregates for overview --------------------
export const overviewMetrics = () => {
  const activeVendors = seedVendors.filter((v) => v.status === 'active').length;
  const todayStart = NOW - 8 * HOUR; // start of current day window
  const bookingsToday = seedBookings.filter(
    (b) => b.startAt >= todayStart && b.startAt < todayStart + DAY,
  ).length;
  const gmvMonth = seedOrders
    .filter((o) => o.status === 'paid' || o.status === 'delivered' || o.status === 'shipped')
    .reduce((sum, o) => sum + o.total, 0) +
    seedBookings.filter((b) => b.status === 'completed').reduce((sum, b) => sum + b.totalPrice, 0);
  const newUsers = seedCustomers.filter((c) => c.createdAt > NOW - 7 * DAY).length;
  const pendingPayouts = seedPayouts.filter((p) => p.status === 'pending').length;
  const openDisputes = 3;

  // 30-day signup series
  const signups = Array.from({ length: 30 }, (_, i) => {
    const day = NOW - (29 - i) * DAY;
    const value = Math.round(2 + Math.sin(i / 3) * 2 + (i / 4) + (i % 5));
    return { day, label: new Date(day).toISOString().slice(5, 10), value: Math.max(0, value) };
  });

  // Vendors by category for donut
  const byCategory = seedCategories
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      value: seedVendors.filter((v) => v.categoryIds.includes(cat.id)).length,
    }))
    .filter((b) => b.value > 0);

  // Sparkline series for hero GMV (last 7 days)
  const gmvSpark = Array.from({ length: 7 }, (_, i) => ({
    day: i,
    value: Math.round(4000 + Math.sin(i / 1.6) * 1500 + i * 600 + (i % 2 === 0 ? 800 : 0)),
  }));

  return {
    activeVendors,
    bookingsToday,
    gmvMonth,
    gmvSpark,
    newUsers,
    pendingPayouts,
    openDisputes,
    signups,
    byCategory,
  };
};
