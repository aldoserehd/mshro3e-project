import * as React from 'react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { PageHeader } from '@/components/domain/page-header';
import { SettingsForm } from './settings-form';

export default async function SettingsPage() {
  const locale = await getLocale();
  const t = getDict(locale);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.settings.title} subtitle={t.settings.subtitle} />
      <SettingsForm locale={locale} />
    </div>
  );
}
