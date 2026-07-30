import type { AuthUser } from '@/lib/schemas';
import { UserMenu } from './UserMenu';

export function Topbar({ user }: { user: AuthUser }) {
  return (
    <header className="flex h-14 items-center justify-between border-[--color-border] border-b bg-[--color-surface] px-6">
      <div />
      <UserMenu user={user} />
    </header>
  );
}
