import { UserRowActions } from '@/components/features/users/UserRowActions';
import { Badge, Button, DataTable, type DataTableColumn, UIColor, UISize } from '@/components/ui';
import { getT } from '@/i18n/server';
import { listUsers } from '@/lib/api/users';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import { type User, UserRole } from '@/lib/schemas';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const roleColor: Record<UserRole, UIColor> = {
  [UserRole.ADMIN]: UIColor.Success,
  [UserRole.STAFF]: UIColor.Primary,
  [UserRole.VIEWER]: UIColor.Default,
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

  const columns: DataTableColumn<User>[] = [
    { key: 'name', header: t('fields.name'), render: (u) => u.name },
    { key: 'email', header: t('fields.email'), render: (u) => u.email },
    {
      key: 'role',
      header: t('fields.role'),
      render: (u) => <Badge color={roleColor[u.role]}>{t(`role.${u.role}`)}</Badge>,
    },
    {
      key: 'status',
      header: t('fields.status'),
      render: (u) => (u.isActive ? t('status.active') : t('status.inactive')),
    },
    {
      key: 'actions',
      header: t('fields.actions'),
      render: (u) => <UserRowActions user={u} isSelf={u.id === me.id} />,
    },
  ];

  const newUserButton = (
    <Link href="/users/new">
      <Button size={UISize.Md}>{t('new')}</Button>
    </Link>
  );

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">{t('title')}</h1>
        {newUserButton}
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(u) => u.id}
        empty={{ title: t('empty'), description: t('emptyHint'), action: newUserButton }}
        pagination={
          meta
            ? {
                page,
                totalPages: meta.totalPages,
                buildHref: (p) => `/users?page=${p}`,
                summary: `Page ${meta.page} of ${meta.totalPages}`,
              }
            : undefined
        }
      />
    </section>
  );
}
