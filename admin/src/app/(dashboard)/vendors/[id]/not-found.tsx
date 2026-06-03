import Link from 'next/link';
import { Store, ArrowLeft } from 'lucide-react';
import { getLocale } from '@/lib/locale';
import { getDict } from '@/i18n/dict';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export default async function VendorNotFound() {
  const locale = await getLocale();
  const t = getDict(locale);
  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md w-full">
        <EmptyState
          icon={<Store className="size-7" />}
          title={t.vendors.noVendors}
          action={
            <Button asChild variant="secondary" size="sm">
              <Link href="/vendors">
                <ArrowLeft className="size-4" />
                {t.vendors.title}
              </Link>
            </Button>
          }
        />
      </Card>
    </div>
  );
}
