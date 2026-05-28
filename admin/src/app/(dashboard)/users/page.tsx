import * as React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { listUsers } from '@/lib/data/users';
import { PageHeader } from '@/components/domain/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, THead, TBody, TRow, TH, TCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatDate } from '@/lib/utils';

const pillCls = (active: boolean) =>
  cn(
    'inline-flex items-center h-9 rounded-full border px-4 text-[13px] font-medium',
    active ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-900 border-navy-200 hover:bg-navy-50',
  );

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

interface PageProps {
  searchParams: Promise<{ q?: string; banned?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const t = getDict(locale);
  const sp = await searchParams;
  const users = await listUsers({
    search: sp.q,
    banned: (sp.banned as 'all' | 'active' | 'banned') ?? 'all',
  });
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';
  const href = (o: Record<string, string>) => ({ pathname: '/users', query: { ...sp, ...o } });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.users.title} subtitle={t.users.subtitle} />

      <Card className="p-4">
        <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Input name="q" defaultValue={sp.q ?? ''} placeholder={t.common.searchPlaceholder} className="lg:max-w-sm" />
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'banned'] as const).map((s) => (
              <Link key={s} href={href({ banned: s })} className={pillCls((sp.banned ?? 'all') === s)}>
                {s === 'all' ? t.common.all : s === 'active' ? t.users.active : t.users.banned}
              </Link>
            ))}
          </div>
          <Button type="submit" variant="secondary" size="sm" className="lg:ms-auto">{t.common.filter}</Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        {users.length === 0 ? (
          <EmptyState icon={<Users className="size-7" />} title={t.users.noUsers} />
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>{t.users.colName}</TH>
                <TH>{t.users.colContact}</TH>
                <TH>{t.users.colJoined}</TH>
                <TH className="text-center">{t.users.colOrders}</TH>
                <TH>{t.users.colStatus}</TH>
              </TRow>
            </THead>
            <TBody>
              {users.map((u) => (
                <TRow key={u.uid}>
                  <TCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        {u.photoURL ? <AvatarImage src={u.photoURL} alt={u.displayName ?? ''} /> : null}
                        <AvatarFallback className="text-[11px] font-semibold text-navy-700">
                          {initials(u.displayName ?? '?')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{u.displayName}</span>
                    </div>
                  </TCell>
                  <TCell>
                    <div className="flex flex-col">
                      <span>{u.phone}</span>
                      <span className="text-[12px] text-ink-500">{u.email}</span>
                    </div>
                  </TCell>
                  <TCell>{formatDate(u.createdAt, tag)}</TCell>
                  <TCell className="text-center tabular-nums">{u.ordersCount}</TCell>
                  <TCell>
                    {u.banned ? (
                      <Badge tone="danger">{t.users.banned}</Badge>
                    ) : (
                      <Badge tone="success">{t.users.active}</Badge>
                    )}
                  </TCell>
                </TRow>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
