'use client';
import { logoutAction } from '@/app/(app)/logout/actions';
import { Badge, Button } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import type { AuthUser } from '@/lib/schemas';
import { LogOut } from 'lucide-react';

export function UserMenu({ user }: { user: AuthUser }) {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end leading-tight">
        <span className="font-medium text-sm">{user.name}</span>
        <span className="text-[--color-text-muted] text-xs">{user.email}</span>
      </div>
      <Badge tone={user.role === 'ADMIN' ? 'primary' : 'neutral'}>{user.role}</Badge>
      <form action={logoutAction}>
        <Button variant="ghost" size="sm" type="submit" aria-label={t('nav.logout')}>
          <LogOut size={16} />
        </Button>
      </form>
    </div>
  );
}
