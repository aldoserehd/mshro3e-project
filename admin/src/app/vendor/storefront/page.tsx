'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, ChevronDown, RefreshCw, Store, Phone, ImageIcon, Tags, Loader2 } from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { listCategories, saveStorefront, type StorefrontInput } from '@/lib/vendor/data';
import { KW_AREAS } from '@/lib/areas';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Category } from '@shared/types';

/**
 * Storefront form, rebuilt for non-technical home-business owners:
 * - ONE name + ONE bio field in the vendor's language (English optional,
 *   tucked behind a collapsible — auto-copied when left empty)
 * - Area is a dropdown of Kuwait areas (saved bilingually behind the scenes)
 * - Numbered steps, friendly hints, resilient categories with retry
 */
export default function StorefrontPage() {
  const { user, vendor, refresh } = useVendorAuth();
  const router = useRouter();
  const locale = useVendorLocale();
  const ar = locale === 'ar';

  const [cats, setCats] = React.useState<Category[] | null>(null);
  const [name, setName] = React.useState('');
  const [nameEn, setNameEn] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [bioEn, setBioEn] = React.useState('');
  const [areaId, setAreaId] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [logoImage, setLogoImage] = React.useState('');
  const [coverImage, setCoverImage] = React.useState('');
  const [categoryIds, setCategoryIds] = React.useState<string[]>([]);
  const [showEn, setShowEn] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');

  const loadCats = React.useCallback(() => {
    setCats(null);
    listCategories().then(setCats).catch(() => setCats([]));
  }, []);
  React.useEffect(() => { loadCats(); }, [loadCats]);

  // Prefill from the existing storefront.
  React.useEffect(() => {
    if (!vendor) return;
    setName((ar ? vendor.name?.ar : vendor.name?.en) || vendor.name?.ar || '');
    setNameEn(vendor.name?.en ?? '');
    setBio((ar ? vendor.bio?.ar : vendor.bio?.en) || vendor.bio?.ar || '');
    setBioEn(vendor.bio?.en ?? '');
    const match = KW_AREAS.find((a) => a.ar === vendor.address?.ar || a.en === vendor.address?.en);
    setAreaId(match?.id ?? '');
    setPhone(vendor.phone ?? '');
    setWhatsapp(vendor.whatsapp ?? '');
    setLogoImage(vendor.logoImage ?? '');
    setCoverImage(vendor.coverImage ?? '');
    setCategoryIds(vendor.categoryIds ?? []);
  }, [vendor, ar]);

  const toggleCat = (id: string) =>
    setCategoryIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || busy) return;
    if (!name.trim()) { setErr(ar ? 'اسم المتجر مطلوب.' : 'Store name is required.'); return; }
    if (!whatsapp.trim() && !phone.trim()) {
      setErr(ar ? 'رقم الواتساب مطلوب — هو طريقة وصول الطلبات لك.' : 'A WhatsApp number is required — it is how orders reach you.');
      return;
    }
    const area = KW_AREAS.find((a) => a.id === areaId);
    // Single-language entry maps to both locales; English overrides when provided.
    const input: StorefrontInput = {
      nameAr: ar ? name : (name || nameEn),
      nameEn: nameEn || name,
      bioAr: ar ? bio : (bio || bioEn),
      bioEn: bioEn || bio,
      addressAr: area?.ar ?? '',
      addressEn: area?.en ?? '',
      phone, whatsapp, logoImage, coverImage, categoryIds,
    };
    const isNew = !vendor;
    setBusy(true); setErr('');
    try {
      await saveStorefront(user.uid, vendor?.id ?? null, input);
      await refresh();
      toast.success(isNew
        ? (ar ? 'متجرك جاهز! 🎉 الخطوة الجاية: أضف أول منتج.' : 'Store created! 🎉 Next: add your first product.')
        : (ar ? 'تم حفظ التغييرات.' : 'Changes saved.'));
      router.replace(isNew ? '/vendor/products/new' : '/vendor');
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : (ar ? 'تعذّر الحفظ' : 'Could not save'));
    } finally {
      setBusy(false);
    }
  };

  const t = ar
    ? { title: vendor ? 'متجري' : 'إنشاء متجري', sub: 'ثلاث خطوات بس — وكل شي يتعدّل بعدين.',
        s1: 'عرّف متجرك', s2: 'كيف يوصلونك؟', s3: 'الصور والفئات',
        name: 'اسم المتجر', nameHint: 'مثال: حلويات أم سارة',
        bio: 'نبذة قصيرة', bioHint: 'سطر أو سطرين عن شغلك — مثال: حلويات بيت طازجة يومياً، توصيل لكل المناطق.',
        area: 'المنطقة', areaPick: 'اختر منطقتك…',
        en: 'إضافة نسخة إنجليزية (اختياري)', enHint: 'إذا تركتها فاضية بنستخدم نفس النص.',
        nameEn: 'الاسم بالإنجليزي', bioEn: 'النبذة بالإنجليزي',
        phone: 'الهاتف (اختياري)', wa: 'رقم الواتساب', waHint: 'هذا الرقم اللي توصله طلبات العملاء من التطبيق.',
        logo: 'رابط الشعار (اختياري)', cover: 'رابط صورة الغلاف (اختياري)',
        imgHint: 'الصق رابط صورة من انستقرام أو قوقل درايف أو أي موقع.',
        cats: 'وش تبيع؟', catsHint: 'اختر فئة أو أكثر عشان يلقاك العملاء.',
        noCats: 'الفئات ما تحمّلت.', retry: 'إعادة المحاولة',
        save: vendor ? 'حفظ التغييرات' : 'إنشاء المتجر 🚀' }
    : { title: vendor ? 'My storefront' : 'Create my store', sub: 'Just three steps — everything is editable later.',
        s1: 'Introduce your store', s2: 'How do customers reach you?', s3: 'Images & categories',
        name: 'Store name', nameHint: 'e.g. Umm Sara Sweets',
        bio: 'Short bio', bioHint: 'One or two lines about what you do — e.g. Fresh homemade desserts daily, delivery to all areas.',
        area: 'Area', areaPick: 'Pick your area…',
        en: 'Add Arabic/English version (optional)', enHint: 'Left empty, we reuse the same text.',
        nameEn: 'Name in English', bioEn: 'Bio in English',
        phone: 'Phone (optional)', wa: 'WhatsApp number', waHint: 'This is where customer orders arrive from the app.',
        logo: 'Logo URL (optional)', cover: 'Cover image URL (optional)',
        imgHint: 'Paste an image link from Instagram, Google Drive, or anywhere.',
        cats: 'What do you sell?', catsHint: 'Pick one or more so customers can find you.',
        noCats: 'Categories failed to load.', retry: 'Retry',
        save: vendor ? 'Save changes' : 'Create my store 🚀' };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-[28px] font-bold text-ink-900">{t.title}</h1>
        <p className="mt-1 text-[14px] text-ink-500">{t.sub}</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {err && (
          <div className="flex items-start gap-2 rounded-[12px] border border-red-300 bg-red-50 p-3 text-[13px] text-red-700">
            <AlertTriangle className="size-4 mt-0.5 shrink-0" />{err}
          </div>
        )}

        {/* STEP 1 — identity */}
        <Card className="p-5 flex flex-col gap-4">
          <StepTitle n="١" en="1" ar={ar} icon={<Store className="size-4" />} label={t.s1} />
          <Field label={t.name} hint={t.nameHint}>
            <Input dir="auto" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.nameHint} required />
          </Field>
          <Field label={t.bio} hint={t.bioHint}>
            <Textarea dir="auto" value={bio} onChange={(e) => setBio(e.target.value)} placeholder={t.bioHint} />
          </Field>
          <Field label={t.area}>
            <div className="relative">
              <select
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                className="h-10 w-full appearance-none rounded-[10px] border border-ink-200 bg-white px-3 text-[14px] text-ink-900 focus:border-navy-400 focus:outline-none"
              >
                <option value="">{t.areaPick}</option>
                {KW_AREAS.map((a) => (
                  <option key={a.id} value={a.id}>{ar ? a.ar : a.en}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-ink-500" />
            </div>
          </Field>

          <button type="button" onClick={() => setShowEn((s) => !s)} className="self-start text-[13px] font-semibold text-navy-600 hover:text-navy-800">
            {showEn ? '▾' : '▸'} {t.en}
          </button>
          {showEn && (
            <div className="grid gap-4 rounded-[12px] bg-navy-50/50 p-4">
              <p className="text-[12px] text-ink-500 -mb-2">{t.enHint}</p>
              <Field label={t.nameEn}><Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} /></Field>
              <Field label={t.bioEn}><Textarea value={bioEn} onChange={(e) => setBioEn(e.target.value)} /></Field>
            </div>
          )}
        </Card>

        {/* STEP 2 — contact */}
        <Card className="p-5 flex flex-col gap-4">
          <StepTitle n="٢" en="2" ar={ar} icon={<Phone className="size-4" />} label={t.s2} />
          <Field label={`${t.wa} *`} hint={t.waHint}>
            <Input dir="ltr" inputMode="tel" placeholder="+965 5000 0000" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </Field>
          <Field label={t.phone}>
            <Input dir="ltr" inputMode="tel" placeholder="+965 5000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
        </Card>

        {/* STEP 3 — media + categories */}
        <Card className="p-5 flex flex-col gap-4">
          <StepTitle n="٣" en="3" ar={ar} icon={<ImageIcon className="size-4" />} label={t.s3} />
          <p className="-mt-2 text-[12px] text-ink-500">{t.imgHint}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.logo}><Input dir="ltr" placeholder="https://…" value={logoImage} onChange={(e) => setLogoImage(e.target.value)} /></Field>
            <Field label={t.cover}><Input dir="ltr" placeholder="https://…" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} /></Field>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <Tags className="size-4 text-navy-600" />
            <span className="text-[14px] font-bold text-ink-900">{t.cats}</span>
            <span className="text-[12px] text-ink-500">— {t.catsHint}</span>
          </div>
          {cats === null ? (
            <div className="flex items-center gap-2 text-[13px] text-ink-500"><Loader2 className="size-4 animate-spin" />…</div>
          ) : cats.length === 0 ? (
            <button type="button" onClick={loadCats} className="inline-flex items-center gap-2 self-start rounded-[10px] border border-ink-200 px-3 py-2 text-[13px] font-semibold text-ink-900 hover:bg-navy-50">
              <RefreshCw className="size-3.5" /> {t.noCats} {t.retry}
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              {cats.map((cat) => {
                const on = categoryIds.includes(cat.id);
                return (
                  <button type="button" key={cat.id} onClick={() => toggleCat(cat.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 h-9 text-[13px] transition-colors ${on ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-ink-900 border-navy-200 hover:bg-navy-50'}`}>
                    {cat.emoji ? <span>{cat.emoji}</span> : null}{cat.name[locale] || cat.name.ar}
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={busy} loading={busy} size="lg">{t.save}</Button>
        </div>
      </form>
    </div>
  );
}

function StepTitle({ n, en, ar, icon, label }: { n: string; en: string; ar: boolean; icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-navy-900 text-[13px] font-bold text-white">{ar ? n : en}</span>
      <span className="inline-flex items-center gap-1.5 text-[15px] font-bold text-ink-900">{icon}{label}</span>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-[12px] text-ink-400">{hint}</p> : null}
    </div>
  );
}
