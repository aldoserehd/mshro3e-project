import { LoginCard } from './login-card';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { Sparkles, ShieldCheck, BarChart3 } from 'lucide-react';

export default async function LoginPage() {
  const locale = await getLocale();
  const t = getDict(locale);

  return (
    <main className="min-h-dvh grid lg:grid-cols-[1fr_minmax(400px,520px)]">
      {/* Hero panel — start side. With dir=rtl this is the right; with ltr the left. */}
      <section className="join-hero join-noise relative hidden lg:flex flex-col justify-between p-10 text-white overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid-navy opacity-60" />
        <div
          aria-hidden
          className="absolute -top-32 -end-32 size-[420px] rounded-full bg-gradient-to-br from-navy-500/40 via-navy-600/30 to-transparent blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -start-40 size-[520px] rounded-full bg-gradient-to-tr from-navy-700/40 via-navy-500/20 to-transparent blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-white text-navy-900 text-[18px] font-extrabold">
            م
          </span>
          <div className="flex flex-col">
            <span className="text-[18px] font-bold leading-none">{t.brand}</span>
            <span className="text-[12px] text-navy-300 mt-1">{t.brandTagline}</span>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-[44px] leading-[52px] font-bold text-white tracking-tight">
            {t.login.heroTitle}
          </h1>
          <p className="mt-3 text-[15px] leading-[24px] text-navy-200">{t.login.heroBody}</p>

          <ul className="mt-8 flex flex-col gap-3">
            {[
              { icon: ShieldCheck, label: t.login.heroFeatureVendors },
              { icon: BarChart3, label: t.login.heroFeatureCatalog },
              { icon: Sparkles, label: t.login.heroFeatureSubs },
            ].map((it) => {
              const Icon = it.icon;
              return (
                <li key={it.label} className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/10 backdrop-blur-sm border border-white/10">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-[14px] text-white">{it.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative text-[12px] text-navy-300">© 2026 {t.brand}</div>
      </section>

      {/* Form panel — end side */}
      <section className="flex items-center justify-center p-6 sm:p-10">
        <LoginCard locale={locale} />
      </section>
    </main>
  );
}
