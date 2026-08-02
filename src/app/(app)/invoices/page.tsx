import { InvoiceFilters } from '@/components/features/invoices/InvoiceFilters';
import { InvoiceStatusBadge } from '@/components/features/invoices/InvoiceStatusBadge';
import { Button, EmptyState, TD, TH, THead, TR, Table } from '@/components/ui';
import { getT } from '@/i18n/server';
import { listCustomers } from '@/lib/api/customers';
import { listInvoices } from '@/lib/api/invoices';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import { InvoiceStatus } from '@/lib/schemas';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import Link from 'next/link';

type SearchParams = {
  page?: string;
  search?: string;
  status?: string;
  customerId?: string;
  from?: string;
  to?: string;
};

function buildQuery(params: SearchParams, page: number): string {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);
  if (params.customerId) qs.set('customerId', params.customerId);
  if (params.from) qs.set('from', params.from);
  if (params.to) qs.set('to', params.to);
  return qs.toString();
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const me = await getCurrentUser();
  const canManage = can(me.role, 'invoices.manage');

  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? '1'));
  const { t } = await getT('invoices');

  const [{ data: rows, meta }, { data: customers }] = await Promise.all([
    listInvoices({
      page,
      limit: 20,
      search: params.search,
      status: params.status,
      customerId: params.customerId,
      from: params.from,
      to: params.to,
    }),
    listCustomers({ limit: 100 }),
  ]);

  const isFiltered = Boolean(
    params.search || params.status || params.customerId || params.from || params.to,
  );

  const newInvoiceButton = canManage ? (
    <Link href="/invoices/new">
      <Button>{t('new')}</Button>
    </Link>
  ) : null;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">{t('title')}</h1>
        {newInvoiceButton}
      </div>

      <InvoiceFilters customers={customers} />

      {rows.length === 0 ? (
        <EmptyState
          title={isFiltered ? t('emptySearch') : t('empty')}
          description={isFiltered ? t('emptySearchHint') : t('emptyHint')}
          action={isFiltered ? undefined : newInvoiceButton}
        />
      ) : (
        <>
          <Table>
            <THead>
              <TR>
                <TH>{t('fields.number')}</TH>
                <TH>{t('fields.customer')}</TH>
                <TH>{t('fields.issueDate')}</TH>
                <TH>{t('fields.dueDate')}</TH>
                <TH>{t('fields.status')}</TH>
                <TH>{t('fields.total')}</TH>
              </TR>
            </THead>
            <tbody>
              {rows.map((invoice) => (
                <TR key={invoice.id}>
                  <TD>
                    <Link href={`/invoices/${invoice.id}`} className="hover:underline">
                      {invoice.number}
                    </Link>
                  </TD>
                  <TD>{invoice.customer.name}</TD>
                  <TD>{formatDate(invoice.issueDate)}</TD>
                  <TD>{formatDate(invoice.dueDate)}</TD>
                  <TD>
                    <InvoiceStatusBadge
                      status={invoice.status}
                      label={t(`status.${invoice.status}`)}
                    />
                  </TD>
                  <TD className="tabular-nums">{formatCurrency(invoice.total)}</TD>
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
                <Link href={`/invoices?${buildQuery(params, page - 1)}`} aria-disabled={page <= 1}>
                  <Button variant="bordered" color="default" size="sm" disabled={page <= 1}>
                    Previous
                  </Button>
                </Link>
                <Link
                  href={`/invoices?${buildQuery(params, page + 1)}`}
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
