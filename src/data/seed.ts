/**
 * Kuwait-themed mock data. Same shape as Firestore docs will return later
 * so swapping is zero-touch via src/data/hooks.ts.
 *
 * Currency: KWD. Phone: +965 5XXXXXXX. Areas: Salmiya, Hawalli, Jabriya,
 * Farwaniya, Mishref, Fintas, Adailiya, Kuwait City.
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

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories: Category[] = [
  { id: 'cat-salons',       name: { ar: 'صالونات',         en: 'Salons' },        icon: 'cut-outline',         slug: 'salons',       order: 1 },
  { id: 'cat-hospitality',  name: { ar: 'ضيافة وطعام',     en: 'Food' },          icon: 'restaurant-outline',  slug: 'hospitality',  order: 2 },
  { id: 'cat-cleaning',     name: { ar: 'تنظيف',           en: 'Cleaning' },      icon: 'sparkles-outline',    slug: 'cleaning',     order: 3 },
  { id: 'cat-maintenance',  name: { ar: 'صيانة',           en: 'Maintenance' },   icon: 'construct-outline',   slug: 'maintenance',  order: 4 },
  { id: 'cat-tutoring',     name: { ar: 'دروس خصوصية',     en: 'Tutoring' },      icon: 'school-outline',      slug: 'tutoring',     order: 5 },
];

const stdHours = {
  0: [{ open: '10:00', close: '23:00' }], // Sun
  1: [{ open: '10:00', close: '23:00' }], // Mon
  2: [{ open: '10:00', close: '23:00' }], // Tue
  3: [{ open: '10:00', close: '23:00' }], // Wed
  4: [{ open: '10:00', close: '23:00' }], // Thu
  5: [{ open: '14:00', close: '00:00' }], // Fri
  6: [{ open: '10:00', close: '23:00' }], // Sat
};

export const vendors: Vendor[] = [
  {
    id: 'v-salmiya-cuts',
    ownerUid: 'u-1',
    name: { ar: 'صالون السالمية للحلاقة', en: 'Salmiya Cuts' },
    slug: 'salmiya-cuts',
    bio: {
      ar: 'صالون رجالي بقصّات عصرية وحلاقة دقيقة. ١٠ سنوات في السالمية.',
      en: 'Modern barbershop with precise cuts. 10 years in Salmiya.',
    },
    coverImage: u('1521590832167-7bcbfaa6381f'),
    logoImage: logoFor('Salmiya Cuts'),
    categoryIds: ['cat-salons'],
    location: { lat: 29.3338, lng: 48.0728 },
    address: { ar: 'السالمية، شارع سالم المبارك', en: 'Salmiya, Salem Al Mubarak St.' },
    phone: '+96550000001',
    whatsapp: '+96550000001',
    workingHours: stdHours,
    rating: 4.8, reviewCount: 312, status: 'active',
    verifiedAt: now - 60 * DAY, createdAt: now - 400 * DAY, updatedAt: now - 2 * HOUR,
  },
  {
    id: 'v-bayt-kuwait',
    ownerUid: 'u-2',
    name: { ar: 'مطعم بيت الكويت', en: 'Bayt Al Kuwait' },
    slug: 'bayt-al-kuwait',
    bio: {
      ar: 'مأكولات كويتية أصيلة: مجبوس، مرقوق، جريش. توصيل سريع داخل الكويت.',
      en: 'Authentic Kuwaiti dishes: machboos, margoog, jireesh. Fast delivery.',
    },
    coverImage: u('1555939594-58d7cb561ad1'),
    logoImage: logoFor('Bayt Kuwait'),
    categoryIds: ['cat-hospitality'],
    location: { lat: 29.3759, lng: 47.9774 },
    address: { ar: 'الكويت العاصمة، شارع فهد السالم', en: 'Kuwait City, Fahad Al Salem St.' },
    phone: '+96550000002', whatsapp: '+96550000002',
    workingHours: stdHours,
    rating: 4.9, reviewCount: 528, status: 'active',
    verifiedAt: now - 90 * DAY, createdAt: now - 500 * DAY, updatedAt: now - 18 * MIN,
  },
  {
    id: 'v-fintas-laundry',
    ownerUid: 'u-3',
    name: { ar: 'مغسلة الفنطاس', en: 'Fintas Laundry' },
    slug: 'fintas-laundry',
    bio: {
      ar: 'غسيل وكوي بنفس اليوم. استلام وتوصيل مجاني داخل المنطقة.',
      en: 'Same-day wash & press. Free pickup & delivery within the area.',
    },
    coverImage: u('1582719478250-c89cae4dc85b'),
    logoImage: logoFor('Fintas Laundry'),
    categoryIds: ['cat-cleaning'],
    location: { lat: 29.1758, lng: 48.1208 },
    address: { ar: 'الفنطاس، قطعة ٥', en: 'Fintas, Block 5' },
    phone: '+96550000003', whatsapp: '+96550000003',
    workingHours: stdHours,
    rating: 4.6, reviewCount: 184, status: 'active',
    verifiedAt: now - 40 * DAY, createdAt: now - 300 * DAY, updatedAt: now - 45 * MIN,
  },
  {
    id: 'v-ac-fast-kw',
    ownerUid: 'u-4',
    name: { ar: 'صيانة المكيفات السريعة', en: 'Fast AC Service' },
    slug: 'fast-ac-kw',
    bio: {
      ar: 'فنّيون معتمدون لصيانة وتنظيف وتركيب المكيفات. حضور خلال ساعة في الفروانية وحولي.',
      en: 'Certified AC techs. On-site within 1 hour in Farwaniya & Hawalli.',
    },
    coverImage: u('1581094794329-c8112a89af12'),
    logoImage: logoFor('Fast AC'),
    categoryIds: ['cat-maintenance'],
    location: { lat: 29.2787, lng: 47.9586 },
    address: { ar: 'الفروانية، قطعة ٣', en: 'Farwaniya, Block 3' },
    phone: '+96560000001', whatsapp: '+96560000001',
    workingHours: stdHours,
    rating: 4.5, reviewCount: 96, status: 'active',
    verifiedAt: now - 30 * DAY, createdAt: now - 250 * DAY, updatedAt: now - 5 * MIN,
  },
  {
    id: 'v-lamsat-aldahab',
    ownerUid: 'u-5',
    name: { ar: 'كوافير لمسة الذهب', en: 'Lamsat Al Dahab' },
    slug: 'lamsat-al-dahab',
    bio: {
      ar: 'صالون نسائي راقي في حولي. صبغة، تسريحات مناسبات، وعناية شعر.',
      en: 'Upscale women\'s salon in Hawalli. Coloring, event styling, hair care.',
    },
    coverImage: u('1560066984-138dadb4c035'),
    logoImage: logoFor('Lamsat Al Dahab'),
    categoryIds: ['cat-salons'],
    location: { lat: 29.3357, lng: 48.0292 },
    address: { ar: 'حولي، شارع تونس', en: 'Hawalli, Tunis St.' },
    phone: '+96550000005', whatsapp: '+96550000005',
    workingHours: stdHours,
    rating: 4.9, reviewCount: 412, status: 'active',
    verifiedAt: now - 120 * DAY, createdAt: now - 600 * DAY, updatedAt: now - 30 * MIN,
  },
  {
    id: 'v-najah-academy',
    ownerUid: 'u-6',
    name: { ar: 'أكاديمية النجاح', en: 'Najah Academy' },
    slug: 'najah-academy',
    bio: {
      ar: 'دروس خصوصية للمتوسط والثانوي والجامعي. رياضيات، فيزياء، إنجليزي.',
      en: 'Tutoring for middle, high school, and university. Math, physics, English.',
    },
    coverImage: u('1503676260728-1c00da094a0b'),
    logoImage: logoFor('Najah Academy'),
    categoryIds: ['cat-tutoring'],
    location: { lat: 29.3148, lng: 48.0303 },
    address: { ar: 'الجابرية، قطعة ٧', en: 'Jabriya, Block 7' },
    phone: '+96599000001', whatsapp: '+96599000001',
    workingHours: stdHours,
    rating: 4.7, reviewCount: 142, status: 'active',
    verifiedAt: now - 75 * DAY, createdAt: now - 350 * DAY, updatedAt: now - 3 * HOUR,
  },
  {
    id: 'v-mishref-clean',
    ownerUid: 'u-7',
    name: { ar: 'تنظيف مشرف الشامل', en: 'Mishref Full Cleaning' },
    slug: 'mishref-cleaning',
    bio: {
      ar: 'تنظيف شامل للبيوت والشقق والشاليهات. فريق نسائي وفريق رجالي.',
      en: 'Deep cleaning for homes, apartments, and chalets. Both crews available.',
    },
    coverImage: u('1581578731548-c64695cc6952'),
    logoImage: logoFor('Mishref Clean'),
    categoryIds: ['cat-cleaning'],
    location: { lat: 29.2956, lng: 48.0683 },
    address: { ar: 'مشرف، قطعة ١', en: 'Mishref, Block 1' },
    phone: '+96550000007', whatsapp: '+96550000007',
    workingHours: stdHours,
    rating: 4.4, reviewCount: 78, status: 'active',
    verifiedAt: now - 20 * DAY, createdAt: now - 180 * DAY, updatedAt: now - 70 * MIN,
  },
  {
    id: 'v-diwaniya-grill',
    ownerUid: 'u-8',
    name: { ar: 'مشاوي الديوانية', en: 'Diwaniya Grill' },
    slug: 'diwaniya-grill',
    bio: {
      ar: 'مشاوي على الفحم: تكة، كباب، شيش طاووق. توصيل سريع.',
      en: 'Charcoal grills: tikka, kebab, shish tawook. Fast delivery.',
    },
    coverImage: u('1555939594-58d7cb561ad1', 800),
    logoImage: logoFor('Diwaniya Grill'),
    categoryIds: ['cat-hospitality'],
    location: { lat: 29.3503, lng: 47.9636 },
    address: { ar: 'العديلية، شارع ٣', en: 'Adailiya, Street 3' },
    phone: '+96560000008', whatsapp: '+96560000008',
    workingHours: stdHours,
    rating: 4.6, reviewCount: 234, status: 'active',
    verifiedAt: now - 50 * DAY, createdAt: now - 280 * DAY, updatedAt: now - 8 * MIN,
  },
];

const sImg = [
  u('1562322140-8baeececf3df'),
  u('1599351431202-1e0f0137899a'),
  u('1503951914875-452162b0f3f1'),
  u('1521590832167-7bcbfaa6381f'),
];

const KWD = 'KWD';

export const services: Service[] = [
  // Salmiya Cuts (4)
  { id: 's-1',  vendorId: 'v-salmiya-cuts', title: { ar: 'قصّة شعر كلاسيكية',  en: 'Classic haircut' }, description: { ar: 'قصّ احترافي مع غسيل وتجفيف.',           en: 'Pro haircut, wash & blow dry.' },               images: [sImg[3]], price: 5,  currency: KWD, durationMinutes: 45, categoryIds: ['cat-salons'],     active: true, createdAt: now - 100 * DAY },
  { id: 's-2',  vendorId: 'v-salmiya-cuts', title: { ar: 'حلاقة لحية ديلوكس',   en: 'Deluxe beard shave' }, description: { ar: 'منشفة ساخنة وزيوت مرطّبة.',           en: 'Hot towel + conditioning oils.' },              images: [sImg[3]], price: 7,  currency: KWD, durationMinutes: 40, categoryIds: ['cat-salons'],     active: true, createdAt: now - 90 * DAY },
  { id: 's-3',  vendorId: 'v-salmiya-cuts', title: { ar: 'صبغة شعر',             en: 'Hair coloring' }, description: { ar: 'صبغة احترافية بألوان متعددة.',         en: 'Pro coloring, multiple shades.' },              images: [sImg[0]], price: 18, currency: KWD, durationMinutes: 90, categoryIds: ['cat-salons'],     active: true, createdAt: now - 80 * DAY },
  { id: 's-4',  vendorId: 'v-salmiya-cuts', title: { ar: 'باقة العريس',          en: 'Groom package' }, description: { ar: 'قصّ، حلاقة، وغسيل وجه.',                 en: 'Cut, shave, and facial.' },                      images: [sImg[0]], price: 28, currency: KWD, durationMinutes: 120, categoryIds: ['cat-salons'],    active: true, createdAt: now - 70 * DAY },

  // Bayt Al Kuwait (4)
  { id: 's-5',  vendorId: 'v-bayt-kuwait',   title: { ar: 'مجبوس لحم لـ ٤ أشخاص', en: 'Lamb machboos for 4' }, description: { ar: 'مجبوس لحم كامل مع أرز وسلطة.',          en: 'Full lamb machboos with rice & salad.' },       images: [u('1555939594-58d7cb561ad1')], price: 22, currency: KWD, durationMinutes: 60, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 60 * DAY },
  { id: 's-6',  vendorId: 'v-bayt-kuwait',   title: { ar: 'مرقوق دجاج',            en: 'Chicken margoog' }, description: { ar: 'مرقوق على الطريقة الكويتية.',          en: 'Authentic Kuwaiti chicken margoog.' },          images: [u('1555939594-58d7cb561ad1')], price: 5,  currency: KWD, durationMinutes: 45, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 55 * DAY },
  { id: 's-7',  vendorId: 'v-bayt-kuwait',   title: { ar: 'جريش حلو',              en: 'Sweet jireesh' }, description: { ar: 'جريش بنكهة القرفة والهيل.',             en: 'Cinnamon-cardamom sweet jireesh.' },            images: [u('1555939594-58d7cb561ad1')], price: 9,  currency: KWD, durationMinutes: 75, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 50 * DAY },
  { id: 's-8',  vendorId: 'v-bayt-kuwait',   title: { ar: 'وجبة عزيمة لـ ١٠ أشخاص', en: 'Group platter for 10' }, description: { ar: 'مجبوس + سلطة + حلو + ماء.',         en: 'Machboos + salad + dessert + water.' },         images: [u('1555939594-58d7cb561ad1')], price: 55, currency: KWD, durationMinutes: 90, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 45 * DAY },

  // Fintas Laundry (3)
  { id: 's-9',  vendorId: 'v-fintas-laundry', title: { ar: 'غسيل وكوي ١٠ قطع',     en: 'Wash & press 10 items' }, description: { ar: 'استلام وتوصيل مجاني.',                  en: 'Free pickup & delivery.' },                     images: [u('1582719478250-c89cae4dc85b')], price: 4,  currency: KWD, durationMinutes: 1440, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 60 * DAY },
  { id: 's-10', vendorId: 'v-fintas-laundry', title: { ar: 'تنظيف عبايات وثياب رسمية', en: 'Formal wear cleaning' }, description: { ar: 'بخار خاص للأقمشة الحساسة.',          en: 'Steam clean for delicate fabrics.' },           images: [u('1582719478250-c89cae4dc85b')], price: 3,  currency: KWD, durationMinutes: 1440, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 55 * DAY },
  { id: 's-11', vendorId: 'v-fintas-laundry', title: { ar: 'سجاد ٢×٣',              en: 'Carpet 2×3m' }, description: { ar: 'تنظيف عميق وإزالة بقع.',                  en: 'Deep clean and stain removal.' },               images: [u('1582719478250-c89cae4dc85b')], price: 8,  currency: KWD, durationMinutes: 1440, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 50 * DAY },

  // Fast AC (3)
  { id: 's-12', vendorId: 'v-ac-fast-kw',    title: { ar: 'تنظيف مكيف سبليت',     en: 'Split AC cleaning' }, description: { ar: 'تنظيف فلتر ووحدة داخلية وخارجية.',       en: 'Filter + indoor + outdoor unit clean.' },       images: [u('1581094794329-c8112a89af12')], price: 12, currency: KWD, durationMinutes: 90, categoryIds: ['cat-maintenance'], active: true, createdAt: now - 60 * DAY },
  { id: 's-13', vendorId: 'v-ac-fast-kw',    title: { ar: 'صيانة طارئة ٢٤ ساعة',   en: '24h emergency repair' }, description: { ar: 'حضور خلال ساعة بدون رسوم إضافية.',     en: 'On-site within 1 hour, no surcharge.' },        images: [u('1581094794329-c8112a89af12')], price: 18, currency: KWD, durationMinutes: 120, categoryIds: ['cat-maintenance'], active: true, createdAt: now - 55 * DAY },
  { id: 's-14', vendorId: 'v-ac-fast-kw',    title: { ar: 'تركيب مكيف شباك',       en: 'Window AC install' }, description: { ar: 'تركيب كامل مع ضمان شهر.',                en: 'Full install with 1-month warranty.' },         images: [u('1581094794329-c8112a89af12')], price: 25, currency: KWD, durationMinutes: 180, categoryIds: ['cat-maintenance'], active: true, createdAt: now - 50 * DAY },

  // Lamsat Al Dahab (4)
  { id: 's-15', vendorId: 'v-lamsat-aldahab', title: { ar: 'تسريحة مناسبات',        en: 'Event styling' }, description: { ar: 'تسريحة كاملة مع تثبيت.',                 en: 'Full styling with setting.' },                  images: [sImg[0]], price: 20, currency: KWD, durationMinutes: 90, categoryIds: ['cat-salons'],     active: true, createdAt: now - 60 * DAY },
  { id: 's-16', vendorId: 'v-lamsat-aldahab', title: { ar: 'صبغة بلون كامل',         en: 'Full hair color' }, description: { ar: 'صبغة دائمة بألوان حديثة.',              en: 'Permanent color, modern shades.' },             images: [sImg[0]], price: 35, currency: KWD, durationMinutes: 150, categoryIds: ['cat-salons'],    active: true, createdAt: now - 55 * DAY },
  { id: 's-17', vendorId: 'v-lamsat-aldahab', title: { ar: 'بروتين شعر',             en: 'Hair protein treatment' }, description: { ar: 'علاج بروتين لتنعيم الشعر.',          en: 'Protein treatment for smooth hair.' },          images: [sImg[0]], price: 45, currency: KWD, durationMinutes: 180, categoryIds: ['cat-salons'],    active: true, createdAt: now - 50 * DAY },
  { id: 's-18', vendorId: 'v-lamsat-aldahab', title: { ar: 'باقة العروس',            en: 'Bride package' }, description: { ar: 'مكياج + تسريحة + بروفة سابقة.',          en: 'Makeup + styling + prior trial.' },             images: [sImg[0]], price: 80, currency: KWD, durationMinutes: 240, categoryIds: ['cat-salons'],    active: true, createdAt: now - 45 * DAY },

  // Najah Academy (3)
  { id: 's-19', vendorId: 'v-najah-academy',  title: { ar: 'حصة رياضيات (ساعة)',     en: 'Math session (1h)' }, description: { ar: 'متوسط/ثانوي. درس فردي مع تمارين.',     en: 'Middle/high school. 1-on-1 with practice.' },   images: [u('1503676260728-1c00da094a0b')], price: 6,  currency: KWD, durationMinutes: 60, categoryIds: ['cat-tutoring'], active: true, createdAt: now - 60 * DAY },
  { id: 's-20', vendorId: 'v-najah-academy',  title: { ar: 'حصة فيزياء (ساعة)',      en: 'Physics session (1h)' }, description: { ar: 'ثانوي وأول جامعي.',                    en: 'High school and freshman.' },                   images: [u('1503676260728-1c00da094a0b')], price: 7,  currency: KWD, durationMinutes: 60, categoryIds: ['cat-tutoring'], active: true, createdAt: now - 55 * DAY },
  { id: 's-21', vendorId: 'v-najah-academy',  title: { ar: 'باقة ٨ حصص شهرية',        en: '8-session monthly bundle' }, description: { ar: 'أي مادة، ٨ حصص بسعر مخفّض.',        en: 'Any subject, 8 sessions at a discount.' },      images: [u('1503676260728-1c00da094a0b')], price: 40, currency: KWD, durationMinutes: 60, categoryIds: ['cat-tutoring'], active: true, createdAt: now - 50 * DAY },

  // Mishref Cleaning (3)
  { id: 's-22', vendorId: 'v-mishref-clean',  title: { ar: 'تنظيف شقة ٢ غرفة',       en: 'Apartment cleaning 2BR' }, description: { ar: 'تنظيف شامل ٣ ساعات تقريباً.',         en: 'Full clean, ~3 hours.' },                       images: [u('1581578731548-c64695cc6952')], price: 15, currency: KWD, durationMinutes: 180, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 60 * DAY },
  { id: 's-23', vendorId: 'v-mishref-clean',  title: { ar: 'تنظيف بيت ٤ غرف',        en: 'Villa cleaning 4BR' }, description: { ar: 'فريق ٢ بنفس الجودة.',                  en: '2-person crew, same quality.' },                images: [u('1581578731548-c64695cc6952')], price: 35, currency: KWD, durationMinutes: 360, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 55 * DAY },
  { id: 's-24', vendorId: 'v-mishref-clean',  title: { ar: 'تنظيف بعد البناء',       en: 'Post-construction clean' }, description: { ar: 'إزالة غبار وبقع البناء.',           en: 'Construction dust and stain removal.' },        images: [u('1581578731548-c64695cc6952')], price: 50, currency: KWD, durationMinutes: 480, categoryIds: ['cat-cleaning'], active: true, createdAt: now - 50 * DAY },

  // Diwaniya Grill (3)
  { id: 's-25', vendorId: 'v-diwaniya-grill', title: { ar: 'تكة لحم نص كيلو',        en: 'Lamb tikka 500g' }, description: { ar: 'مع خبز عربي وسلطة.',                    en: 'With Arabic bread and salad.' },                images: [u('1555939594-58d7cb561ad1', 800)], price: 6, currency: KWD, durationMinutes: 30, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 60 * DAY },
  { id: 's-26', vendorId: 'v-diwaniya-grill', title: { ar: 'شيش طاووق ٢ سيخ',         en: 'Shish tawook 2 skewers' }, description: { ar: 'دجاج متبّل ومشوي على الفحم.',      en: 'Marinated chicken, charcoal grilled.' },        images: [u('1555939594-58d7cb561ad1', 800)], price: 4, currency: KWD, durationMinutes: 30, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 55 * DAY },
  { id: 's-27', vendorId: 'v-diwaniya-grill', title: { ar: 'مشاوي عائلية',           en: 'Family grill platter' }, description: { ar: 'تكة + كباب + طاووق + رز.',          en: 'Tikka + kebab + tawook + rice.' },              images: [u('1555939594-58d7cb561ad1', 800)], price: 22, currency: KWD, durationMinutes: 45, categoryIds: ['cat-hospitality'], active: true, createdAt: now - 50 * DAY },
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

export const bookings: Booking[] = [
  { id: 'b-1', customerUid: 'me', vendorId: 'v-salmiya-cuts',  serviceId: 's-1',  startAt: now + 1 * DAY,  endAt: now + 1 * DAY + 45 * MIN,  status: 'confirmed', totalPrice: 5,  currency: KWD, createdAt: now - 2 * HOUR },
  { id: 'b-2', customerUid: 'me', vendorId: 'v-bayt-kuwait',   serviceId: 's-5',  startAt: now + 3 * DAY,  endAt: now + 3 * DAY + 60 * MIN,  status: 'pending',   totalPrice: 22, currency: KWD, createdAt: now - 30 * MIN },
  { id: 'b-3', customerUid: 'me', vendorId: 'v-lamsat-aldahab', serviceId: 's-15', startAt: now - 7 * DAY,  endAt: now - 7 * DAY + 90 * MIN,  status: 'completed', totalPrice: 20, currency: KWD, createdAt: now - 14 * DAY },
];

export const servicesForVendor = (vendorId: string) => services.filter((s) => s.vendorId === vendorId);
export const reviewsForVendor  = (vendorId: string) => reviews.filter((r) => r.vendorId === vendorId);
export const vendorById        = (id: string) => vendors.find((v) => v.id === id);
export const serviceById       = (id: string) => services.find((s) => s.id === id);
export const categoryById      = (id: string) => categories.find((c) => c.id === id);
