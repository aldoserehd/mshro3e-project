/**
 * Bilingual copy for the public /join landing page. Arabic-first (Kuwaiti
 * dialect), English fallback. Keep marketing strings here so the page is layout
 * only.
 */
import type { Locale } from '@/i18n/dict';

export interface Feature {
  icon: 'search' | 'whatsapp' | 'store' | 'chart' | 'percent' | 'shield';
  title: string;
  body: string;
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
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
  };
  trust: string[];
  featuresHeading: { title: string; subtitle: string };
  features: Feature[];
  stepsHeading: { title: string; subtitle: string };
  steps: Step[];
  pricing: {
    title: string;
    subtitle: string;
    toggle1: string;
    toggle3: string;
    save: string; // {pct} placeholder
    perMonth: string;
    billed3: string; // {total} {currency}
    placeholder: string;
    placeholderNote: string;
    cta: string;
    customCta: string;
    popular: string;
  };
  faqHeading: { title: string; subtitle: string };
  faqs: Faq[];
  finalCta: { title: string; subtitle: string; cta: string };
  footer: { tagline: string; signIn: string; rights: string };
}

const AR: JoinCopy = {
  nav: { signIn: 'تسجيل الدخول', cta: 'أنشئ متجرك' },
  hero: {
    badge: 'مشروعي للأعمال · الكويت',
    title: 'نمِّ مشروعك الكويتي مع مشروعي',
    subtitle:
      'اعرض منتجاتك لآلاف العملاء في الكويت، وخلّهم يتواصلون معك مباشرة على واتساب. بدون عمولة، وبدون وجع راس الدفع أو التوصيل.',
    ctaPrimary: 'أنشئ متجرك',
    ctaSecondary: 'كيف تشتغل؟',
    note: 'مجاني للعملاء · إنشاء المتجر يأخذ دقائق',
  },
  trust: ['تجار كويتيون', 'تواصل عبر واتساب', 'بدون عمولة على مبيعاتك'],
  featuresHeading: {
    title: 'ليش مشروعي؟',
    subtitle: 'كل اللي تحتاجه عشان يلقاك العملاء ويتواصلون معك — بدون تعقيد.',
  },
  features: [
    { icon: 'search', title: 'يلقونك العملاء مجاناً', body: 'العملاء يتصفحون دليل التجار الكويتيين في تطبيق مشروعي بدون أي رسوم.' },
    { icon: 'whatsapp', title: 'طلبات على واتساب', body: 'العميل يضغط زر واحد ويوصلك على واتساب مباشرة — بدون وسيط.' },
    { icon: 'store', title: 'متجرك المصغّر', body: 'صفحة باسمك، منتجاتك، صورك، ومنطقتك — جاهزة لتشاركها.' },
    { icon: 'chart', title: 'إحصائيات بسيطة', body: 'شوف كم عميل تواصل معك عبر مشروعي — دليل واضح على قيمة المنصة لك.' },
    { icon: 'percent', title: 'بدون عمولة', body: 'ما ناخذ نسبة من مبيعاتك. اشتراك ثابت وبس، والباقي لك.' },
    { icon: 'shield', title: 'بدون دفع أو توصيل', body: 'مشروعي ما يتدخل بالدفع ولا التوصيل — تتفق مباشرة مع عميلك.' },
  ],
  stepsHeading: { title: 'كيف تشتغل؟', subtitle: 'من التسجيل لأول طلب — أربع خطوات بس.' },
  steps: [
    { title: 'سجّل حسابك', body: 'بريد وكلمة مرور وبس — بدون أوراق.' },
    { title: 'جهّز متجرك', body: 'اسم، منطقة، رقم واتساب، وفئاتك.' },
    { title: 'أضف منتجاتك', body: 'صور، أسعار بالدينار، ووصف بسيط.' },
    { title: 'استقبل طلبات واتساب', body: 'العملاء يتواصلون معك مباشرة، وتشوف كل طلب في لوحتك.' },
  ],
  pricing: {
    title: 'خطط بسيطة وواضحة',
    subtitle: 'اختر المدة اللي تناسبك. اشتراك ثابت — بدون نسبة على مبيعاتك.',
    toggle1: 'شهر واحد',
    toggle3: '٣ أشهر',
    save: 'وفّر {pct}٪',
    perMonth: '/ شهرياً',
    billed3: 'يُدفع {total} {currency} لكل ٣ أشهر',
    placeholder: '— د.ك',
    placeholderNote: 'الأسعار النهائية قريباً — الأرقام المعروضة مبدئية فقط.',
    cta: 'ابدأ الآن',
    customCta: 'تواصل معنا',
    popular: 'الأكثر اختياراً',
  },
  faqHeading: { title: 'أسئلة شائعة', subtitle: 'كل اللي تحتاج تعرفه قبل ما تبدأ.' },
  faqs: [
    { q: 'تأخذون عمولة على مبيعاتي؟', a: 'لا. مشروعي اشتراك ثابت فقط، وما ناخذ أي نسبة من مبيعاتك.' },
    { q: 'تتولّون الدفع والتوصيل؟', a: 'لا. العميل يتواصل معك مباشرة على واتساب، وتتفقون على الدفع والتوصيل بينكم.' },
    { q: 'كيف يلقاني العملاء؟', a: 'متجرك يظهر في دليل مشروعي داخل التطبيق، ويقدر العملاء يتصفحون منتجاتك حسب الفئة والمنطقة.' },
    { q: 'محتاج محل أو رخصة؟', a: 'لا، مشروعي مناسب للمشاريع المنزلية والصغيرة. تبدأ بمتجرك المصغّر مباشرة.' },
    { q: 'أقدر أغيّر أو ألغي اشتراكي؟', a: 'نعم، تقدر تبدّل خطتك أو توقف تجديد اشتراكك في أي وقت.' },
  ],
  finalCta: {
    title: 'جاهز تبدأ؟',
    subtitle: 'أنشئ متجرك اليوم وخلّ عملاء الكويت يلقونك.',
    cta: 'أنشئ متجرك',
  },
  footer: { tagline: 'دليل تجار الكويت + متاجر مصغّرة', signIn: 'عندك حساب؟ سجّل دخولك', rights: 'جميع الحقوق محفوظة' },
};

const EN: JoinCopy = {
  nav: { signIn: 'Sign in', cta: 'Create your store' },
  hero: {
    badge: 'Mshro3e for business · Kuwait',
    title: 'Grow your Kuwaiti business on Mshro3e',
    subtitle:
      'Put your products in front of thousands of customers across Kuwait and let them message you straight on WhatsApp. No commission, and none of the payment or delivery hassle.',
    ctaPrimary: 'Create your store',
    ctaSecondary: 'How it works',
    note: 'Free for customers · Set up in minutes',
  },
  trust: ['Kuwaiti vendors', 'WhatsApp contact', 'No commission on sales'],
  featuresHeading: {
    title: 'Why Mshro3e?',
    subtitle: 'Everything you need to get discovered and talk to customers — without the complexity.',
  },
  features: [
    { icon: 'search', title: 'Customers find you free', body: 'Shoppers browse the Kuwaiti vendor directory in the Mshro3e app at no cost.' },
    { icon: 'whatsapp', title: 'WhatsApp leads', body: 'One tap and the customer is messaging you directly on WhatsApp — no middleman.' },
    { icon: 'store', title: 'Your own mini-store', body: 'A page with your name, products, photos and area — ready to share.' },
    { icon: 'chart', title: 'Simple analytics', body: 'See how many customers reached you via Mshro3e — clear proof of the platform’s value.' },
    { icon: 'percent', title: 'No commission', body: 'We never take a cut of your sales. A flat subscription, and the rest is yours.' },
    { icon: 'shield', title: 'No payment or delivery', body: 'Mshro3e never touches payment or delivery — you arrange it directly with your customer.' },
  ],
  stepsHeading: { title: 'How it works', subtitle: 'From sign-up to your first lead — just four steps.' },
  steps: [
    { title: 'Sign up', body: 'Email and password — no paperwork.' },
    { title: 'Set up your store', body: 'Name, area, WhatsApp number and your categories.' },
    { title: 'Add your products', body: 'Photos, prices in KWD and a short description.' },
    { title: 'Get WhatsApp leads', body: 'Customers message you directly, and every lead shows in your dashboard.' },
  ],
  pricing: {
    title: 'Simple, clear plans',
    subtitle: 'Pick the term that suits you. A flat subscription — no cut of your sales.',
    toggle1: '1 month',
    toggle3: '3 months',
    save: 'Save {pct}%',
    perMonth: '/ month',
    billed3: 'Billed {total} {currency} every 3 months',
    placeholder: '— KWD',
    placeholderNote: 'Final pricing is coming soon — the numbers shown are placeholders.',
    cta: 'Get started',
    customCta: 'Contact us',
    popular: 'Most popular',
  },
  faqHeading: { title: 'Frequently asked questions', subtitle: 'Everything you need to know before you start.' },
  faqs: [
    { q: 'Do you take a commission on my sales?', a: 'No. Mshro3e is a flat subscription only — we never take a percentage of your sales.' },
    { q: 'Do you handle payment and delivery?', a: 'No. The customer contacts you directly on WhatsApp, and you agree payment and delivery between yourselves.' },
    { q: 'How do customers find me?', a: 'Your store appears in the Mshro3e directory inside the app, where customers browse products by category and area.' },
    { q: 'Do I need a shop or a license?', a: 'No — Mshro3e is built for home and small businesses. You start with your mini-store right away.' },
    { q: 'Can I change or cancel my plan?', a: 'Yes, you can switch plans or stop renewing your subscription at any time.' },
  ],
  finalCta: {
    title: 'Ready to start?',
    subtitle: 'Create your store today and let Kuwaiti customers find you.',
    cta: 'Create your store',
  },
  footer: { tagline: 'Kuwait vendor directory + mini-stores', signIn: 'Have an account? Sign in', rights: 'All rights reserved' },
};

export function getJoinCopy(locale: Locale): JoinCopy {
  return locale === 'en' ? EN : AR;
}
