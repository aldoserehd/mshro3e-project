'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Globe, LogOut, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { getDict, type Locale } from '@/i18n/dict';
import { cn } from '@/lib/utils';

export interface TopbarProps {
  locale: Locale;
  user?: { displayName?: string; email?: string; role: string; photoURL?: string };
}

export function Topbar({ locale, user }: TopbarProps) {
  const t = getDict(locale);
  const router = useRouter();

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get('q')?.toString().trim();
    router.push((q ? `/vendors?q=${encodeURIComponent(q)}` : '/vendors') as never);
  };

  const toggleLocale = async () => {
    const next: Locale = locale === 'ar' ? 'en' : 'ar';
    document.cookie = `__mshro3e_locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  const logout = async () => {
    document.cookie = '__mshro3e_session=; path=/; max-age=0; SameSite=Lax';
    window.location.href = '/login';
  };

  const initials = (user?.displayName ?? user?.email ?? 'م').slice(0, 1).toUpperCase();
  const roleLabel =
    user?.role === 'owner' ? (locale === 'ar' ? 'مالك المنصة' : 'Platform Owner') : user?.role ?? '—';

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 h-16 px-5 border-b border-ink-200 bg-white/80 backdrop-blur-md">
      <form onSubmit={onSearch} className="relative flex-1 max-w-xl">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-ink-500 pointer-events-none" />
        <Input
          type="search"
          name="q"
          placeholder={t.common.searchPlaceholder}
          className="ps-10 h-10 bg-navy-50/60 border-navy-100 focus:bg-white"
        />
        <span className="hidden md:inline-flex absolute end-3 top-1/2 -translate-y-1/2 items-center gap-1 text-[10px] font-semibold text-ink-500 bg-white border border-navy-200 rounded px-1.5 py-0.5 pointer-events-none">
          ↵
        </span>
      </form>

      <Badge tone="brand" className="hidden md:inline-flex">{roleLabel}</Badge>

      <button
        type="button"
        onClick={toggleLocale}
        className="inline-flex items-center gap-1.5 h-9 rounded-[10px] px-2.5 text-[13px] font-medium text-ink-900 hover:bg-navy-50 transition-colors"
        aria-label="Switch language"
      >
        <Globe className="size-4 text-ink-500" />
        <span className="hidden sm:inline">{t.common.languageSwitch}</span>
      </button>

      <button
        type="button"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-ink-900 hover:bg-navy-50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        <span className="absolute top-2 end-2 inline-flex h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-2 h-10 rounded-full ps-1 pe-3 hover:bg-navy-50 transition-colors',
            )}
          >
            <Avatar className="h-8 w-8">
              {user?.photoURL ? <AvatarImage src={user.photoURL} alt={user.displayName ?? ''} /> : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:flex flex-col items-start min-w-0">
              <span className="text-[13px] font-semibold text-ink-900 leading-tight truncate max-w-[140px]">
                {user?.displayName ?? user?.email ?? '—'}
              </span>
              <span className="text-[11px] text-ink-500 leading-tight">{roleLabel}</span>
            </span>
            <ChevronDown className="size-3.5 text-ink-500 hidden sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[220px]">
          <DropdownMenuLabel>{t.common.account}</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => router.push('/settings' as never)}>
            {t.common.profile}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push('/settings' as never)}>
            {t.nav.settings}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onSelect={logout}>
            <LogOut className="size-4" />
            {t.common.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
