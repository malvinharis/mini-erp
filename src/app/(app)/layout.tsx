import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import type { ReactNode } from 'react';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar canManageUsers={can(user.role, 'users.manage')} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
