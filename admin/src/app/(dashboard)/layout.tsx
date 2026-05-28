import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getLocale } from '@/lib/locale';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');
  // TODO: vendor-scoped routes in next pass. For now, owners + vendors share these views.
  if (session.role === 'customer') redirect('/login');

  const locale = await getLocale();

  return (
    <div className="flex min-h-dvh">
      <Sidebar locale={locale} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          locale={locale}
          user={{
            displayName: session.displayName,
            email: session.email,
            role: session.role,
          }}
        />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
