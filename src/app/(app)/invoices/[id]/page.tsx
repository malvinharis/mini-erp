import { InvoiceStatusActions } from '@/components/features/invoices/InvoiceStatusActions';
import { InvoiceStatusBadge } from '@/components/features/invoices/InvoiceStatusBadge';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  TD,
  TH,
  THead,
  TR,
  Table,
  UIColor,
  UISize,
  UIVariant,
} from '@/components/ui';
import { getT } from '@/i18n/server';
import { getInvoice } from '@/lib/api/invoices';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import { InvoiceStatus, UserRole } from '@/lib/schemas';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await getCurrentUser();
  const canManage = can(me.role, 'invoices.manage');
  const isAdmin = me.role === UserRole.ADMIN;

  const { id } = await params;
  const { t } = await getT('invoices');
  const { data: invoice } = await getInvoice(id);

  const canEdit = canManage && invoice.status === InvoiceStatus.DRAFT;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/invoices" className="flex items-center gap-2 font-semibold text-2xl">
            <ArrowLeft size={20} />
            {invoice.number}
          </Link>
          <InvoiceStatusBadge
            status={invoice.status}
            label={t(`status.${invoice.status}`)}
            className="flex h-10 items-center px-3 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          {canEdit ? (
            <Link href={`/invoices/${invoice.id}/edit`}>
              <Button variant={UIVariant.Bordered} color={UIColor.Default} size={UISize.Md}>
                {t('detail.edit')}
              </Button>
            </Link>
          ) : null}
          <InvoiceStatusActions invoice={invoice} canManage={canManage} isAdmin={isAdmin} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('detail.billedTo')}</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{invoice.customer.name}</span>
            <span className="text-gray-500 dark:text-gray-400">{invoice.customer.email}</span>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('detail.dates')}</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">{t('detail.issueDate')}</span>
              <span>{formatDate(invoice.issueDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">{t('detail.dueDate')}</span>
              <span>{formatDate(invoice.dueDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">{t('detail.createdBy')}</span>
              <span>{invoice.createdBy?.name ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">{t('detail.updatedBy')}</span>
              <span>{invoice.updatedBy?.name ?? '—'}</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('detail.total')}</CardTitle>
          </CardHeader>
          <CardBody className="text-sm">
            <span className="font-semibold text-2xl tabular-nums">
              {formatCurrency(invoice.total)}
            </span>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('detail.items')}</CardTitle>
        </CardHeader>
        <CardBody>
          <Table>
            <THead>
              <TR>
                <TH>{t('form.description')}</TH>
                <TH>{t('form.quantity')}</TH>
                <TH>{t('form.unitPrice')}</TH>
                <TH>{t('form.amount')}</TH>
              </TR>
            </THead>
            <tbody>
              {invoice.items.map((item) => (
                <TR key={item.id}>
                  <TD>{item.description}</TD>
                  <TD className="tabular-nums">{item.quantity}</TD>
                  <TD className="tabular-nums">{formatCurrency(item.unitPrice)}</TD>
                  <TD className="tabular-nums">{formatCurrency(item.amount)}</TD>
                </TR>
              ))}
            </tbody>
            <tfoot>
              <TR>
                <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400" colSpan={3}>
                  {t('detail.subtotal')}
                </td>
                <TD className="tabular-nums">{formatCurrency(invoice.subtotal)}</TD>
              </TR>
              <TR>
                <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400" colSpan={3}>
                  {t('detail.taxAmount')} ({invoice.taxRate}%)
                </td>
                <TD className="tabular-nums">{formatCurrency(invoice.taxAmount)}</TD>
              </TR>
              <TR>
                <td className="px-4 py-3 text-right font-semibold" colSpan={3}>
                  {t('detail.grandTotal')}
                </td>
                <TD className="font-semibold tabular-nums">{formatCurrency(invoice.total)}</TD>
              </TR>
            </tfoot>
          </Table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('detail.history')}</CardTitle>
        </CardHeader>
        <CardBody>
          <ol className="flex flex-col gap-3 text-sm">
            {invoice.statusLogs.map((log) => (
              <li key={log.id} className="flex items-baseline justify-between gap-4">
                <span>
                  {log.fromStatus
                    ? t('detail.historyEntry', {
                        from: t(`status.${log.fromStatus}`),
                        to: t(`status.${log.toStatus}`),
                      })
                    : t('detail.createdInitial')}
                  {log.changedByName ? (
                    <span className="text-gray-500 dark:text-gray-400">
                      {' '}
                      {t('detail.by')} {log.changedByName}
                    </span>
                  ) : null}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {formatDateTime(log.changedAt)}
                </span>
              </li>
            ))}
          </ol>
        </CardBody>
      </Card>
    </section>
  );
}
