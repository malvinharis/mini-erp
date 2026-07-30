import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[--color-surface-muted] p-4">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
