'use client';

import * as React from 'react';
import { useActionState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Store } from 'lucide-react';
import { createProduct, type ActionState } from '@/lib/actions/catalog';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Category, Vendor } from '@shared/types';
import type { Locale } from '@/i18n/dict';

interface Props {
  locale: Locale;
  categories: Category[];
  vendors: Vendor[];
  configured: boolean;
}

const L = {
  ar: {
    vendor: 'البائع', titleAr: 'اسم المنتج (عربي)', titleEn: 'اسم المنتج (إنجليزي)',
    descAr: 'الوصف (عربي)', descEn: 'الوصف (إنجليزي)', price: 'السعر (د.ك)', prep: 'مدة التحضير (ساعات)',
    images: 'روابط الصور (رابط في كل سطر)', cats: 'الفئات', save: 'نشر المنتج',
    details: 'تفاصيل المنتج', pricing: 'السعر والتحضير', media: 'الصور',
    noEnv: 'لم يتم ضبط FIREBASE_ADMIN_SERVICE_ACCOUNT — الحفظ لن يعمل حتى تضبطه في admin/.env.local.',
    noVendors: 'لا يوجد بائعون بعد. أضف بائعاً أولاً.', addVendor: 'إضافة بائع',
    imgHint: 'مافي رفع ملفات (الخطة المجانية). الصق روابط صور، رابط بكل سطر.',
  },
  en: {
    vendor: 'Vendor', titleAr: 'Title (Arabic)', titleEn: 'Title (English)',
    descAr: 'Description (Arabic)', descEn: 'Description (English)', price: 'Price (KWD)', prep: 'Prep time (hours)',
    images: 'Image URLs (one per line)', cats: 'Categories', save: 'Publish product',
    details: 'Product details', pricing: 'Price & prep', media: 'Images',
    noEnv: 'FIREBASE_ADMIN_SERVICE_ACCOUNT is not set — saving will fail until you add it to admin/.env.local.',
    noVendors: 'No vendors yet. Add a vendor first.', addVendor: 'Add vendor',
    imgHint: 'No file upload on the free plan. Paste image URLs, one per line.',
  },
} as const;

export function ProductForm({ locale, categories, vendors, configured }: Props) {
  const t = L[locale];
  const [state, action, pending] = useActionState<ActionState, FormData>(createProduct, { ok: false });

  if (vendors.length === 0) {
    return (
      <Card className="p-8 flex flex-col items-center text-center gap-3">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-navy-50 text-navy-700"><Store className="size-6" /></span>
        <p className="text-[15px] text-ink-900">{t.noVendors}</p>
        <Button asChild><Link href={'/vendors/new' as never}>{t.addVendor}</Link></Button>
      </Card>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5 max-w-3xl">
      {!configured && (
        <div className="flex items-start gap-2 rounded-[12px] border border-amber-300 bg-amber-50 p-3 text-[13px] text-amber-900">
          <AlertTriangle className="size-4 mt-0.5 shrink-0" />
          <span>{t.noEnv}</span>
        </div>
      )}
      {state.error && (
        <div className="rounded-[12px] border border-red-300 bg-red-50 p-3 text-[13px] text-red-700">{state.error}</div>
      )}

      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-[15px] font-bold text-ink-900">{t.details}</h3>
        <Field label={t.vendor}>
          <select name="vendorId" required className="h-10 w-full rounded-[10px] border border-navy-200 bg-white px-3 text-[15px] text-ink-900 focus:border-navy-600 focus:outline-none">
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name[locale] || v.name.en}</option>
            ))}
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.titleAr}><Input name="titleAr" dir="rtl" required /></Field>
          <Field label={t.titleEn}><Input name="titleEn" /></Field>
          <Field label={t.descAr}><Textarea name="descAr" dir="rtl" /></Field>
          <Field label={t.descEn}><Textarea name="descEn" /></Field>
        </div>
      </Card>

      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-[15px] font-bold text-ink-900">{t.pricing}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.price}><Input name="price" inputMode="decimal" required placeholder="5.500" /></Field>
          <Field label={t.prep}><Input name="prepHours" inputMode="numeric" placeholder="2" /></Field>
        </div>
      </Card>

      <Card className="p-5 flex flex-col gap-3">
        <h3 className="text-[15px] font-bold text-ink-900">{t.media}</h3>
        <p className="text-[12px] text-ink-500 -mt-1">{t.imgHint}</p>
        <Field label={t.images}>
          <Textarea name="images" className="min-h-[110px] font-mono text-[13px]" placeholder={'https://images.unsplash.com/…\nhttps://…'} />
        </Field>
      </Card>

      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-[15px] font-bold text-ink-900">{t.cats}</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <label key={c.id} className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white px-3 h-9 text-[13px] cursor-pointer hover:bg-navy-50">
              <input type="checkbox" name="categoryIds" value={c.id} className="accent-navy-900" />
              {c.emoji ? <span>{c.emoji}</span> : null}
              {c.name[locale]}
            </label>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={pending} size="lg">{t.save}</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
