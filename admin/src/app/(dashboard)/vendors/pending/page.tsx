import * as React from 'react';
import Link from 'next/link';
import { CheckCircle2, ClipboardCheck, MessageCircle, Package, Phone } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { listVendors } from '@/lib/data/vendors';
import { liveProducts } from '@/lib/data/live';
import { tFmt } from '@/i18n/dict';
import { PageHeader } from '@/components/domain/page-header';
import { VendorActionButton } from '@/components/domain/vendor-action-button';
import { approveVendor, rejectVendor } from '@/lib/actions/vendors';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils';

const initials = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export default async function VendorsPendingPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const [vendors, products] = await Promise.all([listVendors({ status: 'pending' }), liveProducts()]);
  const tag = locale === 'ar' ? 'ar-KW' : 'en-US';
  const productCount = (vendorId: string) => products.filter((p) => p.vendorId === vendorId).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t.vendors.pendingTitle}
        subtitle={t.vendors.pendingSubtitle}
        actions={
          vendors.length > 0 ? (
            <Badge tone="warning">{tFmt(t.vendors.pendingCount, { n: vendors.length })}</Badge>
          ) : undefined
        }
      />

      {vendors.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ClipboardCheck className="size-7" />}
            title={t.vendors.noPending}
            body={t.vendors.noPendingBody}
          />
        </Card>
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

              {/* What the reviewer actually needs: reachability + catalog readiness. */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-[10px] border border-ink-200 bg-navy-50/40 p-3">
                  <MessageCircle className="size-4 mx-auto text-navy-700" />
                  <div className="mt-1 text-[12px] font-medium truncate" dir="ltr">{v.whatsapp || '—'}</div>
                </div>
                <div className="rounded-[10px] border border-ink-200 bg-navy-50/40 p-3">
                  <Phone className="size-4 mx-auto text-navy-700" />
                  <div className="mt-1 text-[12px] font-medium truncate" dir="ltr">{v.phone || '—'}</div>
                </div>
                <div className="rounded-[10px] border border-ink-200 bg-navy-50/40 p-3">
                  <Package className="size-4 mx-auto text-navy-700" />
                  <div className="mt-1 text-[12px] font-medium tabular-nums">
                    {productCount(v.id)} {locale === 'ar' ? 'منتج' : 'products'}
                  </div>
                </div>
              </div>

              <Link
                href={`/vendors/${v.id}` as never}
                className="mt-3 inline-block text-[13px] font-medium text-navy-500 hover:text-navy-700"
              >
                {locale === 'ar' ? 'عرض الملف الكامل ←' : 'View full profile →'}
              </Link>

              <div className="mt-4 flex gap-2">
                <VendorActionButton
                  className="flex-1"
                  action={approveVendor.bind(null, v.id)}
                  confirm={t.vendors.approveConfirm}
                  success={t.vendors.approved}
                  failure={t.vendors.actionFailed}
                >
                  <CheckCircle2 className="size-4" />
                  {t.common.approve}
                </VendorActionButton>
                <VendorActionButton
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                  action={rejectVendor.bind(null, v.id)}
                  confirm={t.vendors.rejectConfirm}
                  success={t.vendors.rejected}
                  failure={t.vendors.actionFailed}
                >
                  {t.common.reject}
                </VendorActionButton>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
