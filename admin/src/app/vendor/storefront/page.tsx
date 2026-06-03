'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { listCategories, saveStorefront, type StorefrontInput } from '@/lib/vendor/data';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Category } from '@shared/types';

export default function StorefrontPage() {
  const { user, vendor, refresh } = useVendorAuth();
  const router = useRouter();
  const locale = useVendorLocale();
  const ar = locale === 'ar';

  const [cats, setCats] = React.useState<Category[]>([]);
  const [form, setForm] = React.useState<StorefrontInput>({
    nameAr: '', nameEn: '', bioAr: '', bioEn: '', addressAr: '', addressEn: '',
    phone: '', whatsapp: '', logoImage: '', coverImage: '', categoryIds: [],
  });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');

  React.useEffect(() => { listCategories().then(setCats).catch(() => setCats([])); }, []);

  // Prefill from existing storefront.
  React.useEffect(() => {
    if (!vendor) return;
    setForm({
      nameAr: vendor.name?.ar ?? '', nameEn: vendor.name?.en ?? '',
      bioAr: vendor.bio?.ar ?? '', bioEn: vendor.bio?.en ?? '',
      addressAr: vendor.address?.ar ?? '', addressEn: vendor.address?.en ?? '',
      phone: vendor.phone ?? '', whatsapp: vendor.whatsapp ?? '',
      logoImage: vendor.logoImage ?? '', coverImage: vendor.coverImage ?? '',
      categoryIds: vendor.categoryIds ?? [],
    });
  }, [vendor]);

  const set = (k: keyof StorefrontInput, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggleCat = (id: string) =>
    setForm((f) => ({ ...f, categoryIds: f.categoryIds.includes(id) ? f.categoryIds.filter((x) => x !== id) : [...f.categoryIds, id] }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || busy) return;
    if (!form.nameAr.trim() && !form.nameEn.trim()) { setErr(ar ? 'الاسم مطلوب' : 'Name is required'); return; }
    if (!form.whatsapp.trim() && !form.phone.trim()) {
      setErr(ar ? 'رقم واتساب مطلوب — هو طريقة تواصل العملاء معك.' : 'A WhatsApp number is required — it is how customers reach you.');
      return;
    }
    const isNew = !vendor;
    setBusy(true); setErr('');
    try {
      await saveStorefront(user.uid, vendor?.id ?? null, form);
      await refresh();
      toast.success(
        isNew
          ? (ar ? 'تم إنشاء متجرك! 🎉 الخطوة الجاية: أضف منتجاتك.' : 'Store created! 🎉 Next: add your products.')
          : (ar ? 'تم حفظ التغييرات.' : 'Changes saved.'),
      );
      router.replace(isNew ? '/vendor/products/new' : '/vendor');
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : (ar ? 'تعذّر الحفظ' : 'Could not save'));
    } finally {
      setBusy(false);
    }
  };

  const t = ar
    ? { title: vendor ? 'متجري' : 'إنشاء متجري', nameAr: 'اسم المتجر (عربي)', nameEn: 'اسم المتجر (إنجليزي)',
        bioAr: 'نبذة (عربي)', bioEn: 'نبذة (إنجليزي)', addrAr: 'المنطقة (عربي)', addrEn: 'المنطقة (إنجليزي)',
        phone: 'الهاتف', wa: 'واتساب', logo: 'رابط الشعار', cover: 'رابط صورة الغلاف', cats: 'الفئات',
        save: 'حفظ المتجر', basics: 'الأساسيات', contact: 'التواصل', media: 'الصور',
        waHint: 'رقم واتساب هو طريقة العملاء للتواصل معك من التطبيق.',
        imgHint: 'الصق روابط صور (الخطة المجانية لا تدعم رفع الملفات).' }
    : { title: vendor ? 'My storefront' : 'Create storefront', nameAr: 'Store name (Arabic)', nameEn: 'Store name (English)',
        bioAr: 'Bio (Arabic)', bioEn: 'Bio (English)', addrAr: 'Area (Arabic)', addrEn: 'Area (English)',
        phone: 'Phone', wa: 'WhatsApp', logo: 'Logo URL', cover: 'Cover image URL', cats: 'Categories',
        save: 'Save storefront', basics: 'Basics', contact: 'Contact', media: 'Images',
        waHint: 'Your WhatsApp number is how customers contact you from the app.',
        imgHint: 'Paste image URLs (no file upload on the free plan).' };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h1 className="text-[28px] font-bold text-ink-900">{t.title}</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {err && (
          <div className="flex items-start gap-2 rounded-[12px] border border-red-300 bg-red-50 p-3 text-[13px] text-red-700">
            <AlertTriangle className="size-4 mt-0.5 shrink-0" />{err}
          </div>
        )}

        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-[15px] font-bold text-ink-900">{t.basics}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.nameAr}><Input dir="rtl" value={form.nameAr} onChange={(e) => set('nameAr', e.target.value)} required /></Field>
            <Field label={t.nameEn}><Input value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} /></Field>
            <Field label={t.addrAr}><Input dir="rtl" placeholder="السالمية" value={form.addressAr} onChange={(e) => set('addressAr', e.target.value)} /></Field>
            <Field label={t.addrEn}><Input placeholder="Salmiya" value={form.addressEn} onChange={(e) => set('addressEn', e.target.value)} /></Field>
            <Field label={t.bioAr}><Textarea dir="rtl" value={form.bioAr} onChange={(e) => set('bioAr', e.target.value)} /></Field>
            <Field label={t.bioEn}><Textarea value={form.bioEn} onChange={(e) => set('bioEn', e.target.value)} /></Field>
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-[15px] font-bold text-ink-900">{t.contact}</h3>
          <p className="-mt-2 text-[12px] text-ink-500">{t.waHint}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.phone}><Input dir="ltr" inputMode="tel" placeholder="+965 5000 0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
            <Field label={`${t.wa} *`}><Input dir="ltr" inputMode="tel" placeholder="+965 5000 0000" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} /></Field>
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-[15px] font-bold text-ink-900">{t.media}</h3>
          <p className="-mt-2 text-[12px] text-ink-500">{t.imgHint}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.logo}><Input dir="ltr" placeholder="https://…" value={form.logoImage} onChange={(e) => set('logoImage', e.target.value)} /></Field>
            <Field label={t.cover}><Input dir="ltr" placeholder="https://…" value={form.coverImage} onChange={(e) => set('coverImage', e.target.value)} /></Field>
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <h3 className="text-[15px] font-bold text-ink-900">{t.cats}</h3>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => {
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
          <Button type="submit" disabled={busy} loading={busy} size="lg">{t.save}</Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5"><Label>{label}</Label>{children}</div>;
}
