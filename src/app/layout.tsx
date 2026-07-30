import { I18nProvider } from '@/i18n/client';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'mini-erp',
  description: 'Fullstack monorepo template — NestJS + Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning: browser extensions (Grammarly, etc.) inject
          attributes on <body> before hydration — this ignores that single-level mismatch */}
      <body suppressHydrationWarning>
        <I18nProvider>{children}</I18nProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
