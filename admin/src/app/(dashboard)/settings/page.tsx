import * as React from 'react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { PageHeader } from '@/components/domain/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default async function SettingsPage() {
  const locale = await getLocale();
  const t = getDict(locale);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.settings.title} subtitle={t.settings.subtitle} />

      <Card className="p-6">
        <form className="grid gap-6 max-w-2xl">
          <div className="grid gap-2">
            <Label htmlFor="fee">{t.settings.platformFee}</Label>
            <div className="flex items-center gap-2 max-w-xs">
              <Input id="fee" type="number" defaultValue={5} min={0} max={100} className="w-24" />
              <span className="text-[14px] text-ink-500">%</span>
            </div>
            <p className="text-[12px] text-ink-500">{t.settings.platformFeeHint}</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="currency">{t.settings.currency}</Label>
            <select id="currency" defaultValue="KWD" className="h-10 rounded-[10px] border border-ink-200 bg-white px-3 text-[14px] max-w-xs">
              <option value="KWD">KWD — دينار كويتي</option>
              <option value="USD">USD — US Dollar</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label>{t.settings.languages}</Label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between max-w-xs">
                <span className="text-[14px]">العربية (Arabic)</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between max-w-xs">
                <span className="text-[14px]">English</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>{t.settings.gateways}</Label>
            <div className="flex flex-col gap-3 max-w-xs">
              <div className="flex items-center justify-between">
                <span className="text-[14px]">KNET</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px]">{t.settings.gatewayVisa}</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px]">{t.settings.gatewayApplePay}</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit">{t.settings.saveChanges}</Button>
            <Button type="button" variant="ghost">{t.common.cancel}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
