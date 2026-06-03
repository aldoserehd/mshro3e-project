'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { createCategory, type ActionState } from '@/lib/actions/catalog';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/dict';

const EMOJIS = ['🧁', '🌹', '💍', '👗', '💄', '🏠', '👶', '🎨', '🪴', '🐾', '🎁', '☕️', '🍰', '🕌', '🛍️', '✨'];

export function CategoryForm({ locale, configured }: { locale: Locale; configured: boolean }) {
  const ar = locale === 'ar';
  const [state, action, pending] = useActionState<ActionState, FormData>(createCategory, { ok: false });
  const [emoji, setEmoji] = React.useState('🏷️');

  const t = ar
    ? { nameAr: 'الاسم (عربي)', nameEn: 'الاسم (إنجليزي)', emoji: 'الأيقونة', save: 'إضافة الفئة',
        noEnv: 'لم يتم ضبط FIREBASE_ADMIN_SERVICE_ACCOUNT — الحفظ لن يعمل حتى تضبطه في admin/.env.local.' }
    : { nameAr: 'Name (Arabic)', nameEn: 'Name (English)', emoji: 'Icon', save: 'Add category',
        noEnv: 'FIREBASE_ADMIN_SERVICE_ACCOUNT is not set — saving will fail until you add it to admin/.env.local.' };

  return (
    <form action={action} className="flex flex-col gap-5 max-w-xl">
      {!configured && (
        <div className="flex items-start gap-2 rounded-[12px] border border-amber-300 bg-amber-50 p-3 text-[13px] text-amber-900">
          <AlertTriangle className="size-4 mt-0.5 shrink-0" />{t.noEnv}
        </div>
      )}
      {state.error && (
        <div className="rounded-[12px] border border-red-300 bg-red-50 p-3 text-[13px] text-red-700">{state.error}</div>
      )}

      <Card className="p-5 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>{t.nameAr}</Label>
            <Input name="nameAr" dir="rtl" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>{t.nameEn}</Label>
            <Input name="nameEn" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>{t.emoji}</Label>
          <input type="hidden" name="emoji" value={emoji} />
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                type="button"
                key={e}
                onClick={() => setEmoji(e)}
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] border text-[18px] transition-colors ${emoji === e ? 'border-navy-900 bg-navy-50' : 'border-ink-200 hover:bg-navy-50'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" loading={pending} size="lg">{t.save}</Button>
      </div>
    </form>
  );
}
