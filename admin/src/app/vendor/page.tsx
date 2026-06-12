'use client';

import * as React from 'react';
import Link from 'next/link';
import { Store, Package, Inbox, Plus, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { BRAND } from '@/lib/brand';
import { useVendorLocale } from '@/components/vendor/shell';
import { listMyProducts, listMyLeads } from '@/lib/vendor/data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function VendorDashboardPage() {
  const { loading, vendor } = useVendorAuth();
  const locale = useVendorLocale();
  const [counts, setCounts] = React.useState<{ products: number; leads: number; soldKwd: number } | null>(null);

  React.useEffect(() => {
    let alive = true;
    if (!vendor) { setCounts(null); return; }
    (async () => {
      try {
        const [p, l] = await Promise.all([listMyProducts(vendor.id), listMyLeads(vendor.id)]);
        const soldKwd = l.filter((x) => x.status === 'sold').reduce((s, x) => s + (x.saleAmount ?? 0), 0);
        if (alive) setCounts({ products: p.length, leads: l.length, soldKwd });
      } catch {
        if (alive) setCounts({ products: 0, leads: 0, soldKwd: 0 });
      }
    })();
    return () => { alive = false; };
  }, [vendor]);

  const ar = locale === 'ar';

  // Still resolving auth/vendor doc → spinner (avoids a flash of the onboarding CTA).
  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-navy-600" aria-label="loading" />
      </div>
    );
  }

  // No storefront yet → onboarding CTA.
  if (!vendor) {
    return (
      <div className="max-w-xl">
        <h1 className="text-[28px] font-bold text-ink-900">{ar ? `حيّاك في ${BRAND.ar} 👋` : `Welcome to ${BRAND.en} 👋`}</h1>
        <p className="mt-1 text-[15px] text-ink-500">
          {ar ? 'أنشئ متجرك أول شي، وبعدها ضيف منتجاتك.' : 'Create your storefront first, then add your products.'}
        </p>
        <div className="mt-6 rounded-[16px] border border-ink-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-navy-50 text-navy-700"><Store className="size-6" /></span>
            <div>
              <p className="text-[15px] font-semibold text-ink-900">{ar ? 'أنشئ متجرك' : 'Set up your storefront'}</p>
              <p className="text-[13px] text-ink-500">{ar ? 'الاسم، المنطقة، واتساب، الفئات.' : 'Name, area, WhatsApp, categories.'}</p>
            </div>
          </div>
          <Button asChild className="mt-5"><Link href={'/vendor/storefront' as never}>{ar ? 'إنشاء المتجر' : 'Create storefront'}<ArrowRight className="size-4" /></Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-ink-900">{vendor.name[locale] || vendor.name.en}</h1>
          <p className="mt-1 inline-flex items-center gap-1.5 text-[14px] text-emerald-600">
            <CheckCircle2 className="size-4" /> {ar ? 'متجرك يعمل' : 'Store is live'}
          </p>
        </div>
        <Button asChild><Link href={'/vendor/products/new' as never}><Plus className="size-4" />{ar ? 'منتج جديد' : 'New product'}</Link></Button>
      </div>

      {counts && (counts.products === 0 || counts.leads === 0) && (
        <Card className="border-navy-200 bg-navy-50/60 p-5">
          <p className="mb-3 text-[15px] font-bold text-ink-900">
            {ar ? 'خارطة طريقك 🚀' : 'Your roadmap 🚀'}
          </p>
          <div className="flex flex-col gap-2.5">
            <ChecklistRow done label={ar ? 'أنشأت متجرك' : 'Store created'} />
            <ChecklistRow
              done={counts.products > 0}
              label={ar ? 'أضف أول منتج' : 'Add your first product'}
              href="/vendor/products/new"
              cta={ar ? 'أضف منتج' : 'Add product'}
            />
            <ChecklistRow
              done={counts.leads > 0}
              label={ar ? 'استقبل أول طلب واتساب' : 'Receive your first WhatsApp lead'}
              hint={ar ? 'شارك رابط متجرك في انستقرام وقروبات الواتساب' : 'Share your store on Instagram and WhatsApp groups'}
            />
          </div>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={<Package className="size-5" />} label={ar ? 'المنتجات' : 'Products'} value={counts?.products} href="/vendor/products" />
        <Stat icon={<Inbox className="size-5" />} label={ar ? 'الطلبات (واتساب)' : 'Leads (WhatsApp)'} value={counts?.leads} href="/vendor/leads" highlight />
        <Stat icon={<Store className="size-5" />} label={ar ? 'التقييم' : 'Rating'} value={vendor.rating ?? 0} href="/vendor/storefront" />
      </div>

      {/* Value banner — leads framed as money, links to the Lead Inbox. */}
      <Link
        href={'/vendor/leads' as never}
        className="group relative overflow-hidden rounded-[18px] bg-gradient-to-l from-[#001a41] to-navy-700 p-6 text-white transition-transform hover:scale-[1.005] ltr:bg-gradient-to-r"
      >
        <div className="bg-dot-navy pointer-events-none absolute inset-0" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-[#9db7ff]">
              {ar ? `قيمتك من ${BRAND.ar}` : `Your value from ${BRAND.en}`}
            </p>
            <p className="mt-1.5 text-[24px] font-bold leading-tight">
              {counts && counts.soldKwd > 0
                ? (ar ? `${counts.soldKwd} د.ك مبيعات موثّقة 💰` : `KD ${counts.soldKwd} in tracked sales 💰`)
                : counts && counts.leads > 0
                  ? (ar ? `${counts.leads} عميل تواصلوا معك` : `${counts.leads} customers reached you`)
                  : (ar ? 'طلباتك بتظهر هنا' : 'Your leads will show here')}
            </p>
            <p className="mt-1 text-[13px] text-white/65">
              {ar
                ? 'علّم طلباتك «تم البيع» في صندوق الطلبات — وشوف كم رجّعت لك المنصة.'
                : 'Mark leads "Sold" in your Lead Inbox — and see what the platform returns.'}
            </p>
          </div>
          <span className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-white/10 px-5 text-[14px] font-bold ring-1 ring-white/20 backdrop-blur-sm transition-colors group-hover:bg-white/20">
            {ar ? 'افتح صندوق الطلبات' : 'Open Lead Inbox'}
            <ArrowRight className={`size-4 ${ar ? 'rotate-180' : ''}`} />
          </span>
        </div>
      </Link>
    </div>
  );
}

function ChecklistRow({ done, label, hint, href, cta }: { done?: boolean; label: string; hint?: string; href?: string; cta?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${done ? 'bg-emerald-500 text-white' : 'border-2 border-ink-200 bg-white text-transparent'}`}>
        ✓
      </span>
      <span className={`text-[14px] ${done ? 'text-ink-500 line-through' : 'font-semibold text-ink-900'}`}>{label}</span>
      {!done && hint ? <span className="hidden text-[12px] text-ink-500 sm:inline">— {hint}</span> : null}
      {!done && href && cta ? (
        <Link href={href as never} className="ms-auto rounded-full bg-navy-900 px-3 py-1.5 text-[12px] font-bold text-white hover:bg-navy-700">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

function Stat({ icon, label, value, href, highlight }: { icon: React.ReactNode; label: string; value: number | undefined; href: string; highlight?: boolean }) {
  return (
    <Link href={href as never} className="rounded-[16px] border border-ink-200 bg-white p-5 hover:border-navy-300 transition-colors">
      <span className={`inline-flex size-10 items-center justify-center rounded-full ${highlight ? 'bg-emerald-50 text-emerald-600' : 'bg-navy-50 text-navy-700'}`}>{icon}</span>
      <p className="mt-3 text-[28px] font-bold text-ink-900 tabular-nums">{value === undefined ? <Loader2 className="size-5 animate-spin text-ink-300" /> : value}</p>
      <p className="text-[13px] text-ink-500">{label}</p>
    </Link>
  );
}
