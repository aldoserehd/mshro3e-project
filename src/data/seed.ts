/**
 * First-cut mock data. Same shape as Firestore docs will return later.
 * Components consume via src/data/hooks.ts so swapping is zero-touch.
 */
import type {
  Category,
  Vendor,
  Service,
  Review,
  Booking,
} from '@shared/types';

const now = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const logoFor = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A1020&color=fff&size=200&bold=true`;

// Unsplash CDN — generic, reliably-loading photos. ixlib query keeps caches stable.
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories: Category[] = [
  {
    id: 'cat-salons',
    name: { ar: 'صالونات', en: 'Salons' },
    icon: 'cut-outline',
    slug: 'salons',
    order: 1,
  },
  {
    id: 'cat-hospitality',
    name: { ar: 'ضيافة', en: 'Hospitality' },
    icon: 'restaurant-outline',
    slug: 'hospitality',
    order: 2,
  },
  {
    id: 'cat-cleaning',
    name: { ar: 'تنظيف', en: 'Cleaning' },
    icon: 'sparkles-outline',
    slug: 'cleaning',
    order: 3,
  },
  {
    id: 'cat-maintenance',
    name: { ar: 'صيانة', en: 'Maintenance' },
    icon: 'construct-outline',
    slug: 'maintenance',
    order: 4,
  },
  {
    id: 'cat-tutoring',
    name: { ar: 'تعليم', en: 'Tutoring' },
    icon: 'school-outline',
    slug: 'tutoring',
    order: 5,
  },
];

const standardHours = {
  0: [{ open: '10:00', close: '22:00' }],
  1: [{ open: '10:00', close: '22:00' }],
  2: [{ open: '10:00', close: '22:00' }],
  3: [{ open: '10:00', close: '22:00' }],
  4: [{ open: '10:00', close: '22:00' }],
  5: [{ open: '14:00', close: '23:00' }],
  6: [{ open: '10:00', close: '22:00' }],
};

export const vendors: Vendor[] = [
  {
    id: 'v-noor-salon',
    ownerUid: 'u-1',
    name: { ar: 'صالون النور للحلاقة', en: 'Al Noor Salon' },
    slug: 'al-noor-salon',
    bio: {
      ar: 'صالون رجالي بخبرة ١٢ عاماً في الرياض. قصات عصرية، حلاقة دقيقة، وأجواء راقية.',
      en: '12 years of barbering excellence in Riyadh. Modern cuts, precise shaves, refined atmosphere.',
    },
    coverImage: u('1521590832167-7bcbfaa6381f'),
    logoImage: logoFor('Al Noor'),
    categoryIds: ['cat-salons'],
    location: { lat: 24.7136, lng: 46.6753 },
    address: { ar: 'الرياض، حي العليا', en: 'Riyadh, Al Olaya' },
    phone: '+966500000001',
    whatsapp: '+966500000001',
    workingHours: standardHours,
    rating: 4.8,
    reviewCount: 312,
    status: 'active',
    verifiedAt: now - 60 * DAY,
    createdAt: now - 400 * DAY,
    updatedAt: now - 2 * HOUR,
  },
  {
    id: 'v-grandma-kitchen',
    ownerUid: 'u-2',
    name: { ar: 'مطبخ بيت الجدة', en: 'Grandma\'s Kitchen' },
    slug: 'grandma-kitchen',
    bio: {
      ar: 'طبخ منزلي أصيل. كبسة، مندي، ومأكولات شامية بنكهة الجدّات.',
      en: 'Authentic home cooking. Kabsa, mandi, Levantine dishes — the way grandma made them.',
    },
    coverImage: u('1555939594-58d7cb561ad1'),
    logoImage: logoFor('Grandma Kitchen'),
    categoryIds: ['cat-hospitality'],
    location: { lat: 24.7236, lng: 46.6853 },
    address: { ar: 'جدة، حي الزهراء', en: 'Jeddah, Al Zahra' },
    phone: '+966500000002',
    workingHours: standardHours,
    rating: 4.9,
    reviewCount: 528,
    status: 'active',
    verifiedAt: now - 90 * DAY,
    createdAt: now - 500 * DAY,
    updatedAt: now - 18 * MIN,
  },
  {
    id: 'v-safa-laundry',
    ownerUid: 'u-3',
    name: { ar: 'مغسلة الصفا', en: 'Al Safa Laundry' },
    slug: 'safa-laundry',
    bio: {
      ar: 'غسيل وكوي بنفس اليوم. خدمة استلام وتوصيل مجانية داخل المدينة.',
      en: 'Same-day wash & press. Free pickup & delivery within the city.',
    },
    coverImage: u('1582719478250-c89cae4dc85b'),
    logoImage: logoFor('Al Safa'),
    categoryIds: ['cat-cleaning'],
    location: { lat: 24.7036, lng: 46.6953 },
    address: { ar: 'الرياض، حي الملز', en: 'Riyadh, Al Malaz' },
    phone: '+966500000003',
    workingHours: standardHours,
    rating: 4.6,
    reviewCount: 184,
    status: 'active',
    verifiedAt: now - 40 * DAY,
    createdAt: now - 300 * DAY,
    updatedAt: now - 45 * MIN,
  },
  {
    id: 'v-ac-fast',
    ownerUid: 'u-4',
    name: { ar: 'صيانة المكيفات السريعة', en: 'Fast AC Service' },
    slug: 'fast-ac',
    bio: {
      ar: 'فنّيون معتمدون لصيانة وتنظيف وتركيب جميع أنواع المكيفات. حضور خلال ساعة.',
      en: 'Certified technicians for AC service, cleaning, and installation. Arrives within 1 hour.',
    },
    coverImage: u('1581094794329-c8112a89af12'),
    logoImage: logoFor('Fast AC'),
    categoryIds: ['cat-maintenance'],
    location: { lat: 24.7336, lng: 46.6653 },
    address: { ar: 'الرياض، حي السليمانية', en: 'Riyadh, As Sulaimaniyah' },
    phone: '+966500000004',
    workingHours: standardHours,
    rating: 4.5,
    reviewCount: 96,
    status: 'active',
    verifiedAt: now - 30 * DAY,
    createdAt: now - 250 * DAY,
    updatedAt: now - 5 * MIN,
  },
  {
    id: 'v-rose-beauty',
    ownerUid: 'u-5',
    name: { ar: 'مركز الورد للتجميل', en: 'Rose Beauty Center' },
    slug: 'rose-beauty',
    bio: {
      ar: 'مركز تجميل نسائي راقي. عناية بالبشرة، مكياج مناسبات، وعناية بالشعر.',
      en: 'Upscale women\'s beauty center. Skincare, occasion makeup, and hair care.',
    },
    coverImage: u('1560066984-138dadb4c035'),
    logoImage: logoFor('Rose Beauty'),
    categoryIds: ['cat-salons'],
    location: { lat: 24.6936, lng: 46.7053 },
    address: { ar: 'الرياض، حي النخيل', en: 'Riyadh, Al Nakheel' },
    phone: '+966500000005',
    workingHours: standardHours,
    rating: 4.9,
    reviewCount: 412,
    status: 'active',
    verifiedAt: now - 120 * DAY,
    createdAt: now - 600 * DAY,
    updatedAt: now - 30 * MIN,
  },
  {
    id: 'v-academy-math',
    ownerUid: 'u-6',
    name: { ar: 'أكاديمية الرياضيات', en: 'Math Academy' },
    slug: 'math-academy',
    bio: {
      ar: 'دروس خصوصية للمرحلتين المتوسطة والثانوية. معلّمون معتمدون.',
      en: 'Private tutoring for middle and high school. Certified instructors.',
    },
    coverImage: u('1503676260728-1c00da094a0b'),
    logoImage: logoFor('Math Academy'),
    categoryIds: ['cat-tutoring'],
    location: { lat: 24.7436, lng: 46.6553 },
    address: { ar: 'الرياض، حي العليا', en: 'Riyadh, Al Olaya' },
    phone: '+966500000006',
    workingHours: standardHours,
    rating: 4.7,
    reviewCount: 142,
    status: 'active',
    verifiedAt: now - 75 * DAY,
    createdAt: now - 350 * DAY,
    updatedAt: now - 3 * HOUR,
  },
  {
    id: 'v-villa-clean',
    ownerUid: 'u-7',
    name: { ar: 'الفلّ النظيفة', en: 'Clean Villa' },
    slug: 'clean-villa',
    bio: {
      ar: 'تنظيف شامل للفلل والمنازل. فريق نسائي وفريق رجالي.',
      en: 'Deep cleaning for villas and homes. Female and male crews available.',
    },
    coverImage: u('1581578731548-c64695cc6952'),
    logoImage: logoFor('Clean Villa'),
    categoryIds: ['cat-cleaning'],
    location: { lat: 24.6836, lng: 46.7153 },
    address: { ar: 'الرياض، حي الياسمين', en: 'Riyadh, Al Yasmin' },
    phone: '+966500000007',
    workingHours: standardHours,
    rating: 4.4,
    reviewCount: 78,
    status: 'active',
    verifiedAt: now - 20 * DAY,
    createdAt: now - 180 * DAY,
    updatedAt: now - 70 * MIN,
  },
  {
    id: 'v-spice-grill',
    ownerUid: 'u-8',
    name: { ar: 'مشاوي البهارات', en: 'Spice Grill' },
    slug: 'spice-grill',
    bio: {
      ar: 'مشاوي على الفحم وتوصيل سريع. كبدة، كبدة دجاج، وشيش طاووق.',
      en: 'Charcoal grills with fast delivery. Liver, chicken liver, and shish tawook.',
    },
    coverImage: u('1555939594-58d7cb561ad1', 800),
    logoImage: logoFor('Spice Grill'),
    categoryIds: ['cat-hospitality'],
    location: { lat: 24.7536, lng: 46.6453 },
    address: { ar: 'الرياض، حي الورود', en: 'Riyadh, Al Wuroud' },
    phone: '+966500000008',
    workingHours: standardHours,
    rating: 4.6,
    reviewCount: 234,
    status: 'active',
    verifiedAt: now - 50 * DAY,
    createdAt: now - 280 * DAY,
    updatedAt: now - 8 * MIN,
  },
];

// 30 services across vendors
const sImg = [
  u('1562322140-8baeececf3df'),
  u('1599351431202-1e0f0137899a'),
  u('1503951914875-452162b0f3f1'),
  u('1521590832167-7bcbfaa6381f'),
];

export const services: Service[] = [
  // Salon — Al Noor (4)
  { id: 's-1', vendorId: 'v-noor-salon', title: { ar: 'قصّة شعر كلاسيكية', en: 'Classic haircut' }, description: { ar: 'قصّة شعر بقصّاصات احترافية، تشمل الغسيل والتجفيف.', en: 'Pro haircut, includes wash & blow dry.' }, images: [sImg[3]], price: 70, currency: 'SAR', durationMinutes: 45, categoryIds: ['cat-salons'], active: true, createdAt: now - 100 * DAY },
  { id: 's-2', vendorId: 'v-noor-salon', title: { ar: 'حلاقة لحية ديلوكس', en: 'Deluxe beard shave' }, description: { ar: 'حلاقة لحية بمنشفة ساخنة وزيوت مرطّبة.', en: 'Hot towel beard shave with conditioning oils.' }, images: [sImg[3]], price: 90, currency: 'SAR', durationMinutes: 40, categoryIds: ['cat-salons'], active: true, createdAt: now - 90 * DAY },
  { id: 's-3', vendorId: 'v-noor-salon', title: { ar: 'صبغة شعر', en: 'Hair coloring' }, description: { ar: 'صبغة احترافية بألوان متعددة.', en: 'Pro coloring, multiple shades.' }, images: [sImg[0]], price: 220, currency: 'SAR', durationMinutes: 90, categoryIds: ['cat-salons'], active: true, createdAt: now - 80 * DAY },
  { id: 's-4', vendorId: 'v-noor-salon', title: { ar: 'باقة العريس', en: 'Groom package' }, description: { ar: 'قصّ، حلاقة، وغسيل وجه. للعرسان.', en: 'Cut, shave, and facial. For grooms.' }, images: [sImg[0]], price: 350, currency: 'SAR', durationMinutes: 120, categoryIds: ['cat-salons'], active: true, createdAt: now - 70 * DAY },

  // Grandma Kitchen (4)
  { id: 's-5', vendorId: 'v-grandma-kitchen', title: { ar: 'كبسة لحم لـ ٤ أشخاص', en: 'Lamb kabsa for 4' }, description: { ar: 'كبسة لحم كاملة مع الأرز والسلطة.', en: 'Full lamb kabsa with rice and salad.' }, images: [u('1555939594-58d7cb561ad1')], price: 280, currency: 'SAR', durationMinutes: 60, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 60 * DAY },
  { id: 's-6', vendorId: 'v-grandma-kitchen', title: { ar: 'مندي دجاج', en: 'Chicken mandi' }, description: { ar: 'مندي دجاج بطعم الحطب.', en: 'Smoky wood-fired chicken mandi.' }, images: [u('1555939594-58d7cb561ad1')], price: 65, currency: 'SAR', durationMinutes: 45, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 55 * DAY },
  { id: 's-7', vendorId: 'v-grandma-kitchen', title: { ar: 'مقلوبة باذنجان', en: 'Eggplant maqlouba' }, description: { ar: 'مقلوبة شامية أصيلة.', en: 'Authentic Levantine maqlouba.' }, images: [u('1555939594-58d7cb561ad1')], price: 120, currency: 'SAR', durationMinutes: 75, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 50 * DAY },
  { id: 's-8', vendorId: 'v-grandma-kitchen', title: { ar: 'صينية كنافة', en: 'Knafeh tray' }, description: { ar: 'كنافة طازجة بالجبن.', en: 'Fresh cheese knafeh.' }, images: [u('1555939594-58d7cb561ad1')], price: 85, currency: 'SAR', durationMinutes: 30, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 45 * DAY },

  // Al Safa Laundry (3)
  { id: 's-9', vendorId: 'v-safa-laundry', title: { ar: 'غسيل ٥ ثياب', en: '5-piece wash & press' }, description: { ar: 'غسيل وكوي ٥ قطع.', en: 'Wash & press 5 garments.' }, images: [u('1582719478250-c89cae4dc85b')], price: 35, currency: 'SAR', durationMinutes: 1440, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 40 * DAY },
  { id: 's-10', vendorId: 'v-safa-laundry', title: { ar: 'غسيل ثوب رسمي', en: 'Formal thobe wash' }, description: { ar: 'غسيل وكوي ثوب رسمي بالنشا.', en: 'Wash & starch a formal thobe.' }, images: [u('1582719478250-c89cae4dc85b')], price: 18, currency: 'SAR', durationMinutes: 720, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 35 * DAY },
  { id: 's-11', vendorId: 'v-safa-laundry', title: { ar: 'تنظيف بطانية كبيرة', en: 'King blanket clean' }, description: { ar: 'تنظيف بطانية كبيرة بالبخار.', en: 'Steam-clean a king blanket.' }, images: [u('1582719478250-c89cae4dc85b')], price: 60, currency: 'SAR', durationMinutes: 1440, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 30 * DAY },

  // Fast AC (4)
  { id: 's-12', vendorId: 'v-ac-fast', title: { ar: 'تنظيف مكيف سبليت', en: 'Split AC cleaning' }, description: { ar: 'تنظيف مكيف سبليت كامل بالبخار.', en: 'Full split AC steam clean.' }, images: [u('1581094794329-c8112a89af12')], price: 120, currency: 'SAR', durationMinutes: 60, categoryIds: ['cat-maintenance'], active: true, createdAt: now - 25 * DAY },
  { id: 's-13', vendorId: 'v-ac-fast', title: { ar: 'تركيب مكيف', en: 'AC installation' }, description: { ar: 'تركيب مكيف جديد مع الكهرباء.', en: 'New AC install with wiring.' }, images: [u('1581094794329-c8112a89af12')], price: 350, currency: 'SAR', durationMinutes: 120, categoryIds: ['cat-maintenance'], active: true, createdAt: now - 20 * DAY },
  { id: 's-14', vendorId: 'v-ac-fast', title: { ar: 'كشف عطل', en: 'Diagnostic visit' }, description: { ar: 'كشف عطل وتقدير تكلفة الإصلاح.', en: 'Issue diagnosis & repair estimate.' }, images: [u('1581094794329-c8112a89af12')], price: 80, currency: 'SAR', durationMinutes: 45, categoryIds: ['cat-maintenance'], active: true, createdAt: now - 15 * DAY },
  { id: 's-15', vendorId: 'v-ac-fast', title: { ar: 'تعبئة فريون', en: 'Refrigerant refill' }, description: { ar: 'تعبئة فريون لجميع الأنواع.', en: 'Refrigerant refill for all types.' }, images: [u('1581094794329-c8112a89af12')], price: 150, currency: 'SAR', durationMinutes: 30, categoryIds: ['cat-maintenance'], active: true, createdAt: now - 12 * DAY },

  // Rose Beauty (4)
  { id: 's-16', vendorId: 'v-rose-beauty', title: { ar: 'جلسة عناية بالبشرة', en: 'Facial treatment' }, description: { ar: 'تنظيف عميق وترطيب البشرة.', en: 'Deep cleansing + hydration.' }, images: [u('1560066984-138dadb4c035')], price: 280, currency: 'SAR', durationMinutes: 75, categoryIds: ['cat-salons'], active: true, createdAt: now - 100 * DAY },
  { id: 's-17', vendorId: 'v-rose-beauty', title: { ar: 'مكياج مناسبات', en: 'Occasion makeup' }, description: { ar: 'مكياج كامل للمناسبات.', en: 'Full glam for special occasions.' }, images: [u('1560066984-138dadb4c035')], price: 450, currency: 'SAR', durationMinutes: 90, categoryIds: ['cat-salons'], active: true, createdAt: now - 90 * DAY },
  { id: 's-18', vendorId: 'v-rose-beauty', title: { ar: 'صبغة وكيراتين', en: 'Color + keratin' }, description: { ar: 'صبغة شعر مع علاج كيراتين.', en: 'Hair color + keratin treatment.' }, images: [u('1560066984-138dadb4c035')], price: 680, currency: 'SAR', durationMinutes: 180, categoryIds: ['cat-salons'], active: true, createdAt: now - 80 * DAY },
  { id: 's-19', vendorId: 'v-rose-beauty', title: { ar: 'مانيكير وباديكير', en: 'Mani + pedi' }, description: { ar: 'عناية كاملة بالأظافر.', en: 'Full nail care.' }, images: [u('1560066984-138dadb4c035')], price: 180, currency: 'SAR', durationMinutes: 60, categoryIds: ['cat-salons'], active: true, createdAt: now - 70 * DAY },

  // Math Academy (4)
  { id: 's-20', vendorId: 'v-academy-math', title: { ar: 'حصة رياضيات (متوسط)', en: 'Math lesson — middle' }, description: { ar: 'حصة خصوصية للمرحلة المتوسطة.', en: 'Private lesson, middle school.' }, images: [u('1503676260728-1c00da094a0b')], price: 120, currency: 'SAR', durationMinutes: 60, categoryIds: ['cat-tutoring'], active: true, createdAt: now - 60 * DAY },
  { id: 's-21', vendorId: 'v-academy-math', title: { ar: 'حصة رياضيات (ثانوي)', en: 'Math lesson — high' }, description: { ar: 'حصة خصوصية للمرحلة الثانوية.', en: 'Private lesson, high school.' }, images: [u('1503676260728-1c00da094a0b')], price: 160, currency: 'SAR', durationMinutes: 60, categoryIds: ['cat-tutoring'], active: true, createdAt: now - 55 * DAY },
  { id: 's-22', vendorId: 'v-academy-math', title: { ar: 'دورة قدرات', en: 'Qiyas prep course' }, description: { ar: 'دورة شاملة لاختبار القدرات.', en: 'Comprehensive Qiyas prep.' }, images: [u('1503676260728-1c00da094a0b')], price: 950, currency: 'SAR', durationMinutes: 1200, categoryIds: ['cat-tutoring'], active: true, createdAt: now - 45 * DAY },
  { id: 's-23', vendorId: 'v-academy-math', title: { ar: 'دروس فيزياء', en: 'Physics lessons' }, description: { ar: 'حصص فيزياء للمرحلة الثانوية.', en: 'Physics lessons, high school.' }, images: [u('1503676260728-1c00da094a0b')], price: 150, currency: 'SAR', durationMinutes: 60, categoryIds: ['cat-tutoring'], active: true, createdAt: now - 40 * DAY },

  // Clean Villa (3)
  { id: 's-24', vendorId: 'v-villa-clean', title: { ar: 'تنظيف فيلا كاملة', en: 'Full villa cleaning' }, description: { ar: 'تنظيف شامل بفريق ٤ أشخاص.', en: 'Deep clean by 4-person crew.' }, images: [u('1581578731548-c64695cc6952')], price: 650, currency: 'SAR', durationMinutes: 240, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 35 * DAY },
  { id: 's-25', vendorId: 'v-villa-clean', title: { ar: 'تنظيف شقة', en: 'Apartment cleaning' }, description: { ar: 'تنظيف شامل لشقة.', en: 'Apartment deep clean.' }, images: [u('1581578731548-c64695cc6952')], price: 220, currency: 'SAR', durationMinutes: 120, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 30 * DAY },
  { id: 's-26', vendorId: 'v-villa-clean', title: { ar: 'تنظيف بعد البناء', en: 'Post-construction clean' }, description: { ar: 'تنظيف بعد أعمال البناء.', en: 'Post-construction clean-up.' }, images: [u('1581578731548-c64695cc6952')], price: 880, currency: 'SAR', durationMinutes: 360, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 25 * DAY },

  // Spice Grill (4)
  { id: 's-27', vendorId: 'v-spice-grill', title: { ar: 'شيش طاووق', en: 'Shish tawook' }, description: { ar: 'سيخ شيش طاووق بالخبز.', en: 'Shish tawook skewer with bread.' }, images: [u('1555939594-58d7cb561ad1')], price: 28, currency: 'SAR', durationMinutes: 30, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 20 * DAY },
  { id: 's-28', vendorId: 'v-spice-grill', title: { ar: 'كبدة دجاج مشوية', en: 'Grilled chicken liver' }, description: { ar: 'كبدة دجاج على الفحم.', en: 'Charcoal-grilled chicken liver.' }, images: [u('1555939594-58d7cb561ad1')], price: 32, currency: 'SAR', durationMinutes: 25, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 18 * DAY },
  { id: 's-29', vendorId: 'v-spice-grill', title: { ar: 'مشاوي عائلية', en: 'Family grill platter' }, description: { ar: 'تشكيلة مشاوي لـ ٤ أشخاص.', en: 'Mixed grill platter for 4.' }, images: [u('1555939594-58d7cb561ad1')], price: 165, currency: 'SAR', durationMinutes: 45, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 15 * DAY },
  { id: 's-30', vendorId: 'v-spice-grill', title: { ar: 'وجبة سندوتشات', en: 'Sandwich combo' }, description: { ar: 'سندوتش شاورما مع مشروب.', en: 'Shawarma sandwich with drink.' }, images: [u('1555939594-58d7cb561ad1')], price: 22, currency: 'SAR', durationMinutes: 15, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 10 * DAY },
];

const reviewTexts = [
  { ar: 'خدمة ممتازة، أنصح فيها.', en: 'Excellent service, highly recommend.' },
  { ar: 'وقت دقيق وجودة عالية.', en: 'On time, high quality.' },
  { ar: 'الأسعار معقولة والنتيجة ممتازة.', en: 'Reasonable prices, great result.' },
  { ar: 'المعاملة راقية والمكان نظيف.', en: 'Friendly staff, clean place.' },
  { ar: 'تجربتي كانت رائعة، سأعود مرة أخرى.', en: 'Loved it, will come back.' },
];

export const reviews: Review[] = vendors.flatMap((v, vi) =>
  reviewTexts.map((t, i) => ({
    id: `r-${v.id}-${i}`,
    vendorId: v.id,
    customerUid: `cust-${vi}-${i}`,
    rating: Math.min(5, Math.max(3, Math.round(v.rating + (i - 2) * 0.2))),
    comment: t.ar, // store Arabic by default; en mirror in i18n if needed
    flagged: false,
    createdAt: now - (i + 1) * 7 * DAY,
  })),
);

// Sample bookings for the "Bookings" tab placeholder.
export const bookings: Booking[] = [
  {
    id: 'b-1',
    customerUid: 'me',
    vendorId: 'v-noor-salon',
    serviceId: 's-1',
    startAt: now + 2 * DAY,
    endAt: now + 2 * DAY + 45 * MIN,
    status: 'confirmed',
    totalPrice: 70,
    currency: 'SAR',
    createdAt: now - 1 * DAY,
  },
  {
    id: 'b-2',
    customerUid: 'me',
    vendorId: 'v-rose-beauty',
    serviceId: 's-16',
    startAt: now - 10 * DAY,
    endAt: now - 10 * DAY + 75 * MIN,
    status: 'completed',
    totalPrice: 280,
    currency: 'SAR',
    createdAt: now - 15 * DAY,
  },
];
