import { CustomerRowActions } from '@/components/features/customers/CustomerRowActions';
import { CustomerSearch } from '@/components/features/customers/CustomerSearch';
import { Badge, Button, DataTable, type DataTableColumn, UIColor, UISize } from '@/components/ui';
import { getT } from '@/i18n/server';
import { listCustomers } from '@/lib/api/customers';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import type { Customer } from '@/lib/schemas';
import Link from 'next/link';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const me = await getCurrentUser();
  const canManage = can(me.role, 'customers.manage');

  const { page: pageParam, search } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? '1'));
  const { t } = await getT('customers');
  const { data: rows, meta } = await listCustomers({ page, limit: 20, search });

  const newCustomerButton = canManage ? (
    <Link href="/customers/new">
      <Button size={UISize.Md}>{t('new')}</Button>
    </Link>
  ) : null;

  const columns: DataTableColumn<Customer>[] = [
    { key: 'name', header: t('fields.name'), render: (c) => c.name },
    { key: 'email', header: t('fields.email'), render: (c) => c.email },
    { key: 'phone', header: t('fields.phone'), render: (c) => c.phone ?? '—' },
    {
      key: 'createdBy',
      header: t('fields.createdBy'),
      render: (c) =>
        c.createdBy?.name ? (
          <Badge color={UIColor.Default}>{c.createdBy.name}</Badge>
        ) : (
          <span className="text-neutral-400">—</span>
        ),
    },
    {
      key: 'updatedBy',
      header: t('fields.updatedBy'),
      render: (c) =>
        c.updatedBy?.name ? (
          <Badge color={UIColor.Primary}>{c.updatedBy.name}</Badge>
        ) : (
          <span className="text-neutral-400">—</span>
        ),
    },
    ...(canManage
      ? [
          {
            key: 'actions',
            header: t('fields.actions'),
            hint: false,
            align: 'right',
            className: 'w-12',
            render: (c: Customer) => <CustomerRowActions customer={c} />,
          } satisfies DataTableColumn<Customer>,
        ]
      : []),
  ];

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-semibold text-2xl">{t('title')}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <CustomerSearch />
        </div>
        <div className="ml-auto">{newCustomerButton}</div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(c) => c.id}
        empty={{
          title: search ? t('emptySearch') : t('empty'),
          description: search ? t('emptySearchHint') : t('emptyHint'),
          action: search ? undefined : newCustomerButton,
        }}
        pagination={
          meta
            ? {
                page,
                totalPages: meta.totalPages,
                buildHref: (p) => `/customers?page=${p}${search ? `&search=${search}` : ''}`,
                summary: t('pagination.summary', {
                  count: meta.total,
                  page: meta.page,
                  totalPages: meta.totalPages,
                }),
              }
            : undefined
        }
      />
    </section>
  );
}
