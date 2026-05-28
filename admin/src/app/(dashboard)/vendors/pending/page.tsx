import * as React from 'react';
import { CheckCircle2, ClipboardCheck, FileText, ImageIcon, IdCard } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { listVendors } from '@/lib/data/vendors';
import { PageHeader } from '@/components/domain/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';

const initials = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export default async function VendorsPendingPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const vendors = await listVendors({ status: 'pending' });
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.vendors.pendingTitle} subtitle={t.vendors.pendingSubtitle} />

      {vendors.length === 0 ? (
        <Card><EmptyState icon={<ClipboardCheck className="size-7" />} title={t.vendors.noVendors} /></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {vendors.map((v) => (
            <Card key={v.id} className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  {v.logoImage ? <AvatarImage src={v.logoImage} alt={v.name[locale]} /> : null}
                  <AvatarFallback className="text-[13px] font-semibold text-navy-700">
                    {initials(v.name.en)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[17px]">{v.name[locale]}</h3>
                  <p className="text-[12px] text-ink-500">
                    {v.address?.[locale]} · {t.vendors.joinedAt} {formatDate(v.createdAt, tag)}
                  </p>
                  {v.bio ? (
                    <p className="mt-2 text-[13px] text-ink-500 line-clamp-2">{v.bio[locale]}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-[10px] border border-ink-200 bg-navy-50/40 p-3">
                  <FileText className="size-4 mx-auto text-navy-700" />
                  <div className="mt-1 text-[12px] font-medium">{t.vendors.docsCR}</div>
                </div>
                <div className="rounded-[10px] border border-ink-200 bg-navy-50/40 p-3">
                  <IdCard className="size-4 mx-auto text-navy-700" />
                  <div className="mt-1 text-[12px] font-medium">{t.vendors.docsID}</div>
                </div>
                <div className="rounded-[10px] border border-ink-200 bg-navy-50/40 p-3">
                  <ImageIcon className="size-4 mx-auto text-navy-700" />
                  <div className="mt-1 text-[12px] font-medium">{t.vendors.docsPhotos}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button className="flex-1">
                  <CheckCircle2 className="size-4" />
                  {t.common.approve}
                </Button>
                <Button variant="ghost" className="text-red-600 hover:text-red-700">
                  {t.common.reject}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
