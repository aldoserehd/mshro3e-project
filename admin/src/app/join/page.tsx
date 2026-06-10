import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  Sparkles,
  Check,
  Wand2,
  MessageCircle,
  BarChart3,
  Camera,
  Megaphone,
  CalendarHeart,
  Mic,
  TrendingUp,
} from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { BRAND } from '@/lib/brand';
import { getJoinCopy, type Feature } from '@/lib/marketing/copy';
import { Pricing } from '@/components/marketing/pricing';
import { FaqList } from '@/components/marketing/faq';

export const metadata: Metadata = {
  title: `${BRAND.ar} للأعمال · ${BRAND.en} for business`,
  description: `موظّف تسويق ذكي لمشروعك الكويتي — متجر ثنائي اللغة بالذكاء الاصطناعي وطلبات واتساب. Grow your Kuwaiti business on ${BRAND.en} — AI-built store, WhatsApp leads, no commission.`,
};

const FEATURE_ICON: Record<Feature['icon'], React.ComponentType<{ className?: string }>> = {
  wand: Wand2,
  whatsapp: MessageCircle,
  report: BarChart3,
  camera: Camera,
  megaphone: Megaphone,
  calendar: CalendarHeart,
};

export default async function JoinPage() {
  const locale = await getLocale();
  const copy = getJoinCopy(locale);
  const ar = locale === 'ar';
  const Arrow = () => <ArrowRight className={`size-5 ${ar ? 'rotate-180' : ''}`} />;

  return (
    <div className="min-h-dvh bg-[#faf8ff] font-display text-ink-900">
      {/* ── Nav (transparent over the dark hero) ───────────── */}
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
          <Link href={'/join' as never} className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-[12px] bg-white/10 text-[15px] font-bold text-white ring-1 ring-white/20 backdrop-blur-sm">
              م
            </span>
            <span className="text-[17px] font-bold text-white">{BRAND.name(locale)}</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={'/vendor/login' as never}
              className="hidden rounded-[12px] px-3 py-2 text-[14px] font-semibold text-white/85 transition-colors hover:text-white sm:inline-block"
            >
              {copy.nav.signIn}
            </Link>
            <Link
              href={'/vendor/login' as never}
              className="inline-flex h-10 items-center gap-1.5 rounded-[12px] bg-white px-4 text-[14px] font-bold text-navy-900 shadow-[var(--shadow-elev2)] transition-transform hover:scale-[1.03]"
            >
              {copy.nav.cta}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero — deep navy, mesh + grain, chat demo ──────── */}
      <section className="join-hero join-noise relative overflow-hidden">
        <div className="bg-grid-navy pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-40">
          {/* Copy column */}
          <div className="text-center lg:text-start">
            <span className="rise rise-1 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-[#9db7ff] backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              {copy.hero.badge}
            </span>
            <h1 className="rise rise-2 mt-6 text-balance text-[38px] font-extrabold leading-[1.12] text-white sm:text-[54px]">
              {copy.hero.titleTop}
              <span className="mt-1 block bg-gradient-to-l from-[#9db7ff] via-[#c9d6ff] to-[#25D366] bg-clip-text text-transparent ltr:bg-gradient-to-r">
                {copy.hero.titleAccent}
              </span>
            </h1>
            <p className="rise rise-3 mx-auto mt-6 max-w-xl text-balance text-[16px] leading-[1.8] text-white/75 sm:text-[17px] lg:mx-0">
              {copy.hero.subtitle}
            </p>
            <div className="rise rise-4 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href={'/vendor/login' as never}
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#25D366] px-7 text-[16px] font-bold text-[#06250f] shadow-[0_8px_28px_rgba(37,211,102,0.35)] transition-transform hover:scale-[1.03] sm:w-auto"
              >
                {copy.hero.ctaPrimary}
                <Arrow />
              </Link>
              <a
                href="#pricing"
                className="inline-flex h-[52px] w-full items-center justify-center rounded-[14px] border border-white/20 bg-white/5 px-7 text-[16px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:w-auto"
              >
                {copy.hero.ctaSecondary}
              </a>
            </div>
            <p className="rise rise-5 mt-5 text-[13px] text-white/55">{copy.hero.note}</p>
          </div>

          {/* WhatsApp-style AI builder demo */}
          <div className="rise rise-4 relative mx-auto w-full max-w-[400px]">
            <div className="float-soft rounded-[26px] border border-white/12 bg-white/[0.07] p-2 shadow-[var(--shadow-elev4)] backdrop-blur-md">
              <div className="overflow-hidden rounded-[20px] bg-[#0b1426]">
                {/* chat header */}
                <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                    <Wand2 className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-bold text-white">{copy.hero.chat.title}</p>
                    <p className="text-[11px] text-[#25D366]">online</p>
                  </div>
                </div>
                {/* messages */}
                <div className="flex flex-col gap-2.5 px-3.5 py-4">
                  <ChatBubble side="out" className="chat-pop chat-pop-1">{copy.hero.chat.in1}</ChatBubble>
                  <ChatBubble side="out" className="chat-pop chat-pop-2">
                    <span className="inline-flex items-center gap-2">{copy.hero.chat.in2}</span>
                  </ChatBubble>
                  <ChatBubble side="out" className="chat-pop chat-pop-3">
                    <span className="inline-flex items-center gap-2.5">
                      <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/15">
                        <Mic className="size-3.5" />
                      </span>
                      <span className="flex items-center gap-[2.5px]" aria-hidden>
                        {[6, 11, 8, 14, 9, 13, 6, 10, 12, 7, 11, 5].map((h, i) => (
                          <span key={i} className="w-[3px] rounded-full bg-white/65" style={{ height: h }} />
                        ))}
                      </span>
                      <span className="text-[11px] opacity-80">{copy.hero.chat.voiceLabel}</span>
                    </span>
                  </ChatBubble>
                  <ChatBubble side="in" className="chat-pop chat-pop-4">{copy.hero.chat.out1}</ChatBubble>
                  {/* the generated store card */}
                  <div className="chat-pop chat-pop-5 me-auto w-[86%] overflow-hidden rounded-[14px] rounded-es-[4px] border border-white/12 bg-white shadow-[var(--shadow-elev3)]">
                    <div className="h-2 bg-gradient-to-l from-navy-500 to-[#001a41] ltr:bg-gradient-to-r" />
                    <div className="px-3.5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex size-9 items-center justify-center rounded-full bg-navy-50 text-[16px]">🍰</span>
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-bold text-ink-900">{copy.hero.chat.storeName}</p>
                          <p className="text-[11px] text-ink-500">{copy.hero.chat.storeArea}</p>
                        </div>
                        <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-[#25D366]/10 px-2 py-0.5 text-[10px] font-bold text-[#1da851]">
                          <Check className="size-3" /> {ar ? 'جاهز' : 'Live'}
                        </span>
                      </div>
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        {copy.hero.chat.storeProducts.map((p2, i) => (
                          <div key={i} className="rounded-[10px] border border-ink-200/80 bg-[#faf8ff] px-2.5 py-2">
                            <p className="truncate text-[11.5px] font-semibold text-ink-900">{p2.name}</p>
                            <p className="text-[11px] font-bold text-navy-700">{p2.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChatBubble side="in" className="chat-pop chat-pop-6">{copy.hero.chat.out2}</ChatBubble>
                </div>
              </div>
            </div>
            {/* glow under the card */}
            <div className="pointer-events-none absolute -inset-x-8 -bottom-10 h-24 rounded-full bg-[#415c9d]/40 blur-3xl" aria-hidden />
          </div>
        </div>

        {/* stats strip bleeding out of the hero */}
        <div className="relative border-t border-white/10 bg-white/[0.04] backdrop-blur-sm">
          <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-white/10 rtl:divide-x-reverse px-5">
            {copy.stats.map((s, i) => (
              <div key={i} className="px-4 py-6 text-center">
                <p className="text-[24px] font-extrabold text-white sm:text-[30px]">{s.value}</p>
                <p className="mt-0.5 text-[12px] text-white/60 sm:text-[13px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works — 3 steps ─────────────────────────── */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
        <SectionHeading title={copy.stepsHeading.title} subtitle={copy.stepsHeading.subtitle} />
        <div className="relative mt-14 grid gap-5 lg:grid-cols-3">
          {/* connector line (desktop) */}
          <div className="pointer-events-none absolute inset-x-16 top-[34px] hidden border-t-2 border-dashed border-navy-200 lg:block" aria-hidden />
          {copy.steps.map((s, i) => (
            <div key={i} className="relative rounded-[20px] border border-ink-200 bg-white p-7 shadow-[var(--shadow-elev1)] transition-shadow hover:shadow-[var(--shadow-elev3)]">
              <span className="relative inline-flex size-[52px] items-center justify-center rounded-[16px] bg-gradient-to-br from-navy-700 to-[#001a41] text-[20px] font-extrabold text-white shadow-[var(--shadow-elev2)]">
                {ar ? ['١', '٢', '٣'][i] : i + 1}
              </span>
              <h3 className="mt-5 text-[19px] font-bold">{s.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.75] text-ink-500">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI features ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#001a41] py-24">
        <div className="bg-dot-navy pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-32 start-1/4 size-[420px] rounded-full bg-[#415c9d]/30 blur-[120px]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9db7ff]/25 bg-[#9db7ff]/10 px-3.5 py-1.5 text-[12.5px] font-bold text-[#9db7ff]">
              <Sparkles className="size-3.5" />
              {copy.aiHeading.eyebrow}
            </span>
            <h2 className="mt-5 text-balance text-[30px] font-extrabold text-white sm:text-[40px]">
              {copy.aiHeading.title}
            </h2>
            <p className="mx-auto mt-4 text-balance text-[16px] leading-relaxed text-white/65">
              {copy.aiHeading.subtitle}
            </p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.features.map((f, i) => {
              const Icon = FEATURE_ICON[f.icon];
              const isWa = f.icon === 'whatsapp';
              return (
                <div
                  key={i}
                  className="group rounded-[20px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`inline-flex size-12 items-center justify-center rounded-[14px] ${
                        isWa ? 'bg-[#25D366]/15 text-[#25D366]' : 'bg-[#9db7ff]/12 text-[#9db7ff]'
                      }`}
                    >
                      <Icon className="size-6" />
                    </span>
                    <span className="rounded-full border border-white/12 px-2.5 py-1 text-[10.5px] font-bold text-white/55">
                      {f.tier}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[17px] font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-[1.75] text-white/60">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Proof of value ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-start">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-[12.5px] font-bold text-emerald-700">
              <TrendingUp className="size-3.5" />
              {copy.proof.eyebrow}
            </span>
            <h2 className="mt-5 text-balance text-[30px] font-extrabold sm:text-[38px]">{copy.proof.title}</h2>
            <p className="mt-4 text-balance text-[16px] leading-[1.8] text-ink-500">{copy.proof.subtitle}</p>
            <ul className="mt-7 space-y-3.5 text-start">
              {copy.proof.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-[14.5px] leading-relaxed text-ink-900">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* ROI dashboard mock card */}
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="pointer-events-none absolute -inset-6 rounded-[36px] bg-gradient-to-br from-navy-100 via-transparent to-emerald-100 blur-xl" aria-hidden />
            <div className="relative rounded-[24px] border border-ink-200 bg-white p-7 shadow-[var(--shadow-elev4)]">
              <p className="text-[12.5px] font-bold uppercase tracking-wide text-ink-500">{copy.proof.cardLabel}</p>
              <div className="mt-5 space-y-3.5">
                <RoiRow icon={<MessageCircle className="size-4.5" />} tone="wa" label={copy.proof.cardLeads} />
                <RoiRow icon={<Check className="size-4.5" />} tone="navy" label={copy.proof.cardSales} />
                <RoiRow icon={<TrendingUp className="size-4.5" />} tone="navy" label={copy.proof.cardValue} />
              </div>
              <div className="mt-6 rounded-[16px] bg-gradient-to-l from-emerald-500 to-[#25D366] p-[1.5px] ltr:bg-gradient-to-r">
                <div className="rounded-[14.5px] bg-emerald-50 px-5 py-4 text-center">
                  <p className="text-[28px] font-extrabold text-emerald-700">{copy.proof.cardMultiple}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section id="pricing" className="scroll-mt-20 border-y border-ink-200/60 bg-white py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading title={copy.pricing.title} subtitle={copy.pricing.subtitle} />
          <div className="mt-12">
            <Pricing locale={locale} copy={copy} />
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-24">
        <SectionHeading title={copy.faqHeading.title} subtitle={copy.faqHeading.subtitle} />
        <div className="mt-12">
          <FaqList faqs={copy.faqs} />
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="join-hero join-noise relative overflow-hidden rounded-[28px] px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="bg-grid-navy pointer-events-none absolute inset-0" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-[28px] font-extrabold text-white sm:text-[38px]">
              {copy.finalCta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-balance text-[16px] text-white/70">{copy.finalCta.subtitle}</p>
            <Link
              href={'/vendor/login' as never}
              className="mt-8 inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-[#25D366] px-8 text-[16px] font-bold text-[#06250f] shadow-[0_8px_28px_rgba(37,211,102,0.35)] transition-transform hover:scale-[1.03]"
            >
              {copy.finalCta.cta}
              <Arrow />
            </Link>
            <p className="mt-4 text-[12.5px] text-white/50">{copy.finalCta.note}</p>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-ink-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-[12px] bg-navy-900 text-[15px] font-bold text-white">م</span>
            <div className="text-start">
              <p className="text-[15px] font-bold">{BRAND.name(locale)}</p>
              <p className="text-[12px] text-ink-500">{copy.footer.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-ink-500">
            <Link href={'/vendor/login' as never} className="font-semibold text-navy-700 hover:text-navy-900 hover:underline">
              {copy.footer.signIn}
            </Link>
            <span>© {new Date().getFullYear()} {BRAND.name(locale)}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-balance text-[30px] font-extrabold sm:text-[38px]">{title}</h2>
      <p className="mx-auto mt-3 text-balance text-[16px] text-ink-500">{subtitle}</p>
    </div>
  );
}

/** WhatsApp-style bubble. `out` = the vendor (green, end-aligned), `in` = us. */
function ChatBubble({
  side,
  className,
  children,
}: {
  side: 'in' | 'out';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${className ?? ''} max-w-[86%] rounded-[14px] px-3.5 py-2.5 text-[13px] leading-relaxed ${
        side === 'out'
          ? 'ms-auto rounded-ee-[4px] bg-[#1f6f43] text-white'
          : 'me-auto rounded-es-[4px] bg-white/10 text-white/90'
      }`}
    >
      {children}
    </div>
  );
}

function RoiRow({ icon, tone, label }: { icon: React.ReactNode; tone: 'wa' | 'navy'; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-ink-200/70 bg-[#faf8ff] px-4 py-3">
      <span
        className={`inline-flex size-9 items-center justify-center rounded-full ${
          tone === 'wa' ? 'bg-[#25D366]/12 text-[#1da851]' : 'bg-navy-50 text-navy-700'
        }`}
      >
        {icon}
      </span>
      <p className="text-[15px] font-bold text-ink-900">{label}</p>
    </div>
  );
}
