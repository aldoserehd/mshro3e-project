import { VendorAuthProvider } from '@/lib/vendor/auth';
import { VendorShell } from '@/components/vendor/shell';
import { Toaster } from '@/components/ui/toaster';
import { getLocale } from '@/lib/locale';

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <VendorAuthProvider>
      <VendorShell>{children}</VendorShell>
      <Toaster locale={locale} />
    </VendorAuthProvider>
  );
}
