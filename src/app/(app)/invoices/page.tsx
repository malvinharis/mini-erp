import { InvoiceFilters } from '@/components/features/invoices/InvoiceFilters';
import { InvoiceRowActions } from '@/components/features/invoices/InvoiceRowActions';
import { InvoiceStatusBadge } from '@/components/features/invoices/InvoiceStatusBadge';
import { Badge, Button, DataTable, type DataTableColumn, UIColor, UISize } from '@/components/ui';
import { getT } from '@/i18n/server';
import { listCustomers } from '@/lib/api/customers';
import { listInvoices } from '@/lib/api/invoices';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import type { InvoiceListItem } from '@/lib/schemas';
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
      <Button size={UISize.Md}>{t('new')}</Button>
    </Link>
  ) : null;

  const columns: DataTableColumn<InvoiceListItem>[] = [
    { key: 'number', header: t('fields.number'), render: (inv) => inv.number },
    { key: 'customer', header: t('fields.customer'), render: (inv) => inv.customer.name },
    { key: 'issueDate', header: t('fields.issueDate'), render: (inv) => formatDate(inv.issueDate) },
    { key: 'dueDate', header: t('fields.dueDate'), render: (inv) => formatDate(inv.dueDate) },
    {
      key: 'status',
      header: t('fields.status'),
      render: (inv) => <InvoiceStatusBadge status={inv.status} label={t(`status.${inv.status}`)} />,
    },
    {
      key: 'total',
      header: t('fields.total'),
      hint: false,
      align: 'right',
      className: 'tabular-nums',
      render: (inv) => formatCurrency(inv.total),
    },
    {
      key: 'createdBy',
      header: t('fields.createdBy'),
      render: (inv) =>
        inv.createdBy?.name ? (
          <Badge color={UIColor.Default}>{inv.createdBy.name}</Badge>
        ) : (
          <span className="text-neutral-400">—</span>
        ),
    },
    {
      key: 'updatedBy',
      header: t('fields.updatedBy'),
      render: (inv) =>
        inv.updatedBy?.name ? (
          <Badge color={UIColor.Primary}>{inv.updatedBy.name}</Badge>
        ) : (
          <span className="text-neutral-400">—</span>
        ),
    },
    {
      key: 'actions',
      header: t('fields.actions'),
      hint: false,
      align: 'right',
      className: 'w-12',
      render: (inv) => <InvoiceRowActions invoice={inv} canManage={canManage} />,
    },
  ];

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h1 className="font-semibold text-2xl">{t('title')}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <InvoiceFilters customers={customers} />
        </div>
        <div className="ml-auto">{newInvoiceButton}</div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(inv) => inv.id}
        empty={{
          title: isFiltered ? t('emptySearch') : t('empty'),
          description: isFiltered ? t('emptySearchHint') : t('emptyHint'),
          action: isFiltered ? undefined : newInvoiceButton,
        }}
        pagination={
          meta
            ? {
                page,
                totalPages: meta.totalPages,
                buildHref: (p) => `/invoices?${buildQuery(params, p)}`,
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
