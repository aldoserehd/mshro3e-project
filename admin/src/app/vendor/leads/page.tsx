'use client';

import * as React from 'react';
import Link from 'next/link';
import { Inbox, Store, MessageCircle } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { listMyLeads, type Lead } from '@/lib/vendor/data';
import { Card } from '@/components/ui/card';
import { LoadingState, EmptyState, ErrorState } from '@/components/vendor/states';

export default function VendorLeadsPage() {
  const { vendor } = useVendorAuth();
  const locale = useVendorLocale();
  const ar = locale === 'ar';
  const [leads, setLeads] = React.useState<Lead[] | null>(null);
  const [error, setError] = React.useState(false);

  const load = React.useCallback(() => {
    if (!vendor) { setLeads([]); return; }
    setLeads(null); setError(false);
    listMyLeads(vendor.id).then(setLeads).catch(() => { setError(true); setLeads([]); });
  }, [vendor]);

  React.useEffect(() => { load(); }, [load]);

  const when = (ts?: number) => {
    if (!ts) return '';
    try { return new Date(ts).toLocaleString(ar ? 'ar-KW' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch { return ''; }
  };

  if (!vendor) {
    return (
      <EmptyState
        icon={<Store className="size-6" />}
        title={ar ? 'أنشئ متجرك أول شي' : 'Create your storefront first'}
        hint={ar ? 'بعد إنشاء متجرك وإضافة منتجاتك، بتبدأ تستقبل طلبات واتساب.' : 'Once your store and products are live, WhatsApp leads start coming in.'}
        ctaLabel={ar ? 'إنشاء المتجر' : 'Create storefront'}
        ctaHref="/vendor/storefront"
      />
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
        <LoadingState />
      ) : error ? (
        <ErrorState title={ar ? 'تعذّر تحميل الطلبات.' : 'Could not load leads.'} retryLabel={ar ? 'إعادة المحاولة' : 'Retry'} onRetry={load} />
      ) : leads.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-6" />}
          title={ar ? 'ما وصلتك طلبات بعد' : 'No leads yet'}
          hint={ar ? 'بمجرد ما يضغط عميل «اطلب عبر واتساب» على منتجك، بيظهر هنا.' : 'As soon as a customer taps “Order via WhatsApp” on your product, it shows here.'}
        />
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
