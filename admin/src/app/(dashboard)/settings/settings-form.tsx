'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Info, Building2, MessageCircle, Languages } from 'lucide-react';
import { getDict, type Locale } from '@/i18n/dict';
import { BRAND } from '@/lib/brand';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-navy-50 text-navy-700">
          {icon}
        </span>
        <h3 className="text-[15px] font-bold text-ink-900">{title}</h3>
      </div>
      <div className="grid gap-5">{children}</div>
    </Card>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-[12px] text-ink-500">{hint}</p> : null}
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  defaultChecked,
}: {
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[14px] font-medium text-ink-900">{label}</p>
        {hint ? <p className="text-[12px] text-ink-500 mt-0.5">{hint}</p> : null}
      </div>
      <Switch defaultChecked={defaultChecked} className="mt-0.5 shrink-0" />
    </div>
  );
}

export function SettingsForm({ locale }: { locale: Locale }) {
  const t = getDict(locale).settings;
  const c = getDict(locale).common;
  const [saving, setSaving] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success(t.saved, { description: t.demoNote });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-start gap-2.5 rounded-[12px] border border-navy-200 bg-navy-50/70 p-3">
        <Info className="size-4 mt-0.5 shrink-0 text-navy-500" />
        <p className="text-[12px] leading-[18px] text-ink-500">{t.demoNote}</p>
      </div>

      <Section icon={<Building2 className="size-4" />} title={t.sectionPlatform}>
        <Row label={t.platformName}>
          <Input defaultValue={getDict(locale).brand} className="max-w-sm" />
        </Row>
        <Row label={t.supportEmail}>
          <Input type="email" defaultValue={BRAND.supportEmail} dir="ltr" className="max-w-sm" />
        </Row>
        <Row label={t.supportPhone}>
          <Input type="tel" defaultValue="+965 2200 0000" dir="ltr" className="max-w-sm" />
        </Row>
        <ToggleRow label={t.autoApprove} hint={t.autoApproveHint} />
        <ToggleRow label={t.requireDocs} hint={t.requireDocsHint} defaultChecked />
      </Section>

      <Section icon={<MessageCircle className="size-4" />} title={t.sectionLeads}>
        <Row label={t.whatsappNumber} hint={t.whatsappHint}>
          <Input type="tel" defaultValue="+965 9000 0000" dir="ltr" className="max-w-sm" />
        </Row>
      </Section>

      <Section icon={<Languages className="size-4" />} title={t.sectionLocale}>
        <Row label={t.currency} hint={t.currencyHint}>
          <select
            defaultValue="KWD"
            disabled
            className="h-10 max-w-sm rounded-[10px] border border-navy-200 bg-navy-50/60 px-3 text-[14px] text-ink-900"
          >
            <option value="KWD">KWD — {locale === 'ar' ? 'دينار كويتي' : 'Kuwaiti Dinar'}</option>
          </select>
        </Row>
        <Row label={t.timezone}>
          <select
            defaultValue="Asia/Kuwait"
            className="h-10 max-w-sm rounded-[10px] border border-navy-200 bg-white px-3 text-[14px] text-ink-900 focus:border-navy-600 focus:outline-none"
          >
            <option value="Asia/Kuwait">Asia/Kuwait (GMT+3)</option>
          </select>
        </Row>
        <Row label={t.defaultLanguage}>
          <select
            defaultValue={locale}
            className="h-10 max-w-sm rounded-[10px] border border-navy-200 bg-white px-3 text-[14px] text-ink-900 focus:border-navy-600 focus:outline-none"
          >
            <option value="ar">العربية (Arabic)</option>
            <option value="en">English</option>
          </select>
        </Row>
        <ToggleRow label={t.maintenance} hint={t.maintenanceHint} />
      </Section>

      <div className="flex gap-2 pt-1">
        <Button type="submit" loading={saving}>
          {t.saveChanges}
        </Button>
        <Button type="reset" variant="ghost">
          {c.reset}
        </Button>
      </div>
    </form>
  );
}
