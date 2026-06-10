/**
 * Bilingual copy for the public /join landing page. Arabic-first (Kuwaiti
 * dialect), English fallback. Keep marketing strings here so the page is layout
 * only.
 *
 * Positioning (docs/CREATIVE-STRATEGY.md): not "a directory with analytics" —
 * **"a marketing employee for 6 KWD a month."** AI is what makes that true.
 */
import type { Locale } from '@/i18n/dict';
import { BRAND } from '@/lib/brand';

export interface Feature {
  icon: 'wand' | 'whatsapp' | 'report' | 'camera' | 'megaphone' | 'calendar';
  title: string;
  body: string;
  tier: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface JoinCopy {
  nav: { signIn: string; cta: string };
  hero: {
    badge: string;
    titleTop: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
    /** WhatsApp-style demo chat shown beside the hero. */
    chat: {
      title: string;
      in1: string;
      in2: string;
      voiceLabel: string;
      out1: string;
      storeName: string;
      storeArea: string;
      storeProducts: { name: string; price: string }[];
      out2: string;
    };
  };
  stats: { value: string; label: string }[];
  stepsHeading: { title: string; subtitle: string };
  steps: Step[];
  aiHeading: { eyebrow: string; title: string; subtitle: string };
  features: Feature[];
  proof: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cardLabel: string;
    cardLeads: string;
    cardSales: string;
    cardValue: string;
    cardMultiple: string;
    bullets: string[];
  };
  pricing: {
    title: string;
    subtitle: string;
    toggle1: string;
    toggle3: string;
    save: string; // {pct} placeholder
    perMonth: string;
    free: string;
    billed3: string; // {total} {currency}
    placeholder: string;
    launchNote: string;
    cta: string;
    ctaFree: string;
    popular: string;
  };
  faqHeading: { title: string; subtitle: string };
  faqs: Faq[];
  finalCta: { title: string; subtitle: string; cta: string; note: string };
  footer: { tagline: string; signIn: string; rights: string };
}

const AR: JoinCopy = {
  nav: { signIn: 'تسجيل الدخول', cta: 'أنشئ متجرك' },
  hero: {
    badge: `${BRAND.ar} للأعمال · الكويت 🇰🇼`,
    titleTop: 'مو بس متجر.',
    titleAccent: 'موظّف تسويق ذكي لمشروعك.',
    subtitle:
      'دزّ ٥ صور ورسالة صوتية — والذكاء الاصطناعي يبني متجرك كامل بالعربي والإنجليزي. العملاء يلقونك ويطلبون منك على واتساب مباشرة. بدون عمولة، وبدون وجع راس الدفع أو التوصيل.',
    ctaPrimary: 'ابدأ مجاناً',
    ctaSecondary: 'شوف الأسعار',
    note: 'تبدأ مجاني · بدون بطاقة · متجرك جاهز بدقائق',
    chat: {
      title: 'منشئ المتجر الذكي',
      in1: 'هلا! أبي متجر لحلوياتي 🍰',
      in2: '📷 ٥ صور',
      voiceLabel: 'رسالة صوتية · ٠:٤٢',
      out1: 'حياك الله! 🪄 جاري بناء متجرك…',
      storeName: 'حلويات أم سارة',
      storeArea: 'السالمية · توصيل',
      storeProducts: [
        { name: 'صندوق التمر الفاخر', price: '١٢ د.ك' },
        { name: 'كيكة العود', price: '٨ د.ك' },
      ],
      out2: 'متجرك جاهز ✅ بالعربي والإنجليزي — راجعيه واعتمديه.',
    },
  },
  stats: [
    { value: '٠٪', label: 'عمولة على مبيعاتك' },
    { value: 'دقائق', label: 'من التسجيل لمتجر كامل' },
    { value: 'واتساب', label: 'الطلبات توصلك مباشرة' },
  ],
  stepsHeading: { title: 'كيف تشتغل؟', subtitle: 'ثلاث خطوات — وأغلب الشغل علينا مو عليك.' },
  steps: [
    { title: 'دزّ صورك ورسالة صوتية', body: 'صوّر منتجاتك من جوالك واحكِ لنا عن مشروعك بصوتك — بس.' },
    { title: 'الذكاء الاصطناعي يبني متجرك', body: 'أوصاف بالعربي والإنجليزي، أسعار مقترحة، وتصنيفات — تراجعه وتعتمده.' },
    { title: 'الطلبات توصلك على واتساب', body: 'كل عميل يضغط «اطلب» يوصلك برسالة موسومة، وتشوف كل طلب في لوحتك.' },
  ],
  aiHeading: {
    eyebrow: 'الذكاء الاصطناعي',
    title: 'فريق تسويق كامل، براتب موظف جزئي… أرخص',
    subtitle: 'كاتب المحتوى، المصوّر، والمحلل — كلهم يشتغلون لمشروعك على مدار الساعة.',
  },
  features: [
    { icon: 'wand', title: 'منشئ المتجر الذكي', body: '٥ صور + رسالة صوتية = متجر كامل ثنائي اللغة بأوصاف تبيع، مو بس «حلى لذيذ 😍».', tier: 'أساسي' },
    { icon: 'whatsapp', title: 'ردود واتساب جاهزة', body: 'نولّد لك ردودك السريعة من منتجاتك: الترحيب، الأسعار، التوصيل، والنفد — تنسخينها مرة وحدة.', tier: 'أساسي' },
    { icon: 'report', title: 'تقرير الأحد الأسبوعي', body: '«متجرك هالأسبوع: ٤٠ مشاهدة و٧ طلبات. انزلي عرض الخميس العصر — أكثر وقت يشوفونك.»', tier: 'احترافي' },
    { icon: 'megaphone', title: 'كابشنات انستقرام', body: 'اختاري المنتج — ونعطيك ٣ كابشنات بالكويتي مع هاشتاقات الكويت ووقت النشر الأفضل.', tier: 'احترافي' },
    { icon: 'camera', title: 'تحسين الصور', body: 'صورة من المطبخ تصير صورة كتالوج: خلفية نظيفة، إضاءة معدّلة، وقص مربّع — بضغطة.', tier: 'احترافي' },
    { icon: 'calendar', title: 'حملات المواسم', body: 'رمضان، العيد، القرقيعان، والأعياد الوطنية — حملة جاهزة ببانر وكابشنات وعرض، قبل الموسم بأسابيع.', tier: 'احترافي' },
  ],
  proof: {
    eyebrow: 'إثبات القيمة',
    title: 'مو «عدد طلبات» — فلوس تشوفينها',
    subtitle: 'كل طلب واتساب له رقم مرجعي تقدرين تلقينه في محادثاتك. علّمي الطلبات اللي صارت مبيعات — ولوحتك تحوّل الأرقام لقيمة حقيقية.',
    cardLabel: 'هالشهر عبر المنصة',
    cardLeads: '٢٣ طلب واتساب',
    cardSales: '≈ ٩ مبيعات مأكّدة',
    cardValue: '٦٧ د.ك قيمة الطلبات',
    cardMultiple: '×١١ ما دفعتيه',
    bullets: [
      'رسالة كل عميل موسومة برقم مرجعي — التتبّع حقيقي مو ادّعاء.',
      'علّمي الطلب «تم البيع» وسجّلي المبلغ — بثانية.',
      'تقريرك الأسبوعي يوصلك بالعربي على واتساب.',
    ],
  },
  pricing: {
    title: 'أسعار تناسب مشروع بيت',
    subtitle: 'ابدأ مجاناً وترقَّ لما تشوف الطلبات بنفسك. بدون عمولة — أبداً.',
    toggle1: 'شهر واحد',
    toggle3: '٣ أشهر',
    save: 'وفّر {pct}٪',
    perMonth: '/ شهرياً',
    free: 'مجاني',
    billed3: 'يُدفع {total} {currency} لكل ٣ أشهر',
    placeholder: '— د.ك',
    launchNote: 'أسعار الإطلاق — أول ٥٠ مشروع لهم عرض المؤسسين: ٣ أشهر «احترافي» بـ ١٠ د.ك.',
    cta: 'ابدأ الآن',
    ctaFree: 'ابدأ مجاناً',
    popular: 'الأكثر اختياراً',
  },
  faqHeading: { title: 'أسئلة شائعة', subtitle: 'كل اللي تحتاج تعرفه قبل ما تبدأ.' },
  faqs: [
    { q: 'تأخذون عمولة على مبيعاتي؟', a: `لا. ${BRAND.ar} اشتراك ثابت فقط، وما ناخذ أي نسبة من مبيعاتك — مهما باعت.` },
    { q: 'كيف يبني الذكاء الاصطناعي متجري؟', a: 'تدزّ لنا صور منتجاتك ورسالة صوتية تشرحين فيها شغلك. النظام يكتب الأوصاف بالعربي والإنجليزي ويقترح الأسعار والتصنيفات، وتراجعين كل شي وتعتمدينه قبل النشر.' },
    { q: 'تتولّون الدفع والتوصيل؟', a: 'لا. العميل يتواصل معك مباشرة على واتساب، وتتفقون على الدفع والتوصيل بينكم — مثل ما تتعاملين اليوم بالضبط.' },
    { q: 'محتاج محل أو رخصة؟', a: 'لا، المنصة مصمّمة للمشاريع المنزلية والصغيرة. تبدأ بمتجرك المصغّر مباشرة.' },
    { q: 'شنو يعني «طلب موسوم»؟', a: 'كل عميل يضغط «اطلب عبر واتساب» توصلك رسالته مع رقم مرجعي مثل MSH-7F3A — تعرفين إن الطلب يا من المنصة، وتقدرين تلقين المحادثة بالبحث عن الرقم.' },
    { q: 'أقدر أغيّر أو ألغي اشتراكي؟', a: 'نعم، تقدر تبدّل خطتك أو توقف التجديد في أي وقت — بدون أي رسوم إلغاء.' },
  ],
  finalCta: {
    title: 'مشروعك يستاهل أكثر من ستوري ينطفي بعد ٢٤ ساعة',
    subtitle: 'أنشئ متجرك اليوم — مجاناً — وخلّ عملاء الكويت يلقونك.',
    cta: 'أنشئ متجرك مجاناً',
    note: 'بدون بطاقة · بدون التزام',
  },
  footer: { tagline: 'دليل تجار الكويت + متاجر مصغّرة', signIn: 'عندك حساب؟ سجّل دخولك', rights: 'جميع الحقوق محفوظة' },
};

const EN: JoinCopy = {
  nav: { signIn: 'Sign in', cta: 'Create your store' },
  hero: {
    badge: `${BRAND.en} for business · Kuwait 🇰🇼`,
    titleTop: 'Not just a store.',
    titleAccent: 'An AI marketing employee for your business.',
    subtitle:
      'Send 5 photos and a voice note — AI builds your full bilingual store. Customers find you and order straight on WhatsApp. No commission, none of the payment or delivery hassle.',
    ctaPrimary: 'Start free',
    ctaSecondary: 'See pricing',
    note: 'Start free · No card needed · Store ready in minutes',
    chat: {
      title: 'AI Storefront Builder',
      in1: 'Hi! I want a store for my desserts 🍰',
      in2: '📷 5 photos',
      voiceLabel: 'Voice note · 0:42',
      out1: 'Welcome! 🪄 Building your store…',
      storeName: 'Umm Sara Sweets',
      storeArea: 'Salmiya · Delivery',
      storeProducts: [
        { name: 'Premium date box', price: 'KD 12' },
        { name: 'Oud cake', price: 'KD 8' },
      ],
      out2: 'Your store is ready ✅ in Arabic & English — review and approve.',
    },
  },
  stats: [
    { value: '0%', label: 'commission on your sales' },
    { value: 'Minutes', label: 'from sign-up to full store' },
    { value: 'WhatsApp', label: 'leads come straight to you' },
  ],
  stepsHeading: { title: 'How it works', subtitle: 'Three steps — and most of the work is ours, not yours.' },
  steps: [
    { title: 'Send photos + a voice note', body: 'Shoot your products on your phone and tell us about your business in your own voice. That’s it.' },
    { title: 'AI builds your store', body: 'Descriptions in Arabic & English, suggested prices, categories — you review and approve.' },
    { title: 'Leads arrive on WhatsApp', body: 'Every customer who taps "Order" reaches you with a tagged message, and every lead shows in your dashboard.' },
  ],
  aiHeading: {
    eyebrow: 'AI-powered',
    title: 'A full marketing team, for less than a part-timer',
    subtitle: 'Copywriter, photographer’s assistant, and analyst — all working on your business around the clock.',
  },
  features: [
    { icon: 'wand', title: 'AI Storefront Builder', body: '5 photos + a voice note = a complete bilingual store with descriptions that sell — not just "yummy 😍".', tier: 'Basic' },
    { icon: 'whatsapp', title: 'WhatsApp reply kit', body: 'Your quick replies, generated from your catalog: greeting, price list, delivery, sold out — copy once, reuse forever.', tier: 'Basic' },
    { icon: 'report', title: 'The Sunday report', body: '"Your store this week: 40 views, 7 leads. Post your date box Thursday evening — your busiest window."', tier: 'Pro' },
    { icon: 'megaphone', title: 'Instagram captions', body: 'Pick a product — get 3 Kuwaiti-dialect captions with Kuwait-relevant hashtags and the best time to post.', tier: 'Pro' },
    { icon: 'camera', title: 'Photo cleanup', body: 'A kitchen-counter photo becomes a catalog shot: clean background, fixed lighting, square crop — one tap.', tier: 'Pro' },
    { icon: 'calendar', title: 'Seasonal campaigns', body: 'Ramadan, Eid, gergean, National Day — a ready campaign with banner, captions and an offer, weeks ahead.', tier: 'Pro' },
  ],
  proof: {
    eyebrow: 'Proof of value',
    title: 'Not a "lead count" — money you can see',
    subtitle: 'Every WhatsApp lead carries a reference code you can find in your own chats. Mark the ones that became sales — your dashboard turns numbers into real value.',
    cardLabel: 'This month via the platform',
    cardLeads: '23 WhatsApp leads',
    cardSales: '≈ 9 confirmed sales',
    cardValue: 'KD 67 in orders',
    cardMultiple: '11× what you paid',
    bullets: [
      'Every customer message is tagged with a reference code — attribution is verifiable, not claimed.',
      'Mark a lead "Sold" and log the amount — takes a second.',
      'Your weekly report arrives in Arabic, on WhatsApp.',
    ],
  },
  pricing: {
    title: 'Priced for a home business',
    subtitle: 'Start free, upgrade when you see the leads yourself. No commission — ever.',
    toggle1: '1 month',
    toggle3: '3 months',
    save: 'Save {pct}%',
    perMonth: '/ month',
    free: 'Free',
    billed3: 'Billed {total} {currency} every 3 months',
    placeholder: '— KWD',
    launchNote: 'Launch pricing — the first 50 businesses get the Founders offer: 3 months of Pro for KD 10.',
    cta: 'Get started',
    ctaFree: 'Start free',
    popular: 'Most popular',
  },
  faqHeading: { title: 'Frequently asked questions', subtitle: 'Everything you need to know before you start.' },
  faqs: [
    { q: 'Do you take a commission on my sales?', a: `No. ${BRAND.en} is a flat subscription only — we never take a percentage of your sales, no matter how much you sell.` },
    { q: 'How does the AI build my store?', a: 'You send us product photos and a voice note describing your business. The system writes Arabic + English descriptions, suggests prices and categories — and you review and approve everything before it goes live.' },
    { q: 'Do you handle payment and delivery?', a: 'No. The customer contacts you directly on WhatsApp, and you agree payment and delivery between yourselves — exactly how you work today.' },
    { q: 'Do I need a shop or a license?', a: 'No — the platform is built for home and small businesses. You start with your mini-store right away.' },
    { q: 'What is a "tagged lead"?', a: 'Every customer who taps "Order via WhatsApp" reaches you with a reference code like MSH-7F3A — so you know the lead came from the platform, and you can find the conversation by searching for the code.' },
    { q: 'Can I change or cancel my plan?', a: 'Yes, you can switch plans or stop renewing at any time — with no cancellation fees.' },
  ],
  finalCta: {
    title: 'Your business deserves more than a story that dies in 24 hours',
    subtitle: 'Create your store today — free — and let Kuwaiti customers find you.',
    cta: 'Create your free store',
    note: 'No card · No commitment',
  },
  footer: { tagline: 'Kuwait vendor directory + mini-stores', signIn: 'Have an account? Sign in', rights: 'All rights reserved' },
};

export function getJoinCopy(locale: Locale): JoinCopy {
  return locale === 'en' ? EN : AR;
}
