import { Topbar } from '@/components/layout/Topbar';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import type { ReactNode } from 'react';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const canManageUsers = can(user.role, 'users.manage');

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* Fixed atmospheric gradient wash behind everything */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-br from-teal-50 via-amber-50 to-neutral-100"
      />
      <Topbar user={user} canManageUsers={canManageUsers} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}
