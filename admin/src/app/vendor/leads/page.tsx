'use client';

import * as React from 'react';
import Link from 'next/link';
import { Inbox, Loader2, Store, MessageCircle } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { listMyLeads, type Lead } from '@/lib/vendor/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VendorLeadsPage() {
  const { vendor } = useVendorAuth();
  const locale = useVendorLocale();
  const ar = locale === 'ar';
  const [leads, setLeads] = React.useState<Lead[] | null>(null);

  React.useEffect(() => {
    let alive = true;
    if (!vendor) { setLeads([]); return; }
    listMyLeads(vendor.id).then((l) => { if (alive) setLeads(l); }).catch(() => { if (alive) setLeads([]); });
    return () => { alive = false; };
  }, [vendor]);

  const when = (ts?: number) => {
    if (!ts) return '';
    try { return new Date(ts).toLocaleString(ar ? 'ar-KW' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch { return ''; }
  };

  if (!vendor) {
    return (
      <Card className="p-8 flex flex-col items-center text-center gap-3 max-w-lg">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-navy-50 text-navy-700"><Store className="size-6" /></span>
        <p className="text-[15px] text-ink-900">{ar ? 'أنشئ متجرك أول شي.' : 'Create your storefront first.'}</p>
        <Button asChild><Link href={'/vendor/storefront' as never}>{ar ? 'إنشاء المتجر' : 'Create storefront'}</Link></Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-bold text-ink-900">{ar ? 'الطلبات' : 'Leads'}</h1>
        <p className="mt-1 text-[14px] text-ink-500">
          {ar ? 'العملاء اللي تواصلوا معك عبر واتساب من تطبيق مشروعي.' : 'Customers who contacted you via WhatsApp from the Mshro3e app.'}
        </p>
      </div>

      {leads === null ? (
        <Card className="p-10 flex justify-center"><Loader2 className="size-6 animate-spin text-navy-600" /></Card>
      ) : leads.length === 0 ? (
        <Card className="p-10 flex flex-col items-center text-center gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-navy-50 text-navy-700"><Inbox className="size-6" /></span>
          <p className="text-[15px] text-ink-900">{ar ? 'ما وصلتك طلبات بعد' : 'No leads yet'}</p>
          <p className="text-[13px] text-ink-500 max-w-sm">{ar ? 'بمجرد ما يضغط عميل «اطلب عبر واتساب» على منتجك، بيظهر هنا.' : 'As soon as a customer taps “Order via WhatsApp” on your product, it shows here.'}</p>
        </Card>
      ) : (
        <>
          <Card className="flex items-center gap-3 p-4">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><MessageCircle className="size-5" /></span>
            <p className="text-[15px] text-ink-900">
              <span className="font-bold tabular-nums">{leads.length}</span>{' '}
              {ar ? 'عميل تواصل معك عبر مشروعي' : 'customers reached you via Mshro3e'}
            </p>
          </Card>
          <div className="grid gap-3">
            {leads.map((l) => (
              <Card key={l.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink-900 truncate">{l.productTitle || (ar ? 'منتج' : 'Product')}</p>
                  <p className="text-[13px] text-ink-500">{when(l.createdAt)}{l.note ? ` · ${l.note}` : ''}</p>
                </div>
                <span className="rounded-full bg-navy-50 px-2.5 py-1 text-[12px] font-mono text-navy-700 shrink-0">{l.ref}</span>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
