'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  Tags,
  MessageSquare,
  Wallet,
  Settings,
  UserCheck,
  CreditCard,
  ShoppingBag,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDict, type Locale } from '@/i18n/dict';

interface NavItem {
  href: string;
  labelKey: keyof ReturnType<typeof getDict>['nav'];
  icon: React.ComponentType<{ className?: string }>;
  /** Sub-route prefixes to treat as active. */
  matches?: string[];
}

const items: NavItem[] = [
  { href: '/overview', labelKey: 'overview', icon: LayoutDashboard },
  { href: '/vendors', labelKey: 'vendorsAll', icon: Store, matches: ['/vendors'] },
  { href: '/vendors/pending', labelKey: 'vendorsPending', icon: UserCheck },
  { href: '/products', labelKey: 'products', icon: Package },
  { href: '/subscriptions', labelKey: 'subscriptions', icon: CreditCard },
  { href: '/orders', labelKey: 'orders', icon: ShoppingBag },
  { href: '/users', labelKey: 'users', icon: Users },
  { href: '/categories', labelKey: 'categories', icon: Tags },
  { href: '/reviews', labelKey: 'reviews', icon: MessageSquare },
  { href: '/payouts', labelKey: 'payouts', icon: Wallet },
  { href: '/settings', labelKey: 'settings', icon: Settings },
];

export function Sidebar({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? '';
  const t = getDict(locale).nav;
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const isActive = (item: NavItem) => {
    // Exact-match items (the pending queue lives under /vendors but is its own nav row).
    if (item.href === '/vendors/pending') return pathname === '/vendors/pending';
    // "All vendors" owns /vendors and every sub-route EXCEPT the pending queue.
    if (item.href === '/vendors') {
      return (
        (pathname === '/vendors' || pathname.startsWith('/vendors/')) &&
        pathname !== '/vendors/pending'
      );
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <aside
      className={cn(
        'sticky top-0 self-start h-dvh shrink-0 border-e border-ink-200 bg-white/80 backdrop-blur-md flex flex-col',
        collapsed ? 'w-[76px]' : 'w-[244px]',
        'transition-[width] duration-200',
      )}
      aria-label="القائمة الجانبية"
    >
      <div className="flex items-center justify-between gap-2 px-4 h-16 border-b border-ink-200">
        <Link href="/overview" className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-navy-900 text-white font-bold text-[15px] shrink-0">
            م
          </span>
          {!collapsed ? (
            <span className="flex flex-col min-w-0">
              <span className="text-[14px] font-bold text-ink-900 truncate">{getDict(locale).brand}</span>
              <span className="text-[11px] text-ink-500 truncate">Admin</span>
            </span>
          ) : null}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
          className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-ink-500 hover:bg-navy-50 hover:text-ink-900 transition-colors shrink-0"
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hidden">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href as never}
                  className={cn(
                    'group relative flex items-center gap-3 h-10 rounded-[10px] px-3 text-[14px] font-medium transition-colors',
                    active
                      ? 'bg-navy-900 text-white shadow-[var(--shadow-elev1)]'
                      : 'text-ink-900 hover:bg-navy-50',
                    collapsed && 'justify-center px-0',
                  )}
                  title={collapsed ? t[item.labelKey] : undefined}
                >
                  <Icon className={cn('size-[18px] shrink-0', active ? 'text-white' : 'text-ink-500 group-hover:text-ink-900')} />
                  {!collapsed ? <span className="truncate">{t[item.labelKey]}</span> : null}
                  {active && !collapsed ? (
                    <span className="ms-auto inline-flex h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed ? (
        <div className="m-3 rounded-[12px] border border-navy-200 bg-navy-50/60 p-3">
          <p className="text-[12px] font-semibold text-ink-900">{getDict(locale).brand}</p>
          <p className="text-[11px] text-ink-500 mt-0.5">{getDict(locale).brandTagline}</p>
        </div>
      ) : null}
    </aside>
  );
}
