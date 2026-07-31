import type { AuthUser } from '@/lib/schemas';
import { UserMenu } from './UserMenu';

export function Topbar({ user }: { user: AuthUser }) {
  return (
    <header className="flex h-14 items-center justify-between border-gray-200 border-b bg-white dark:border-gray-800 dark:bg-gray-900 px-6">
      <div />
      <UserMenu user={user} />
    </header>
  );
}
