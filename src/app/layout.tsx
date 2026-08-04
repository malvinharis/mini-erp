import { I18nProvider } from '@/i18n/client';
import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

// Source Sans Pro (now "Source Sans 3" on Google Fonts), self-hosted by
// next/font and exposed as the --font-sans CSS variable consumed by the
// Tailwind `sans` family + globals.scss body.
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-source-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'mini erp',
  description: 'Fullstack monorepo template — NestJS + Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={sourceSans.variable}>
      {/* suppressHydrationWarning: browser extensions (Grammarly, etc.) inject
          attributes on <body> before hydration — this ignores that single-level mismatch */}
      <body suppressHydrationWarning>
        <I18nProvider>{children}</I18nProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
