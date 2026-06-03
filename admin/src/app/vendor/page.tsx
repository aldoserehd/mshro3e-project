'use client';

import * as React from 'react';
import Link from 'next/link';
import { Store, Package, Inbox, Plus, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { listMyProducts, listMyLeads } from '@/lib/vendor/data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function VendorDashboardPage() {
  const { loading, vendor } = useVendorAuth();
  const locale = useVendorLocale();
  const [counts, setCounts] = React.useState<{ products: number; leads: number } | null>(null);

  React.useEffect(() => {
    let alive = true;
    if (!vendor) { setCounts(null); return; }
    (async () => {
      try {
        const [p, l] = await Promise.all([listMyProducts(vendor.id), listMyLeads(vendor.id)]);
        if (alive) setCounts({ products: p.length, leads: l.length });
      } catch {
        if (alive) setCounts({ products: 0, leads: 0 });
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
        <h1 className="text-[28px] font-bold text-ink-900">{ar ? 'حيّاك في مشروعي 👋' : 'Welcome to Mshro3e 👋'}</h1>
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

      {counts && counts.products === 0 && (
        <Card className="flex flex-wrap items-center justify-between gap-4 border-navy-200 bg-navy-50 p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-navy-900 text-white"><Package className="size-6" /></span>
            <div>
              <p className="text-[15px] font-semibold text-ink-900">{ar ? 'الخطوة الجاية: أضف منتجاتك' : 'Next step: add your products'}</p>
              <p className="text-[13px] text-ink-500">{ar ? 'متجرك جاهز — ضيف منتجاتك عشان يلقاك العملاء.' : 'Your store is ready — add products so customers can find you.'}</p>
            </div>
          </div>
          <Button asChild><Link href={'/vendor/products/new' as never}><Plus className="size-4" />{ar ? 'أضف منتج' : 'Add a product'}</Link></Button>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={<Package className="size-5" />} label={ar ? 'المنتجات' : 'Products'} value={counts?.products} href="/vendor/products" />
        <Stat icon={<Inbox className="size-5" />} label={ar ? 'الطلبات (واتساب)' : 'Leads (WhatsApp)'} value={counts?.leads} href="/vendor/leads" highlight />
        <Stat icon={<Store className="size-5" />} label={ar ? 'التقييم' : 'Rating'} value={vendor.rating ?? 0} href="/vendor/storefront" />
      </div>

      <div className="rounded-[16px] border border-ink-200 bg-white p-5">
        <p className="text-[13px] text-ink-500">
          {ar
            ? 'الطلبات هي عدد العملاء اللي تواصلوا معك عبر واتساب من تطبيق مشروعي — دليل قيمة المنصة لك.'
            : 'Leads are customers who contacted you via WhatsApp from the Mshro3e app — your proof of value.'}
        </p>
      </div>
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
