import { VendorAuthProvider } from '@/lib/vendor/auth';
import { VendorShell } from '@/components/vendor/shell';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <VendorAuthProvider>
      <VendorShell>{children}</VendorShell>
    </VendorAuthProvider>
  );
}
