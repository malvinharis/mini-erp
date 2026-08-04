'use client';
import { logoutAction } from '@/app/(app)/logout/actions';
import { Badge, Button, UIColor, UISize, UIVariant } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import { type AuthUser, UserRole } from '@/lib/schemas';
import { LogOut } from 'lucide-react';

export function UserMenu({ user }: { user: AuthUser }) {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end leading-tight">
        <span className="font-medium text-sm">{user.name}</span>
        <span className="text-gray-500 text-xs dark:text-gray-400">{user.email}</span>
      </div>
      <form action={logoutAction}>
        <Button
          variant={UIVariant.Flat}
          color={UIColor.Default}
          size={UISize.Md}
          type="submit"
          aria-label={t('nav.logout')}
        >
          <LogOut size={16} />
        </Button>
      </form>
    </div>
  );
}
