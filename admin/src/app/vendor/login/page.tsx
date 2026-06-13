'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Loader2, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { authClient } from '@/lib/firebase-client';
import { BRAND } from '@/lib/brand';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type View = 'auth' | 'reset';

export default function VendorLoginPage() {
  const { ready, user, signIn } = useVendorAuth();
  const router = useRouter();
  const locale = useVendorLocale();
  const ar = locale === 'ar';

  const [view, setView] = React.useState<View>('auth');
  const [mode, setMode] = React.useState<'in' | 'up'>('in');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  // reset-password state
  const [resetEmail, setResetEmail] = React.useState('');
  const [resetBusy, setResetBusy] = React.useState(false);
  const [resetErr, setResetErr] = React.useState('');
  const [resetSent, setResetSent] = React.useState(false);

  React.useEffect(() => {
    if (user) router.replace('/vendor');
  }, [user, router]);

  const t = ar
    ? { title: 'لوحة البائع', sub: 'سجّل دخولك لإدارة متجرك', subUp: 'أنشئ حسابك وابدأ متجرك بدقائق', email: 'البريد الإلكتروني', pass: 'كلمة المرور',
        signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب بائع', toUp: 'بائع جديد؟ أنشئ حساب', toIn: 'لديك حساب؟ سجّل دخولك',
        forgot: 'نسيت كلمة المرور؟', showPw: 'إظهار كلمة المرور', hidePw: 'إخفاء كلمة المرور',
        bad: 'البريد أو كلمة المرور غير صحيحة.', weak: 'كلمة المرور قصيرة (٦ أحرف على الأقل).', used: 'البريد مستخدم مسبقاً.',
        invalidEmail: 'صيغة البريد غير صحيحة.', generic: 'حدث خطأ، حاول مرة أخرى.',
        resetTitle: 'استعادة كلمة المرور', resetSub: 'أدخل بريدك وبنرسل لك رابط لإعادة التعيين.',
        resetSend: 'إرسال رابط الاستعادة', back: 'رجوع لتسجيل الدخول',
        resetDone: 'تم الإرسال! تحقّق من بريدك (وصندوق المهملات) لإعادة تعيين كلمة المرور.',
        resetNoUser: 'ما لقينا حساب بهذا البريد.',
        newVendorHint: 'حساب جديد بينقلك مباشرة لإنشاء متجرك.', joinLink: `تعرّف على ${BRAND.ar} للأعمال` }
    : { title: 'Vendor portal', sub: 'Sign in to manage your store', subUp: 'Create your account and start your store in minutes', email: 'Email', pass: 'Password',
        signIn: 'Sign in', signUp: 'Create vendor account', toUp: 'New vendor? Create an account', toIn: 'Have an account? Sign in',
        forgot: 'Forgot password?', showPw: 'Show password', hidePw: 'Hide password',
        bad: 'Wrong email or password.', weak: 'Password too short (6+ characters).', used: 'Email already in use.',
        invalidEmail: 'That email address looks invalid.', generic: 'Something went wrong, try again.',
        resetTitle: 'Reset your password', resetSub: 'Enter your email and we will send a reset link.',
        resetSend: 'Send reset link', back: 'Back to sign in',
        resetDone: 'Sent! Check your inbox (and spam) to reset your password.',
        resetNoUser: 'No account found with that email.',
        newVendorHint: 'A new account takes you straight to creating your store.', joinLink: `Learn about ${BRAND.en} for business` };

  const mapAuthError = (code?: string, fallback?: string) => {
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') return t.bad;
    if (code === 'auth/weak-password') return t.weak;
    if (code === 'auth/email-already-in-use') return t.used;
    if (code === 'auth/invalid-email') return t.invalidEmail;
    return fallback ?? t.generic;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || busy) return;
    setBusy(true);
    setErr('');
    try {
      if (mode === 'in') {
        await signIn(email, password);
      } else {
        await createUserWithEmailAndPassword(authClient(), email.trim(), password);
      }
      router.replace('/vendor');
    } catch (e2) {
      setErr(mapAuthError((e2 as { code?: string }).code, (e2 as { message?: string }).message));
    } finally {
      setBusy(false);
    }
  };

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || resetBusy) return;
    setResetBusy(true);
    setResetErr('');
    try {
      await sendPasswordResetEmail(authClient(), resetEmail.trim());
      setResetSent(true);
    } catch (e2) {
      const code = (e2 as { code?: string }).code;
      // Don't leak which emails exist — but a malformed email is worth flagging.
      if (code === 'auth/invalid-email') setResetErr(t.invalidEmail);
      else if (code === 'auth/user-not-found') setResetErr(t.resetNoUser);
      else setResetErr((e2 as { message?: string }).message ?? t.generic);
    } finally {
      setResetBusy(false);
    }
  };

  const openReset = () => {
    setView('reset');
    setResetEmail(email.trim());
    setResetErr('');
    setResetSent(false);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-6 bg-[color:var(--color-bg)]">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-[16px] bg-navy-900 text-white font-bold text-[24px]">م</span>
          <h1 className="mt-3 text-[24px] font-bold text-ink-900">{view === 'reset' ? t.resetTitle : t.title}</h1>
          <p className="mt-1 text-[14px] text-ink-500">{view === 'reset' ? t.resetSub : mode === 'up' ? t.subUp : t.sub}</p>
        </div>

        {!ready && (
          <p className="mb-4 rounded-[10px] border border-amber-300 bg-amber-50 p-2.5 text-[12px] text-amber-900">
            {ar ? 'إعدادات Firebase غير مضبوطة.' : 'Firebase env not configured.'}
          </p>
        )}

        {view === 'auth' ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-[16px] border border-ink-200 bg-white p-6 shadow-[var(--shadow-elev1)]">
            {/* segmented sign-in / sign-up toggle */}
            <div className="grid grid-cols-2 gap-1 rounded-[12px] bg-navy-50 p-1">
              {(['in', 'up'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setErr(''); }}
                  className={`h-9 rounded-[9px] text-[13px] font-bold transition-colors ${mode === m ? 'bg-white text-navy-900 shadow-[var(--shadow-elev1)]' : 'text-ink-500 hover:text-ink-900'}`}
                >
                  {m === 'in' ? t.signIn : (ar ? 'حساب جديد' : 'Sign up')}
                </button>
              ))}
            </div>

            {err && (
              <p className="flex items-start gap-2 rounded-[10px] border border-red-300 bg-red-50 p-2.5 text-[12px] text-red-700">
                <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />{err}
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <Label>{t.email}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" dir="ltr" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label>{t.pass}</Label>
                {mode === 'in' && (
                  <button type="button" onClick={openReset} className="text-[12px] text-navy-600 hover:text-navy-700 hover:underline">
                    {t.forgot}
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
                  dir="ltr"
                  className="pe-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? t.hidePw : t.showPw}
                  className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-ink-500 hover:text-ink-900 transition-colors"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={busy || !ready} loading={busy} className="mt-1">
              {mode === 'in' ? t.signIn : t.signUp}
            </Button>

            {mode === 'up' && (
              <p className="-mt-1 text-center text-[12px] text-ink-500">{t.newVendorHint}</p>
            )}
          </form>
        ) : (
          <form onSubmit={onReset} className="flex flex-col gap-4 rounded-[16px] border border-ink-200 bg-white p-6 shadow-[var(--shadow-elev1)]">
            {resetSent ? (
              <div className="flex flex-col items-center gap-3 py-2 text-center">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="size-6" />
                </span>
                <p className="text-[14px] text-ink-900">{t.resetDone}</p>
                <Button type="button" variant="secondary" onClick={() => setView('auth')} className="mt-1">
                  <ArrowLeft className="size-4" />{t.back}
                </Button>
              </div>
            ) : (
              <>
                {resetErr && (
                  <p className="flex items-start gap-2 rounded-[10px] border border-red-300 bg-red-50 p-2.5 text-[12px] text-red-700">
                    <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />{resetErr}
                  </p>
                )}
                <div className="flex flex-col gap-1.5">
                  <Label>{t.email}</Label>
                  <Input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} autoComplete="email" dir="ltr" required autoFocus />
                </div>
                <Button type="submit" disabled={resetBusy || !ready} loading={resetBusy}>
                  {t.resetSend}
                </Button>
                <button type="button" onClick={() => setView('auth')} className="inline-flex items-center justify-center gap-1.5 text-[13px] text-navy-600 hover:text-navy-700 hover:underline">
                  <ArrowLeft className="size-3.5" />{t.back}
                </button>
              </>
            )}
          </form>
        )}

        <p className="mt-5 text-center text-[13px]">
          <Link href={'/join' as never} className="text-navy-600 hover:text-navy-700 hover:underline">
            {t.joinLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
