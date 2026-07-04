'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  Package,
  Inbox,
  CreditCard,
  LogOut,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRAND } from '@/lib/brand';
import { useVendorAuth } from '@/lib/vendor/auth';

export type VLocale = 'ar' | 'en';

export function useVendorLocale(): VLocale {
  const [locale] = React.useState<VLocale>(() =>
    typeof document !== 'undefined' && document.documentElement.lang.startsWith('en') ? 'en' : 'ar',
  );
  return locale;
}

const NAV: { href: string; icon: React.ComponentType<{ className?: string }>; ar: string; en: string }[] = [
  { href: '/vendor', icon: LayoutDashboard, ar: 'الرئيسية', en: 'Dashboard' },
  { href: '/vendor/storefront', icon: Store, ar: 'متجري', en: 'Storefront' },
  { href: '/vendor/products', icon: Package, ar: 'منتجاتي', en: 'Products' },
  { href: '/vendor/leads', icon: Inbox, ar: 'الطلبات', en: 'Leads' },
  { href: '/vendor/subscription', icon: CreditCard, ar: 'اشتراكي', en: 'Subscription' },
];

export function VendorShell({ children }: { children: React.ReactNode }) {
  const { ready, loading, user, vendor, signOut } = useVendorAuth();
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const locale = useVendorLocale();

  // Redirect signed-out visitors from an effect — never during render.
  const mustRedirect = ready && !loading && !user && pathname !== '/vendor/login';
  React.useEffect(() => {
    if (mustRedirect) router.replace('/vendor/login');
  }, [mustRedirect, router]);

  // Login route renders bare (no shell, no guard).
  if (pathname === '/vendor/login') return <>{children}</>;

  if (!ready) {
    return (
      <Centered>
        <p className="text-[15px] text-ink-900 max-w-sm text-center">
          {locale === 'ar'
            ? 'لم يتم ضبط إعدادات Firebase (NEXT_PUBLIC_FIREBASE_*) في admin/.env.local.'
            : 'Firebase is not configured (NEXT_PUBLIC_FIREBASE_*) in admin/.env.local.'}
        </p>
      </Centered>
    );
  }

  if (loading) {
    return (
      <Centered>
        <Loader2 className="size-6 animate-spin text-navy-600" />
      </Centered>
    );
  }

  if (!user) {
    return <Centered><Loader2 className="size-6 animate-spin text-navy-600" /></Centered>;
  }

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 self-start h-dvh w-[230px] shrink-0 border-e border-ink-200 bg-white flex flex-col">
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-ink-200">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-white ring-1 ring-ink-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark.png" alt="Mshro3e" className="h-7 w-7 object-contain" />
          </span>
          <span className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold text-ink-900 truncate">{BRAND.name(locale)}</span>
            <span className="text-[11px] text-ink-500 truncate">{locale === 'ar' ? 'لوحة البائع' : 'Vendor'}</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = item.href === '/vendor' ? pathname === '/vendor' : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href as never}
                    className={cn(
                      'group flex items-center gap-3 h-10 rounded-[10px] px-3 text-[14px] font-medium transition-colors',
                      active ? 'bg-navy-900 text-white' : 'text-ink-900 hover:bg-navy-50',
                    )}
                  >
                    <Icon className={cn('size-[18px] shrink-0', active ? 'text-white' : 'text-ink-500 group-hover:text-ink-900')} />
                    <span className="truncate">{locale === 'ar' ? item.ar : item.en}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-ink-200 p-3">
          <p className="px-1 text-[12px] text-ink-500 truncate mb-2">{vendor ? (vendor.name[locale] || vendor.name.en) : user.email}</p>
          <button
            type="button"
            onClick={async () => { await signOut(); router.replace('/vendor/login'); }}
            className="flex w-full items-center gap-2 h-9 rounded-[10px] px-3 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="size-4" />
            {locale === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {vendor?.status === 'pending' && (
          <div className="mb-5 rounded-[12px] border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
            {locale === 'ar'
              ? 'متجرك قيد المراجعة — بيظهر للعملاء في التطبيق أول ما نعتمده (عادةً خلال ٢٤ ساعة). تقدر تجهّز منتجاتك الحين.'
              : 'Your store is under review — it appears to customers once approved (usually within 24 hours). You can add your products meanwhile.'}
          </div>
        )}
        {vendor?.status === 'suspended' && (
          <div className="mb-5 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-900">
            {locale === 'ar'
              ? 'متجرك موقوف حالياً وغير ظاهر للعملاء. تواصل مع الدعم لمعرفة السبب.'
              : 'Your store is currently suspended and hidden from customers. Contact support for details.'}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh items-center justify-center p-6">{children}</div>;
}
