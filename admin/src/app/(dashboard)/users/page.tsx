import * as React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict, tFmt } from '@/i18n/dict';
import { liveUsers } from '@/lib/data/live';
import { PageHeader } from '@/components/domain/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, THead, TBody, TRow, TH, TCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '؟';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const t = getDict(locale);
  const sp = await searchParams;
  const q = (sp.q ?? '').trim().toLowerCase();

  let users = await liveUsers();
  if (q) {
    users = users.filter(
      (u) =>
        (u.displayName ?? '').toLowerCase().includes(q) ||
        (u.email ?? '').toLowerCase().includes(q) ||
        (u.phone ?? '').includes(q),
    );
  }
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.users.title} subtitle={t.users.subtitle} />

      <Card className="p-4">
        <form className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Input name="q" defaultValue={sp.q ?? ''} placeholder={t.common.searchPlaceholder} className="lg:max-w-sm" />
          <Button type="submit" variant="secondary" size="sm" className="lg:ms-auto">{t.common.filter}</Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        {users.length === 0 ? (
          q ? (
            <EmptyState
              icon={<Users className="size-7" />}
              title={t.common.noResults}
              body={t.common.tryAdjusting}
              action={
                <Button asChild variant="secondary" size="sm">
                  <Link href="/users">{t.common.clearFilters}</Link>
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={<Users className="size-7" />}
              title={t.users.noUsers}
              body={t.users.noUsersBody}
            />
          )
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>{t.users.colName}</TH>
                <TH>{t.users.colContact}</TH>
                <TH>{t.users.colInterests}</TH>
                <TH>{t.users.colJoined}</TH>
              </TRow>
            </THead>
            <TBody>
              {users.map((u) => (
                <TRow key={u.id}>
                  <TCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-[11px] font-semibold text-navy-700">
                          {initials(u.displayName ?? u.email ?? '؟')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{u.displayName ?? '—'}</span>
                    </div>
                  </TCell>
                  <TCell>
                    <div className="flex flex-col">
                      <span className="text-[13px]">{u.email ?? '—'}</span>
                      {u.phone ? <span dir="ltr" className="text-[12px] text-ink-500">{u.phone}</span> : null}
                    </div>
                  </TCell>
                  <TCell>
                    <div className="flex flex-wrap gap-1">
                      {(u.interests ?? []).slice(0, 3).map((i) => (
                        <Badge key={i} tone="neutral">{i}</Badge>
                      ))}
                      {(u.interests ?? []).length === 0 ? <span className="text-ink-500">—</span> : null}
                    </div>
                  </TCell>
                  <TCell>{u.createdAt ? formatDate(u.createdAt, tag) : '—'}</TCell>
                </TRow>
              ))}
            </TBody>
          </Table>
        )}
        {users.length > 0 ? (
          <div className="border-t border-ink-200/70 px-5 py-3 text-[12px] text-ink-500">
            {tFmt(t.users.showingCount, { n: users.length })}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
