import { CustomerRowActions } from '@/components/features/customers/CustomerRowActions';
import { CustomerSearch } from '@/components/features/customers/CustomerSearch';
import { Button, EmptyState, TD, TH, THead, TR, Table } from '@/components/ui';
import { getT } from '@/i18n/server';
import { listCustomers } from '@/lib/api/customers';
import { can, getCurrentUser } from '@/lib/auth/rbac';
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
      <Button>{t('new')}</Button>
    </Link>
  ) : null;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">{t('title')}</h1>
        {newCustomerButton}
      </div>

      <CustomerSearch />

      {rows.length === 0 ? (
        <EmptyState
          title={search ? t('emptySearch') : t('empty')}
          description={search ? t('emptySearchHint') : t('emptyHint')}
          action={search ? undefined : newCustomerButton}
        />
      ) : (
        <>
          <Table>
            <THead>
              <TR>
                <TH>{t('fields.name')}</TH>
                <TH>{t('fields.email')}</TH>
                <TH>{t('fields.phone')}</TH>
                {canManage ? <TH>{t('fields.actions')}</TH> : null}
              </TR>
            </THead>
            <tbody>
              {rows.map((customer) => (
                <TR key={customer.id}>
                  <TD>
                    <Link href={`/customers/${customer.id}`} className="hover:underline">
                      {customer.name}
                    </Link>
                  </TD>
                  <TD>{customer.email}</TD>
                  <TD>{customer.phone ?? '—'}</TD>
                  {canManage ? (
                    <TD>
                      <CustomerRowActions customer={customer} />
                    </TD>
                  ) : null}
                </TR>
              ))}
            </tbody>
          </Table>

          {meta && meta.totalPages > 1 ? (
            <nav aria-label="Pagination" className="flex items-center justify-between">
              <span className="text-gray-500 text-sm dark:text-gray-400">
                {t('pagination.summary', {
                  count: meta.total,
                  page: meta.page,
                  totalPages: meta.totalPages,
                })}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/customers?page=${page - 1}${search ? `&search=${search}` : ''}`}
                  aria-disabled={page <= 1}
                >
                  <Button variant="bordered" color="default" size="sm" disabled={page <= 1}>
                    Previous
                  </Button>
                </Link>
                <Link
                  href={`/customers?page=${page + 1}${search ? `&search=${search}` : ''}`}
                  aria-disabled={page >= meta.totalPages}
                >
                  <Button
                    variant="bordered"
                    color="default"
                    size="sm"
                    disabled={page >= meta.totalPages}
                  >
                    Next
                  </Button>
                </Link>
              </div>
            </nav>
          ) : null}
        </>
      )}
    </section>
  );
}
