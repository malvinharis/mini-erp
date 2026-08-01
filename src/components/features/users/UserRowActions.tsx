'use client';

import { Button, Dropdown, DropdownItem, Modal, Select, Spinner } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import useFetcher, { HttpMethod } from '@/lib/hooks/useFetcher';
import { type User, UserRole } from '@/lib/schemas';
import { MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const ROLES = [UserRole.ADMIN, UserRole.STAFF, UserRole.VIEWER] as const;

interface Props {
  user: User;
  isSelf: boolean;
}

export function UserRowActions({ user, isSelf }: Props) {
  const { t } = useTranslation('users');
  const router = useRouter();
  const [roleOpen, setRoleOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);
  const [pending, setPending] = useState<'role' | 'active' | 'delete' | null>(null);
  const busy = pending !== null;
  const { fetchData: updateUser } = useFetcher<User>({ method: HttpMethod.PATCH });
  const { fetchData: deleteUser } = useFetcher<null>({ method: HttpMethod.DELETE });
  // Protect the current user and any ADMIN row: hide the action menu entirely
  // (role change / deactivate / delete are not offered for these rows).
  const isProtected = isSelf || user.role === UserRole.ADMIN;
  if (isProtected) return null;

  async function send(action: 'role' | 'active' | 'delete', body?: Partial<User>) {
    setPending(action);
    try {
      if (action === 'delete') {
        await deleteUser({ url: `users/${user.id}` });
      } else {
        await updateUser({ url: `users/${user.id}`, data: body });
      }
      router.refresh();
      return true;
    } catch {
      // useFetcher already toasts the error (showNotification defaults true).
      return false;
    } finally {
      setPending(null);
    }
  }

  async function saveRole() {
    if ((await send('role', { role })) === true) {
      toast.success(t('toast.updated'));
      setRoleOpen(false);
    }
  }

  async function toggleActive() {
    if ((await send('active', { isActive: !user.isActive })) === true) {
      toast.success(t('toast.updated'));
    }
  }

  async function remove() {
    if (!window.confirm(t('confirm.delete'))) return;
    if ((await send('delete')) === true) toast.success(t('toast.deleted'));
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
        <DropdownItem disabled={busy} onClick={() => setRoleOpen(true)}>
          {t('actions.changeRole')}
        </DropdownItem>
        <DropdownItem disabled={busy} onClick={toggleActive}>
          <span className="flex items-center gap-2">
            {pending === 'active' && <Spinner size="sm" />}
            {user.isActive ? t('actions.deactivate') : t('actions.activate')}
          </span>
        </DropdownItem>
        <DropdownItem
          disabled={busy}
          className="text-danger hover:bg-danger/10 dark:text-danger"
          onClick={remove}
        >
          <span className="flex items-center gap-2">
            {pending === 'delete' && <Spinner size="sm" color="danger" />}
            {t('actions.delete')}
          </span>
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
              {pending === 'role' && <Spinner size="sm" className="text-current" />}
              {t('changeRole.confirm')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
