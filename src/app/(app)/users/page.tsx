import { CreateUserModal } from '@/components/features/users/CreateUserModal';
import { UserRowActions } from '@/components/features/users/UserRowActions';
import type { UIColor } from '@/components/ui';
import { Badge, Button, EmptyState, TD, TH, THead, TR, Table } from '@/components/ui';
import { getT } from '@/i18n/server';
import { listUsers } from '@/lib/api/users';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import { UserRole } from '@/lib/schemas';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const roleColor: Record<UserRole, UIColor> = {
  [UserRole.ADMIN]: 'success',
  [UserRole.STAFF]: 'primary',
  [UserRole.VIEWER]: 'default',
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const me = await getCurrentUser();
  if (!can(me.role, 'users.manage')) notFound();

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? '1'));
  const { t } = await getT('users');
  const { data: rows, meta } = await listUsers({ page, limit: 20 });

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">{t('title')}</h1>
        <CreateUserModal />
      </div>

      {rows.length === 0 ? (
        <EmptyState title={t('empty')} description={t('emptyHint')} action={<CreateUserModal />} />
      ) : (
        <>
          <Table>
            <THead>
              <TR>
                <TH>{t('fields.name')}</TH>
                <TH>{t('fields.email')}</TH>
                <TH>{t('fields.role')}</TH>
                <TH>{t('fields.status')}</TH>
                <TH>{t('fields.actions')}</TH>
              </TR>
            </THead>
            <tbody>
              {rows.map((user) => (
                <TR key={user.id}>
                  <TD>{user.name}</TD>
                  <TD>{user.email}</TD>
                  <TD>
                    <Badge color={roleColor[user.role]}>{t(`role.${user.role}`)}</Badge>
                  </TD>
                  <TD>{user.isActive ? t('status.active') : t('status.inactive')}</TD>
                  <TD>
                    <UserRowActions user={user} isSelf={user.id === me.id} />
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>

          {meta && meta.totalPages > 1 ? (
            <nav aria-label="Pagination" className="flex items-center justify-between">
              <Link href={`/users?page=${page - 1}`} aria-disabled={page <= 1}>
                <Button variant="bordered" color="default" size="sm" disabled={page <= 1}>
                  Previous
                </Button>
              </Link>
              <span className="text-gray-500 text-sm dark:text-gray-400">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Link href={`/users?page=${page + 1}`} aria-disabled={page >= meta.totalPages}>
                <Button
                  variant="bordered"
                  color="default"
                  size="sm"
                  disabled={page >= meta.totalPages}
                >
                  Next
                </Button>
              </Link>
            </nav>
          ) : null}
        </>
      )}
    </section>
  );
}
