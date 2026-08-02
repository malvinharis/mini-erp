import { InvoiceStatusBadge } from '@/components/features/invoices/InvoiceStatusBadge';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  TD,
  TH,
  THead,
  TR,
  Table,
} from '@/components/ui';
import { getT } from '@/i18n/server';
import { getCustomer } from '@/lib/api/customers';
import { listInvoices } from '@/lib/api/invoices';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await getCurrentUser();
  const canManage = can(me.role, 'customers.manage');
  const canManageInvoices = can(me.role, 'invoices.manage');

  const { id } = await params;
  const { t } = await getT('customers');
  const [{ data: customer }, { data: invoices }] = await Promise.all([
    getCustomer(id),
    listInvoices({ customerId: id, limit: 50 }),
  ]);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Link
          href="/customers"
          className="flex items-center gap-2 font-semibold text-2xl hover:underline"
        >
          <ArrowLeft size={20} />
          {customer.name}
        </Link>
        {canManage ? (
          <Link href={`/customers/${customer.id}/edit`}>
            <Button>{t('detail.edit')}</Button>
          </Link>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('detail.contact')}</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          <div className="flex gap-2">
            <span className="w-24 text-gray-500 dark:text-gray-400">{t('fields.email')}</span>
            <span>{customer.email}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 text-gray-500 dark:text-gray-400">{t('fields.phone')}</span>
            <span>{customer.phone ?? '—'}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 text-gray-500 dark:text-gray-400">{t('fields.npwp')}</span>
            <span>{customer.npwp ?? '—'}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 text-gray-500 dark:text-gray-400">{t('fields.address')}</span>
            <span>{customer.address ?? '—'}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 text-gray-500 dark:text-gray-400">{t('fields.createdBy')}</span>
            <span>{customer.createdBy?.name ?? '—'}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 text-gray-500 dark:text-gray-400">{t('fields.updatedBy')}</span>
            <span>{customer.updatedBy?.name ?? '—'}</span>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{t('invoiceList.title')}</CardTitle>
          {canManageInvoices ? (
            <Link href={`/invoices/new?customerId=${customer.id}`}>
              <Button size="sm">{t('invoiceList.new')}</Button>
            </Link>
          ) : null}
        </CardHeader>
        <CardBody>
          {invoices.length === 0 ? (
            <EmptyState title={t('invoiceList.empty')} />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>{t('invoiceList.columns.number')}</TH>
                  <TH>{t('invoiceList.columns.issueDate')}</TH>
                  <TH>{t('invoiceList.columns.dueDate')}</TH>
                  <TH>{t('invoiceList.columns.status')}</TH>
                  <TH>{t('invoiceList.columns.total')}</TH>
                </TR>
              </THead>
              <tbody>
                {invoices.map((invoice) => (
                  <TR key={invoice.id}>
                    <TD>
                      <Link href={`/invoices/${invoice.id}`} className="hover:underline">
                        {invoice.number}
                      </Link>
                    </TD>
                    <TD>{formatDate(invoice.issueDate)}</TD>
                    <TD>{formatDate(invoice.dueDate)}</TD>
                    <TD>
                      <InvoiceStatusBadge
                        status={invoice.status}
                        label={t(`invoiceList.status.${invoice.status}`)}
                      />
                    </TD>
                    <TD className="tabular-nums">{formatCurrency(invoice.total)}</TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
