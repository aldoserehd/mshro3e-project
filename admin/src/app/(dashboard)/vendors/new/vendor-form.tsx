'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { createVendor, type ActionState } from '@/lib/actions/catalog';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Category } from '@shared/types';
import type { Locale } from '@/i18n/dict';

interface Props {
  locale: Locale;
  categories: Category[];
  configured: boolean;
}

const L = {
  ar: {
    section: 'بيانات البائع', nameAr: 'الاسم (عربي)', nameEn: 'الاسم (إنجليزي)',
    bioAr: 'نبذة (عربي)', bioEn: 'نبذة (إنجليزي)', addressAr: 'المنطقة (عربي)', addressEn: 'المنطقة (إنجليزي)',
    phone: 'رقم الهاتف', whatsapp: 'واتساب (إن اختلف)', logo: 'رابط الشعار', cover: 'رابط صورة الغلاف',
    cats: 'الفئات', verified: 'موثّق', save: 'حفظ البائع', media: 'الصور والروابط', contact: 'التواصل',
    noEnv: 'لم يتم ضبط حساب خدمة Firebase (FIREBASE_ADMIN_SERVICE_ACCOUNT). الحفظ لن يعمل حتى تضبطه في admin/.env.local.',
    hint: 'صورة الغلاف اختيارية. الصق رابط صورة (مثلاً من Unsplash).',
  },
  en: {
    section: 'Vendor details', nameAr: 'Name (Arabic)', nameEn: 'Name (English)',
    bioAr: 'Bio (Arabic)', bioEn: 'Bio (English)', addressAr: 'Area (Arabic)', addressEn: 'Area (English)',
    phone: 'Phone', whatsapp: 'WhatsApp (if different)', logo: 'Logo URL', cover: 'Cover image URL',
    cats: 'Categories', verified: 'Verified', save: 'Save vendor', media: 'Images & links', contact: 'Contact',
    noEnv: 'Firebase service account (FIREBASE_ADMIN_SERVICE_ACCOUNT) is not set. Saving will fail until you add it to admin/.env.local.',
    hint: 'Cover is optional. Paste an image URL (e.g. from Unsplash).',
  },
} as const;

export function VendorForm({ locale, categories, configured }: Props) {
  const t = L[locale];
  const [state, action, pending] = useActionState<ActionState, FormData>(createVendor, { ok: false });

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
        <h3 className="text-[15px] font-bold text-ink-900">{t.section}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.nameAr}><Input name="nameAr" dir="rtl" required /></Field>
          <Field label={t.nameEn}><Input name="nameEn" /></Field>
          <Field label={t.addressAr}><Input name="addressAr" dir="rtl" placeholder="السالمية" /></Field>
          <Field label={t.addressEn}><Input name="addressEn" placeholder="Salmiya" /></Field>
          <Field label={t.bioAr}><Textarea name="bioAr" dir="rtl" /></Field>
          <Field label={t.bioEn}><Textarea name="bioEn" /></Field>
        </div>
      </Card>

      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-[15px] font-bold text-ink-900">{t.contact}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.phone}><Input name="phone" inputMode="tel" placeholder="+965 5000 0000" /></Field>
          <Field label={t.whatsapp}><Input name="whatsapp" inputMode="tel" placeholder="+965 5000 0000" /></Field>
        </div>
      </Card>

      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-[15px] font-bold text-ink-900">{t.media}</h3>
        <p className="text-[12px] text-ink-500 -mt-2">{t.hint}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.logo}><Input name="logoImage" placeholder="https://…" /></Field>
          <Field label={t.cover}><Input name="coverImage" placeholder="https://…" /></Field>
        </div>
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
        <label className="inline-flex items-center gap-2 text-[14px] cursor-pointer mt-1">
          <input type="checkbox" name="verified" value="1" className="accent-navy-900 size-4" />
          {t.verified}
        </label>
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
