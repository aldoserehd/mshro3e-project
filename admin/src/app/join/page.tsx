import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Search,
  Store,
  BarChart3,
  Percent,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getJoinCopy, type Feature } from '@/lib/marketing/copy';
import { Pricing } from '@/components/marketing/pricing';
import { FaqList } from '@/components/marketing/faq';

export const metadata: Metadata = {
  title: 'مشروعي للأعمال · Mshro3e for business',
  description: 'انضم لمشروعي وخلّ عملاء الكويت يلقونك. Grow your Kuwaiti business on Mshro3e — WhatsApp leads, no commission.',
};

const FEATURE_ICON: Record<Feature['icon'], React.ComponentType<{ className?: string }>> = {
  search: Search,
  whatsapp: MessageCircle,
  store: Store,
  chart: BarChart3,
  percent: Percent,
  shield: ShieldCheck,
};

export default async function JoinPage() {
  const locale = await getLocale();
  const copy = getJoinCopy(locale);
  const ar = locale === 'ar';

  return (
    <div className="min-h-dvh bg-white text-ink-900">
      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href={'/join' as never} className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-[10px] bg-navy-900 text-[15px] font-bold text-white">م</span>
            <span className="text-[16px] font-bold">{ar ? 'مشروعي' : 'Mshro3e'}</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href={'/vendor/login' as never} className="hidden rounded-[10px] px-3 py-2 text-[14px] font-semibold text-navy-900 hover:bg-navy-50 sm:inline-block">
              {copy.nav.signIn}
            </Link>
            <Link href={'/vendor/login' as never} className="inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-navy-900 px-4 text-[14px] font-semibold text-white shadow-[var(--shadow-elev1)] transition-colors hover:bg-navy-700">
              {copy.nav.cta}
              <ArrowRight className={`size-4 ${ar ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-50 to-white" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-200 to-transparent" />
        <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-white px-3 py-1 text-[12px] font-semibold text-navy-700 shadow-[var(--shadow-elev1)]">
            <Sparkles className="size-3.5" />
            {copy.hero.badge}
          </span>
          <h1 className="mt-5 text-balance text-[36px] font-bold leading-[1.1] sm:text-[52px]">
            {copy.hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-[16px] leading-relaxed text-ink-500 sm:text-[18px]">
            {copy.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={'/vendor/login' as never} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-navy-900 px-6 text-[16px] font-semibold text-white shadow-[var(--shadow-elev2)] transition-colors hover:bg-navy-700 sm:w-auto">
              {copy.hero.ctaPrimary}
              <ArrowRight className={`size-5 ${ar ? 'rotate-180' : ''}`} />
            </Link>
            <a href="#how" className="inline-flex h-12 w-full items-center justify-center rounded-[12px] border border-navy-200 bg-white px-6 text-[16px] font-semibold text-navy-900 transition-colors hover:bg-navy-50 sm:w-auto">
              {copy.hero.ctaSecondary}
            </a>
          </div>
          <p className="mt-5 text-[13px] text-ink-500">{copy.hero.note}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {copy.trust.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-500">
                <Check className="size-4 text-emerald-600" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading title={copy.featuresHeading.title} subtitle={copy.featuresHeading.subtitle} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {copy.features.map((f, i) => {
            const Icon = FEATURE_ICON[f.icon];
            const isWa = f.icon === 'whatsapp';
            return (
              <div key={i} className="rounded-[18px] border border-ink-200 bg-white p-6 transition-shadow hover:shadow-[var(--shadow-elev2)]">
                <span className={`inline-flex size-11 items-center justify-center rounded-[12px] ${isWa ? 'bg-[#25D366]/10 text-[#1da851]' : 'bg-navy-50 text-navy-700'}`}>
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 text-[17px] font-bold">{f.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-500">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section id="how" className="scroll-mt-20 bg-navy-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading title={copy.stepsHeading.title} subtitle={copy.stepsHeading.subtitle} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.steps.map((s, i) => (
              <div key={i} className="relative rounded-[18px] border border-navy-100 bg-white p-6">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-navy-900 text-[15px] font-bold text-white tabular-nums">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-[16px] font-bold">{s.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────── */}
      <section id="pricing" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-20">
        <SectionHeading title={copy.pricing.title} subtitle={copy.pricing.subtitle} />
        <div className="mt-12">
          <Pricing locale={locale} copy={copy} />
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="bg-navy-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading title={copy.faqHeading.title} subtitle={copy.faqHeading.subtitle} />
          <div className="mt-12">
            <FaqList faqs={copy.faqs} />
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="relative overflow-hidden rounded-[24px] bg-navy-900 px-6 py-14 text-center text-white sm:px-12">
          <div className="bg-dot-navy pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
            <h2 className="text-balance text-[28px] font-bold sm:text-[36px]">{copy.finalCta.title}</h2>
            <p className="mx-auto mt-3 max-w-md text-balance text-[16px] text-navy-200">{copy.finalCta.subtitle}</p>
            <Link href={'/vendor/login' as never} className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-white px-7 text-[16px] font-semibold text-navy-900 shadow-[var(--shadow-elev2)] transition-transform hover:scale-[1.02]">
              {copy.finalCta.cta}
              <ArrowRight className={`size-5 ${ar ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-ink-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-[10px] bg-navy-900 text-[15px] font-bold text-white">م</span>
            <div className="text-start">
              <p className="text-[15px] font-bold">{ar ? 'مشروعي' : 'Mshro3e'}</p>
              <p className="text-[12px] text-ink-500">{copy.footer.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-ink-500">
            <Link href={'/vendor/login' as never} className="font-medium text-navy-700 hover:text-navy-900 hover:underline">
              {copy.footer.signIn}
            </Link>
            <span>© {new Date().getFullYear()} {ar ? 'مشروعي' : 'Mshro3e'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-balance text-[30px] font-bold sm:text-[38px]">{title}</h2>
      <p className="mx-auto mt-3 text-balance text-[16px] text-ink-500">{subtitle}</p>
    </div>
  );
}
