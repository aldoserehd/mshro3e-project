import type { Metadata } from 'next';
import './globals.css';
import { getLocale, localeDir, localeLang } from '@/lib/locale';

export const metadata: Metadata = {
  title: 'Mshro3e Admin',
  description: 'مشروعي — لوحة التحكم',
  icons: { icon: '/favicon.ico' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={localeLang(locale)} dir={localeDir(locale)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&family=Tajawal:wght@400;500;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh bg-[color:var(--color-bg)]" suppressHydrationWarning>{children}</body>
    </html>
  );
}
