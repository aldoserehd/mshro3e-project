'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getDict, type Locale } from '@/i18n/dict';
import { BRAND } from '@/lib/brand';
import { Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, Info } from 'lucide-react';

const schema = z.object({
  identifier: z.string().min(3, 'حقل مطلوب'),
  password: z.string().min(6, 'كلمة المرور قصيرة جدًا'),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function LoginCard({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/overview';

  const [showPassword, setShowPassword] = React.useState(false);
  const [forgotOpen, setForgotOpen] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: '', password: '', remember: true },
  });

  const onSubmit = async (_v: FormValues) => {
    // Mock session — UTF-8 → base64 (btoa only handles Latin1, so encode bytes first).
    const json = JSON.stringify({
      uid: 'owner_demo_1',
      role: 'owner',
      displayName: locale === 'ar' ? 'سالم العتيبي' : 'Salem Otaibi',
      email: _v.identifier.includes('@') ? _v.identifier : `owner@${BRAND.domain}`,
    });
    const bytes = new TextEncoder().encode(json);
    const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
    const payload = btoa(binary);
    document.cookie = `__mshro3e_session=${payload}; path=/; max-age=2592000; SameSite=Lax`;
    // Brief artificial delay so the loading state actually shows
    await new Promise((r) => setTimeout(r, 350));
    router.push(next as never);
    router.refresh();
  };

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h2 className="text-[28px] leading-[34px] font-bold text-ink-900 tracking-tight">
          {t.login.title}
        </h2>
        <p className="mt-2 text-[14px] text-ink-500">{t.login.subtitle}</p>
      </div>

      <div className="mb-5 flex items-start gap-2.5 rounded-[12px] border border-navy-200 bg-navy-50/70 p-3">
        <Info className="size-4 mt-0.5 shrink-0 text-navy-500" />
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-ink-900">{t.login.demoTitle}</p>
          <p className="mt-0.5 text-[12px] leading-[18px] text-ink-500">{t.login.demoBody}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="identifier">{t.login.identifier}</Label>
          <div className="relative">
            <Mail className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-ink-500 pointer-events-none" />
            <Input
              id="identifier"
              type="text"
              autoComplete="username"
              placeholder={t.login.identifierPh}
              className="ps-10"
              dir="auto"
              {...register('identifier')}
            />
          </div>
          {errors.identifier ? (
            <span className="text-[12px] text-red-600">{errors.identifier.message}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.login.password}</Label>
            <button
              type="button"
              onClick={() => setForgotOpen((v) => !v)}
              className="text-[12px] font-medium text-navy-500 hover:text-navy-700"
            >
              {t.login.forgot}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-ink-500 pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={t.login.passwordPh}
              className="ps-10 pe-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? t.login.hidePassword : t.login.showPassword}
              aria-pressed={showPassword}
              className="absolute end-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-[8px] text-ink-500 hover:bg-navy-50 hover:text-ink-900 transition-colors"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {forgotOpen ? (
            <p className="text-[12px] text-ink-500 bg-navy-50/70 border border-navy-100 rounded-[8px] px-2.5 py-1.5">
              {t.login.forgotHint}
            </p>
          ) : null}
          {errors.password ? (
            <span className="text-[12px] text-red-600">{errors.password.message}</span>
          ) : null}
        </div>

        <Controller
          control={control}
          name="remember"
          render={({ field }) => (
            <label className="flex items-center gap-2 select-none">
              <Checkbox
                id="remember"
                checked={!!field.value}
                onCheckedChange={(c) => field.onChange(c === true)}
              />
              <span className="text-[13px] text-ink-900">{t.login.remember}</span>
            </label>
          )}
        />

        <Button type="submit" size="lg" loading={isSubmitting} className="mt-2">
          {isSubmitting ? t.login.submitting : t.login.submit}
          {!isSubmitting ? <ArrowIcon className="size-4" /> : null}
        </Button>
      </form>

      <p className="mt-8 text-[12px] text-ink-500 text-center">
        © 2026 {t.brand}
      </p>
    </div>
  );
}
