'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AlertTriangle, ChevronDown, RefreshCw, Store, Phone, ImageIcon, Tags,
  Loader2, Sparkles, MessageCircle, MapPin, Eye,
} from 'lucide-react';
import { useVendorAuth } from '@/lib/vendor/auth';
import { authClient } from '@/lib/firebase-client';
import { useVendorLocale } from '@/components/vendor/shell';
import { listCategories, saveStorefront, suggestCategory, type StorefrontInput } from '@/lib/vendor/data';
import { fetchCategoriesAction } from '@/lib/actions/catalog';
import { KW_AREAS } from '@/lib/areas';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Category } from '@shared/types';

/** Keep only digits, max 8 — Kuwait local number (after the fixed +965). */
const kwDigits = (s: string) => s.replace(/\D/g, '').replace(/^965/, '').slice(0, 8);

export default function StorefrontPage() {
  const { user, vendor, refresh } = useVendorAuth();
  const router = useRouter();
  const locale = useVendorLocale();
  const ar = locale === 'ar';

  const [cats, setCats] = React.useState<Category[] | null>(null);
  const [catsErr, setCatsErr] = React.useState('');
  const [name, setName] = React.useState('');
  const [nameEn, setNameEn] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [bioEn, setBioEn] = React.useState('');
  const [areaId, setAreaId] = React.useState('');
  const [phone, setPhone] = React.useState('');       // 8 local digits
  const [whatsapp, setWhatsapp] = React.useState(''); // 8 local digits
  const [logoImage, setLogoImage] = React.useState('');
  const [logoZoom, setLogoZoom] = React.useState(1);
  const [coverImage, setCoverImage] = React.useState('');
  const [categoryIds, setCategoryIds] = React.useState<string[]>([]);
  const [showEn, setShowEn] = React.useState(false);
  const [suggestion, setSuggestion] = React.useState('');
  const [suggestBusy, setSuggestBusy] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [aiBusy, setAiBusy] = React.useState(false);
  const [err, setErr] = React.useState('');

  // Client SDK first; Admin-SDK server action as the reliable fallback.
  const loadCats = React.useCallback(async () => {
    setCats(null); setCatsErr('');
    try {
      const viaClient = await listCategories();
      if (viaClient.length > 0) { setCats(viaClient); return; }
    } catch { /* fall through */ }
    try {
      setCats(await fetchCategoriesAction());
    } catch (e) {
      setCats([]);
      setCatsErr(e instanceof Error ? e.message : 'load failed');
    }
  }, []);
  React.useEffect(() => { loadCats(); }, [loadCats]);

  React.useEffect(() => {
    if (!vendor) return;
    setName((ar ? vendor.name?.ar : vendor.name?.en) || vendor.name?.ar || '');
    setNameEn(vendor.name?.en ?? '');
    setBio((ar ? vendor.bio?.ar : vendor.bio?.en) || vendor.bio?.ar || '');
    setBioEn(vendor.bio?.en ?? '');
    const match = KW_AREAS.find((a) => a.ar === vendor.address?.ar || a.en === vendor.address?.en);
    setAreaId(match?.id ?? '');
    setPhone(kwDigits(vendor.phone ?? ''));
    setWhatsapp(kwDigits(vendor.whatsapp ?? ''));
    setLogoImage(vendor.logoImage ?? '');
    setLogoZoom(vendor.logoZoom ?? 1);
    setCoverImage(vendor.coverImage ?? '');
    setCategoryIds(vendor.categoryIds ?? []);
  }, [vendor, ar]);

  const toggleCat = (id: string) =>
    setCategoryIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  /** ✨ One tap: AI writes/translates name + bio in BOTH languages. */
  const onAiFill = async () => {
    if (aiBusy) return;
    if (!name.trim()) { setErr(ar ? 'اكتب اسم متجرك أولاً — والذكاء الاصطناعي يكمل الباقي.' : 'Type your store name first — AI does the rest.'); return; }
    setAiBusy(true); setErr('');
    try {
      const token = await authClient().currentUser?.getIdToken();
      const area = KW_AREAS.find((a) => a.id === areaId);
      const res = await fetch('/api/ai/storefront', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, bio, area: area?.ar }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(
          data.error === 'quota_exceeded'
            ? (ar ? `وصلت حد الذكاء الاصطناعي (${data.limit}/شهر) — رقِّ خطتك.` : `AI limit reached (${data.limit}/mo) — upgrade your plan.`)
            : data.error === 'ai_not_configured'
              ? (ar ? 'ميزة الذكاء الاصطناعي غير مفعّلة بعد.' : 'AI is not configured yet.')
              : (ar ? 'تعذّر التوليد، حاول مرة ثانية.' : 'Generation failed, try again.'),
        );
        return;
      }
      setName(ar ? data.nameAr : data.nameEn);
      setNameEn(data.nameEn);
      setBio(ar ? data.bioAr : data.bioEn);
      setBioEn(data.bioEn);
      setShowEn(true);
      toast.success(ar ? `✨ جاهز بالعربي والإنجليزي! (${data.used}/${data.limit})` : `✨ Done in both languages! (${data.used}/${data.limit})`);
    } catch {
      setErr(ar ? 'تعذّر الاتصال بالخادم.' : 'Could not reach the server.');
    } finally {
      setAiBusy(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || busy) return;
    if (!name.trim()) { setErr(ar ? 'اسم المتجر مطلوب.' : 'Store name is required.'); return; }
    if (whatsapp.length !== 8) {
      setErr(ar ? 'رقم الواتساب لازم يكون ٨ أرقام (بدون 965+).' : 'WhatsApp number must be 8 digits (without +965).');
      return;
    }
    const area = KW_AREAS.find((a) => a.id === areaId);
    const input: StorefrontInput = {
      nameAr: ar ? name : (nameEn && name !== nameEn ? name : name),
      nameEn: nameEn || name,
      bioAr: ar ? bio : (bioEn ? bio : bio),
      bioEn: bioEn || bio,
      addressAr: area?.ar ?? '',
      addressEn: area?.en ?? '',
      phone: phone.length === 8 ? `+965${phone}` : '',
      whatsapp: `+965${whatsapp}`,
      logoImage, logoZoom, coverImage, categoryIds,
    };
    // When the vendor works in English, keep AR fields sensible.
    if (!ar) { input.nameAr = nameEn ? name : name; input.bioAr = bio; }
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
    ? { title: vendor ? 'متجري' : 'إنشاء متجري', sub: 'اكتب بأي لغة — والذكاء الاصطناعي يجهّز اللغة الثانية. المعاينة على اليسار تتحدث أول بأول.',
        s1: 'عرّف متجرك', s2: 'كيف يوصلونك؟', s3: 'الصور والفئات',
        name: 'اسم المتجر', nameHint: 'مثال: حلويات أم سارة',
        bio: 'نبذة قصيرة', bioHint: 'سطر أو سطرين عن شغلك.',
        area: 'المنطقة', areaPick: 'اختر منطقتك…',
        aiBtn: 'اكتبها لي بالعربي والإنجليزي ✨', aiHint: 'اكتب الاسم وكلمتين عن شغلك بأي لغة — وبنجهّز لك النسختين.',
        en: 'النسخة الإنجليزية (تتعبى تلقائياً)', nameEn: 'الاسم بالإنجليزي', bioEn: 'النبذة بالإنجليزي',
        phone: 'هاتف إضافي (اختياري)', wa: 'رقم الواتساب', waHint: '٨ أرقام — هذا اللي توصله الطلبات.',
        logo: 'رابط الشعار (اختياري)', cover: 'رابط صورة الغلاف (اختياري)',
        imgHint: 'الصق رابط صورة من الإنترنت — وشوف شكلها فوراً في المعاينة.',
        cats: 'وش تبيع؟', catsHint: 'اختر فئة أو أكثر.',
        noCats: 'الفئات ما تحمّلت', retry: 'إعادة المحاولة', noCatsYet: 'ما في فئات بعد — بتظهر أول ما يضيفها فريق المنصة.',
        preview: 'هكذا يشوفك العميل', save: vendor ? 'حفظ التغييرات' : 'إنشاء المتجر 🚀' }
    : { title: vendor ? 'My storefront' : 'Create my store', sub: 'Write in any language — AI prepares the other one. The preview updates live.',
        s1: 'Introduce your store', s2: 'How do customers reach you?', s3: 'Images & categories',
        name: 'Store name', nameHint: 'e.g. Umm Sara Sweets',
        bio: 'Short bio', bioHint: 'One or two lines about what you do.',
        area: 'Area', areaPick: 'Pick your area…',
        aiBtn: 'Write it in Arabic & English ✨', aiHint: 'Type the name and a few words in any language — we prepare both versions.',
        en: 'English version (auto-filled)', nameEn: 'Name in English', bioEn: 'Bio in English',
        phone: 'Extra phone (optional)', wa: 'WhatsApp number', waHint: '8 digits — this is where orders arrive.',
        logo: 'Logo URL (optional)', cover: 'Cover image URL (optional)',
        imgHint: 'Paste any image link — see it instantly in the preview.',
        cats: 'What do you sell?', catsHint: 'Pick one or more.',
        noCats: 'Categories failed to load', retry: 'Retry', noCatsYet: 'No categories yet — they appear once the platform team adds them.',
        preview: 'How customers see you', save: vendor ? 'Save changes' : 'Create my store 🚀' };

  const areaLabel = KW_AREAS.find((a) => a.id === areaId)?.[ar ? 'ar' : 'en'] ?? '';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-bold text-ink-900">{t.title}</h1>
        <p className="mt-1 text-[14px] text-ink-500">{t.sub}</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {err && (
            <div className="flex items-start gap-2 rounded-[12px] border border-red-300 bg-red-50 p-3 text-[13px] text-red-700">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />{err}
            </div>
          )}

          {/* STEP 1 — identity + AI */}
          <Card className="p-5 flex flex-col gap-4">
            <StepTitle n={ar ? '١' : '1'} icon={<Store className="size-4" />} label={t.s1} />
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

            <div className="rounded-[14px] border border-navy-200 bg-navy-50/60 p-4">
              <p className="text-[12.5px] text-ink-500">{t.aiHint}</p>
              <button
                type="button"
                onClick={onAiFill}
                disabled={aiBusy}
                className="mt-2.5 inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-l from-navy-700 to-navy-900 px-5 text-[13.5px] font-bold text-white shadow-[var(--shadow-elev1)] transition-transform hover:scale-[1.03] disabled:opacity-60 ltr:bg-gradient-to-r"
              >
                {aiBusy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {t.aiBtn}
              </button>
            </div>

            <button type="button" onClick={() => setShowEn((s) => !s)} className="self-start text-[13px] font-semibold text-navy-600 hover:text-navy-800">
              {showEn ? '▾' : '▸'} {t.en}
            </button>
            {showEn && (
              <div className="grid gap-4 rounded-[12px] bg-navy-50/50 p-4">
                <Field label={t.nameEn}><Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} /></Field>
                <Field label={t.bioEn}><Textarea value={bioEn} onChange={(e) => setBioEn(e.target.value)} /></Field>
              </div>
            )}
          </Card>

          {/* STEP 2 — contact, +965 locked */}
          <Card className="p-5 flex flex-col gap-4">
            <StepTitle n={ar ? '٢' : '2'} icon={<Phone className="size-4" />} label={t.s2} />
            <Field label={`${t.wa} *`} hint={t.waHint}>
              <KwPhoneInput value={whatsapp} onChange={setWhatsapp} />
            </Field>
            <Field label={t.phone}>
              <KwPhoneInput value={phone} onChange={setPhone} />
            </Field>
          </Card>

          {/* STEP 3 — media + categories */}
          <Card className="p-5 flex flex-col gap-4">
            <StepTitle n={ar ? '٣' : '3'} icon={<ImageIcon className="size-4" />} label={t.s3} />
            <p className="-mt-2 text-[12px] text-ink-500">{t.imgHint}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.logo}><Input dir="ltr" placeholder="https://…" value={logoImage} onChange={(e) => setLogoImage(e.target.value)} /></Field>
              <Field label={t.cover}><Input dir="ltr" placeholder="https://…" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} /></Field>
            </div>
            {logoImage ? (
              <Field label={ar ? `تكبير الشعار (${logoZoom.toFixed(1)}×) — شوف النتيجة في المعاينة` : `Logo zoom (${logoZoom.toFixed(1)}×) — watch the preview`}>
                <input
                  type="range" min={0.5} max={2} step={0.1} value={logoZoom}
                  onChange={(e) => setLogoZoom(Number(e.target.value))}
                  className="w-full max-w-xs accent-navy-900"
                />
              </Field>
            ) : null}

            <div className="mt-1 flex items-center gap-2">
              <Tags className="size-4 text-navy-600" />
              <span className="text-[14px] font-bold text-ink-900">{t.cats}</span>
              <span className="text-[12px] text-ink-500">— {t.catsHint}</span>
            </div>
            {cats === null ? (
              <div className="flex items-center gap-2 text-[13px] text-ink-500"><Loader2 className="size-4 animate-spin" />…</div>
            ) : cats.length === 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-[13px] text-ink-500">{catsErr ? `${t.noCats} (${catsErr})` : t.noCatsYet}</p>
                <button type="button" onClick={loadCats} className="inline-flex items-center gap-2 self-start rounded-[10px] border border-ink-200 px-3 py-2 text-[13px] font-semibold text-ink-900 hover:bg-navy-50">
                  <RefreshCw className="size-3.5" /> {t.retry}
                </button>
              </div>
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

            {/* suggest a missing category */}
            <div className="mt-1 flex items-center gap-2">
              <Input
                dir="auto"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={ar ? 'ما لقيت فئتك؟ اكتبها هنا واقترحها' : "Can't find your category? Suggest it"}
                className="max-w-xs"
              />
              <button
                type="button"
                disabled={suggestBusy || !suggestion.trim()}
                onClick={async () => {
                  setSuggestBusy(true);
                  try {
                    await suggestCategory(suggestion, name);
                    setSuggestion('');
                    toast.success(ar ? 'وصل اقتراحك — بنضيفها قريباً 🙌' : 'Suggestion received — coming soon 🙌');
                  } catch {
                    toast.error(ar ? 'تعذّر الإرسال' : 'Could not send');
                  } finally {
                    setSuggestBusy(false);
                  }
                }}
                className="h-10 rounded-[10px] border border-ink-200 px-3 text-[13px] font-semibold text-ink-900 hover:bg-navy-50 disabled:opacity-50"
              >
                {suggestBusy ? '…' : ar ? 'اقترح' : 'Suggest'}
              </button>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={busy} loading={busy} size="lg">{t.save}</Button>
          </div>
        </form>

        {/* LIVE PREVIEW — sticky on desktop, follows every keystroke */}
        <div className="lg:sticky lg:top-6">
          <div className="mb-2 flex items-center gap-1.5 text-[12.5px] font-bold text-ink-500">
            <Eye className="size-3.5" /> {t.preview}
          </div>
          <StorePreview
            name={name || (ar ? 'اسم متجرك' : 'Your store name')}
            bio={bio}
            areaLabel={areaLabel}
            logo={logoImage}
            logoZoom={logoZoom}
            cover={coverImage}
            cats={(cats ?? []).filter((c) => categoryIds.includes(c.id))}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}

/** Fixed +965 prefix; vendor types the 8 local digits only. */
function KwPhoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div dir="ltr" className="flex">
      <span className="inline-flex h-10 items-center rounded-s-[10px] border border-e-0 border-ink-200 bg-navy-50 px-3 text-[14px] font-bold text-navy-700">
        🇰🇼 +965
      </span>
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(kwDigits(e.target.value))}
        placeholder="5000 0000"
        className="h-10 w-full rounded-e-[10px] border border-ink-200 bg-white px-3 text-[14px] tracking-wider text-ink-900 focus:border-navy-400 focus:outline-none"
      />
    </div>
  );
}

/** Mini phone-frame mock of the customer-facing store page. */
function StorePreview({
  name, bio, areaLabel, logo, logoZoom = 1, cover, cats, locale,
}: {
  name: string; bio: string; areaLabel: string; logo: string; logoZoom?: number; cover: string;
  cats: Category[]; locale: 'ar' | 'en';
}) {
  const initial = name.trim().charAt(0).toUpperCase() || 'م';
  return (
    <div className="overflow-hidden rounded-[24px] border border-ink-200 bg-white shadow-[var(--shadow-elev3)]">
      {/* cover */}
      <div className="relative h-28 w-full bg-gradient-to-br from-navy-700 to-[#001a41]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      {/* logo + identity */}
      <div className="-mt-8 px-4 pb-4">
        <div className="flex size-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-navy-50 text-[22px] font-bold text-navy-700 shadow-[var(--shadow-elev1)]">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt=""
              className="h-full w-full object-cover"
              style={{ transform: `scale(${logoZoom})` }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : initial}
        </div>
        <p className="mt-2 text-[17px] font-bold text-ink-900">{name}</p>
        {areaLabel ? (
          <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-ink-500">
            <MapPin className="size-3" /> {areaLabel}
          </p>
        ) : null}
        {bio ? <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-500 line-clamp-3">{bio}</p> : null}
        {cats.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {cats.slice(0, 4).map((c) => (
              <span key={c.id} className="rounded-full bg-navy-50 px-2 py-0.5 text-[11px] font-semibold text-navy-700">
                {c.emoji} {c.name[locale] || c.name.ar}
              </span>
            ))}
          </div>
        )}
        {/* WhatsApp CTA mock */}
        <div className="mt-3 flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#25D366] text-[13px] font-bold text-white">
          <MessageCircle className="size-4" />
          {locale === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}
        </div>
      </div>
    </div>
  );
}

function StepTitle({ n, icon, label }: { n: string; icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-navy-900 text-[13px] font-bold text-white">{n}</span>
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
