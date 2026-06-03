'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useVendorLocale } from '@/components/vendor/shell';
import { createProduct, updateProduct, type ProductInput } from '@/lib/vendor/data';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Category } from '@shared/types';

export interface ProductFormInitial extends ProductInput {
  id: string;
}

export function ProductForm({
  vendorId,
  categories,
  initial,
}: {
  vendorId: string;
  categories: Category[];
  initial?: ProductFormInitial;
}) {
  const router = useRouter();
  const locale = useVendorLocale();
  const ar = locale === 'ar';

  const [form, setForm] = React.useState<ProductInput>(
    initial ?? { titleAr: '', titleEn: '', descAr: '', descEn: '', price: 0, prepHours: 0, images: [], categoryIds: [], active: true },
  );
  const [imagesText, setImagesText] = React.useState(initial?.images.join('\n') ?? '');
  const [priceText, setPriceText] = React.useState(initial ? String(initial.price) : '');
  const [prepText, setPrepText] = React.useState(initial && initial.prepHours ? String(initial.prepHours) : '');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');

  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleCat = (id: string) =>
    setForm((f) => ({ ...f, categoryIds: f.categoryIds.includes(id) ? f.categoryIds.filter((x) => x !== id) : [...f.categoryIds, id] }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const price = Number(priceText);
    if (!form.titleAr.trim() && !form.titleEn.trim()) { setErr(ar ? 'اسم المنتج مطلوب' : 'Title is required'); return; }
    if (!Number.isFinite(price) || price < 0) { setErr(ar ? 'سعر غير صحيح' : 'Invalid price'); return; }
    setBusy(true); setErr('');
    const input: ProductInput = {
      ...form,
      price,
      prepHours: Number(prepText) || 0,
      images: imagesText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (initial) await updateProduct(initial.id, input);
      else await createProduct(vendorId, input);
      router.replace('/vendor/products');
      router.refresh();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : (ar ? 'تعذّر الحفظ' : 'Could not save'));
    } finally {
      setBusy(false);
    }
  };

  const t = ar
    ? { titleAr: 'اسم المنتج (عربي)', titleEn: 'اسم المنتج (إنجليزي)', descAr: 'الوصف (عربي)', descEn: 'الوصف (إنجليزي)',
        price: 'السعر (د.ك)', prep: 'مدة التحضير (ساعات)', images: 'روابط الصور (رابط بكل سطر)', cats: 'الفئات',
        active: 'متاح للعرض', save: initial ? 'حفظ التعديلات' : 'نشر المنتج', details: 'التفاصيل', pricing: 'السعر', media: 'الصور' }
    : { titleAr: 'Title (Arabic)', titleEn: 'Title (English)', descAr: 'Description (Arabic)', descEn: 'Description (English)',
        price: 'Price (KWD)', prep: 'Prep time (hours)', images: 'Image URLs (one per line)', cats: 'Categories',
        active: 'Visible in app', save: initial ? 'Save changes' : 'Publish product', details: 'Details', pricing: 'Pricing', media: 'Images' };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 max-w-3xl">
      {err && (
        <div className="flex items-start gap-2 rounded-[12px] border border-red-300 bg-red-50 p-3 text-[13px] text-red-700">
          <AlertTriangle className="size-4 mt-0.5 shrink-0" />{err}
        </div>
      )}

      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-[15px] font-bold text-ink-900">{t.details}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.titleAr}><Input dir="rtl" value={form.titleAr} onChange={(e) => set('titleAr', e.target.value)} required /></Field>
          <Field label={t.titleEn}><Input value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)} /></Field>
          <Field label={t.descAr}><Textarea dir="rtl" value={form.descAr} onChange={(e) => set('descAr', e.target.value)} /></Field>
          <Field label={t.descEn}><Textarea value={form.descEn} onChange={(e) => set('descEn', e.target.value)} /></Field>
        </div>
      </Card>

      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-[15px] font-bold text-ink-900">{t.pricing}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.price}><Input dir="ltr" inputMode="decimal" value={priceText} onChange={(e) => setPriceText(e.target.value)} placeholder="5.500" required /></Field>
          <Field label={t.prep}><Input dir="ltr" inputMode="numeric" value={prepText} onChange={(e) => setPrepText(e.target.value)} placeholder="2" /></Field>
        </div>
        <label className="inline-flex items-center gap-2 text-[14px] cursor-pointer">
          <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} className="accent-navy-900 size-4" />
          {t.active}
        </label>
      </Card>

      <Card className="p-5 flex flex-col gap-3">
        <h3 className="text-[15px] font-bold text-ink-900">{t.media}</h3>
        <Field label={t.images}>
          <Textarea dir="ltr" className="min-h-[110px] font-mono text-[13px]" value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder={'https://images.unsplash.com/…\nhttps://…'} />
        </Field>
      </Card>

      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-[15px] font-bold text-ink-900">{t.cats}</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const on = form.categoryIds.includes(c.id);
            return (
              <button type="button" key={c.id} onClick={() => toggleCat(c.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 h-9 text-[13px] transition-colors ${on ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-ink-900 border-navy-200 hover:bg-navy-50'}`}>
                {c.emoji ? <span>{c.emoji}</span> : null}{c.name[locale]}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={busy} size="lg">{busy ? <Loader2 className="size-4 animate-spin" /> : null}{t.save}</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5"><Label>{label}</Label>{children}</div>;
}
