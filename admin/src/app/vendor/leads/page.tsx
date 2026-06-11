'use client';

import * as React from 'react';
import { Inbox, Store, MessageCircle, Check, TrendingUp, Wallet } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { BRAND } from '@/lib/brand';
import { useVendorLocale } from '@/components/vendor/shell';
import { listMyLeads, updateLeadStatus, type Lead, type LeadStatus } from '@/lib/vendor/data';
import { PLANS } from '@/lib/marketing/plans';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { LoadingState, EmptyState, ErrorState } from '@/components/vendor/states';
import { toast } from 'sonner';

/**
 * Lead Inbox — the mini-CRM. Every WhatsApp lead is a card the vendor moves
 * New → Replied → Sold (with a KWD amount). The summary header translates
 * activity into money ("X× what you paid") — the platform's proof of value.
 */
export default function VendorLeadsPage() {
  const { vendor } = useVendorAuth();
  const locale = useVendorLocale();
  const ar = locale === 'ar';
  const [leads, setLeads] = React.useState<Lead[] | null>(null);
  const [error, setError] = React.useState(false);
  const [busyId, setBusyId] = React.useState<string | null>(null);

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

  const setStatus = async (lead: Lead, status: LeadStatus) => {
    let amount: number | null = null;
    if (status === 'sold') {
      const raw = window.prompt(
        ar ? 'كم كان مبلغ البيع بالدينار؟ (اختياري — اتركه فاضي إذا تبين)' : 'Sale amount in KWD? (optional — leave empty to skip)',
        '',
      );
      if (raw === null) return; // cancelled
      const parsed = parseFloat(raw.replace(/[^\d.]/g, ''));
      amount = Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
    setBusyId(lead.id);
    try {
      await updateLeadStatus(lead.id, status, amount);
      setLeads((prev) =>
        prev ? prev.map((l) => (l.id === lead.id ? { ...l, status, saleAmount: status === 'sold' ? amount : null } : l)) : prev,
      );
      toast.success(
        status === 'sold'
          ? (ar ? '💰 مبروك البيعة!' : '💰 Sale logged!')
          : (ar ? 'تم التحديث' : 'Updated'),
      );
    } catch {
      toast.error(ar ? 'ما قدرنا نحدّث — حاول مرة ثانية.' : 'Could not update — try again.');
    } finally {
      setBusyId(null);
    }
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

  // ── value summary ──────────────────────────────────────────────
  const all = leads ?? [];
  const soldLeads = all.filter((l) => l.status === 'sold');
  const totalKwd = soldLeads.reduce((sum, l) => sum + (l.saleAmount ?? 0), 0);
  // Compare against the Basic monthly price — the cheapest paid tier.
  const basicPrice = PLANS.find((p) => p.id === 'basic')?.priceMonth1 ?? 6;
  const multiple = totalKwd > 0 ? Math.round((totalKwd / basicPrice) * 10) / 10 : null;
  const fmtKwd = (n: number) => (ar ? `${n} د.ك` : `KD ${n}`);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-bold text-ink-900">{ar ? 'صندوق الطلبات' : 'Lead Inbox'}</h1>
        <p className="mt-1 text-[14px] text-ink-500">
          {ar
            ? `كل عميل وصلك من ${BRAND.ar} — علّم الطلب «تم الرد» أو «تم البيع» وشوف قيمة المنصة بالدينار.`
            : `Every customer who reached you via ${BRAND.en} — mark leads replied or sold and see the platform's value in KWD.`}
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
          {/* Value summary strip */}
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="flex items-center gap-3 p-4">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><MessageCircle className="size-5" /></span>
              <div>
                <p className="text-[22px] font-bold leading-none text-ink-900 tabular-nums">{all.length}</p>
                <p className="mt-1 text-[12px] text-ink-500">{ar ? 'طلب واتساب' : 'WhatsApp leads'}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-3 p-4">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700"><Check className="size-5" /></span>
              <div>
                <p className="text-[22px] font-bold leading-none text-ink-900 tabular-nums">{soldLeads.length}</p>
                <p className="mt-1 text-[12px] text-ink-500">{ar ? 'بيعة مأكّدة' : 'confirmed sales'}</p>
              </div>
            </Card>
            <Card className={cn('flex items-center gap-3 p-4', totalKwd > 0 && 'border-emerald-200 bg-emerald-50/50')}>
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Wallet className="size-5" /></span>
              <div>
                <p className="text-[22px] font-bold leading-none text-ink-900 tabular-nums">{fmtKwd(totalKwd)}</p>
                <p className="mt-1 text-[12px] text-ink-500">
                  {multiple !== null
                    ? (ar ? `≈ ×${multiple} من اشتراك «أساسي»` : `≈ ${multiple}× a Basic subscription`)
                    : (ar ? 'علّم مبيعاتك عشان نحسبها' : 'mark sales to count them')}
                </p>
              </div>
            </Card>
          </div>

          {/* Lead cards */}
          <div className="grid gap-3">
            {leads.map((l) => {
              const status: LeadStatus = l.status === 'sold' ? 'sold' : l.status === 'replied' ? 'replied' : 'new';
              const busy = busyId === l.id;
              return (
                <Card key={l.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
                  <div className="min-w-0 flex-1 basis-48">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-ink-900">{l.productTitle || (ar ? 'منتج' : 'Product')}</p>
                      {status === 'sold' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                          <Check className="size-3" />
                          {l.saleAmount ? fmtKwd(l.saleAmount) : (ar ? 'تم البيع' : 'Sold')}
                        </span>
                      )}
                      {status === 'replied' && (
                        <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-bold text-navy-700">
                          {ar ? 'تم الرد' : 'Replied'}
                        </span>
                      )}
                      {status === 'new' && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                          {ar ? 'جديد' : 'New'}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[13px] text-ink-500">{when(l.createdAt)}{l.note ? ` · ${l.note}` : ''}</p>
                  </div>

                  <span className="shrink-0 rounded-full bg-navy-50 px-2.5 py-1 font-mono text-[12px] text-navy-700" title={ar ? 'ابحث عن هذا الرقم في واتساب لتلقى المحادثة' : 'Search WhatsApp for this code to find the chat'}>
                    {l.ref}
                  </span>

                  <div className="flex shrink-0 items-center gap-1.5">
                    {status !== 'replied' && status !== 'sold' && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setStatus(l, 'replied')}
                        className="rounded-[10px] border border-ink-200 px-3 py-1.5 text-[12.5px] font-semibold text-ink-900 transition-colors hover:bg-navy-50 disabled:opacity-50"
                      >
                        {ar ? 'رديت عليه' : 'Mark replied'}
                      </button>
                    )}
                    {status !== 'sold' && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setStatus(l, 'sold')}
                        className="inline-flex items-center gap-1 rounded-[10px] bg-emerald-600 px-3 py-1.5 text-[12.5px] font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <TrendingUp className="size-3.5" />
                        {ar ? 'تم البيع 💰' : 'Mark sold 💰'}
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
