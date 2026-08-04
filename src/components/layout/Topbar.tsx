import { getT } from '@/i18n/server';
import type { AuthUser } from '@/lib/schemas';
import { TopNav } from './TopNav';
import { UserMenu } from './UserMenu';

export async function Topbar({
  user,
  canManageUsers = false,
}: {
  user: AuthUser;
  canManageUsers?: boolean;
}) {
  const { t } = await getT('common');

  return (
    <header className="sticky top-0 z-20 flex items-center gap-6 px-4 py-4 backdrop-blur-md">
      <div className="flex shrink-0 items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-600 font-bold text-sm text-white">
          {t('app.name').slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden font-semibold text-neutral-900 text-sm sm:inline">
          {t('app.name')}
        </span>
      </div>

      <TopNav canManageUsers={canManageUsers} />

      <div className="ml-auto shrink-0">
        <UserMenu user={user} />
      </div>
    </header>
  );
}
