'use client';

import { Button, Dropdown, DropdownItem, Modal, Select } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import type { User, UserRole } from '@/lib/schemas';
import { MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const ROLES = ['ADMIN', 'STAFF', 'VIEWER'] as const;

interface Props {
  user: User;
  isSelf: boolean;
}

export function UserRowActions({ user, isSelf }: Props) {
  const { t } = useTranslation('users');
  const router = useRouter();
  const [roleOpen, setRoleOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);
  const [busy, setBusy] = useState(false);

  async function send(method: 'PATCH' | 'DELETE', body?: unknown) {
    setBusy(true);
    const res = await fetch(`/api/users/${user.id}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    setBusy(false);
    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { message?: string } | null;
      toast.error(err?.message ?? t('toast.error'));
      return false;
    }
    router.refresh();
    return true;
  }

  async function saveRole() {
    if ((await send('PATCH', { role })) === true) {
      toast.success(t('toast.updated'));
      setRoleOpen(false);
    }
  }

  async function toggleActive() {
    if ((await send('PATCH', { isActive: !user.isActive })) === true) {
      toast.success(t('toast.updated'));
    }
  }

  async function remove() {
    if (!window.confirm(t('confirm.delete'))) return;
    if ((await send('DELETE')) === true) toast.success(t('toast.deleted'));
  }

  return (
    <>
      <Dropdown
        align="end"
        trigger={
          <Button variant="flat" color="default" size="sm" aria-label={t('actions.menu')}>
            <MoreVertical size={16} />
          </Button>
        }
      >
        <DropdownItem disabled={isSelf} onClick={() => setRoleOpen(true)}>
          {t('actions.changeRole')}
        </DropdownItem>
        <DropdownItem disabled={busy} onClick={toggleActive}>
          {user.isActive ? t('actions.deactivate') : t('actions.activate')}
        </DropdownItem>
        <DropdownItem
          disabled={isSelf || busy}
          className="text-danger hover:bg-danger/10 dark:text-danger"
          onClick={remove}
        >
          {t('actions.delete')}
        </DropdownItem>
      </Dropdown>

      <Modal open={roleOpen} onClose={() => setRoleOpen(false)} size="sm">
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-lg">{t('changeRole.title')}</h2>
          <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`role.${r}`)}
              </option>
            ))}
          </Select>
          <div className="flex justify-end gap-2">
            <Button variant="bordered" color="default" onClick={() => setRoleOpen(false)}>
              Cancel
            </Button>
            <Button disabled={busy} onClick={saveRole}>
              {t('changeRole.confirm')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
