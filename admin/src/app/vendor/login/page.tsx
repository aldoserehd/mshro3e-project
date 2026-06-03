'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { authClient } from '@/lib/firebase-client';
import { useVendorAuth } from '@/lib/vendor/auth';
import { useVendorLocale } from '@/components/vendor/shell';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function VendorLoginPage() {
  const { ready, user, signIn } = useVendorAuth();
  const router = useRouter();
  const locale = useVendorLocale();
  const [mode, setMode] = React.useState<'in' | 'up'>('in');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (user) router.replace('/vendor');
  }, [user, router]);

  const t = locale === 'ar'
    ? { title: 'لوحة البائع', sub: 'سجّل دخولك لإدارة متجرك', email: 'البريد الإلكتروني', pass: 'كلمة المرور',
        signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب بائع', toUp: 'بائع جديد؟ أنشئ حساب', toIn: 'لديك حساب؟ سجّل دخولك',
        bad: 'البريد أو كلمة المرور غير صحيحة.', weak: 'كلمة المرور قصيرة (٦+).', used: 'البريد مستخدم مسبقاً.', generic: 'حدث خطأ، حاول مرة أخرى.' }
    : { title: 'Vendor portal', sub: 'Sign in to manage your store', email: 'Email', pass: 'Password',
        signIn: 'Sign in', signUp: 'Create vendor account', toUp: 'New vendor? Create an account', toIn: 'Have an account? Sign in',
        bad: 'Wrong email or password.', weak: 'Password too short (6+).', used: 'Email already in use.', generic: 'Something went wrong, try again.' };

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
      const code = (e2 as { code?: string }).code;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') setErr(t.bad);
      else if (code === 'auth/weak-password') setErr(t.weak);
      else if (code === 'auth/email-already-in-use') setErr(t.used);
      else setErr((e2 as { message?: string }).message ?? t.generic);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-6 bg-[color:var(--color-bg)]">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-[16px] bg-navy-900 text-white font-bold text-[24px]">م</span>
          <h1 className="mt-3 text-[24px] font-bold text-ink-900">{t.title}</h1>
          <p className="mt-1 text-[14px] text-ink-500">{t.sub}</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-[16px] border border-ink-200 bg-white p-6 shadow-[var(--shadow-elev1)]">
          {!ready && (
            <p className="rounded-[10px] border border-amber-300 bg-amber-50 p-2.5 text-[12px] text-amber-900">
              {locale === 'ar' ? 'إعدادات Firebase غير مضبوطة.' : 'Firebase env not configured.'}
            </p>
          )}
          {err && <p className="rounded-[10px] border border-red-300 bg-red-50 p-2.5 text-[12px] text-red-700">{err}</p>}

          <div className="flex flex-col gap-1.5">
            <Label>{t.email}</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" dir="ltr" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>{t.pass}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" dir="ltr" required />
          </div>

          <Button type="submit" disabled={busy || !ready} className="mt-1">
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {mode === 'in' ? t.signIn : t.signUp}
          </Button>

          <button type="button" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setErr(''); }} className="text-[13px] text-navy-600 hover:text-navy-700 hover:underline">
            {mode === 'in' ? t.toUp : t.toIn}
          </button>
        </form>
      </div>
    </div>
  );
}
