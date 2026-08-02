import { RevenueChartLoader } from '@/components/features/dashboard/RevenueChartLoader';
import { InvoiceStatusBadge } from '@/components/features/invoices/InvoiceStatusBadge';
import {
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
import { getDashboardSummary } from '@/lib/api/dashboard';
import { InvoiceStatus } from '@/lib/schemas';
import { formatCurrency } from '@/lib/utils/format';
import Link from 'next/link';

const STATUS_ORDER: InvoiceStatus[] = [
  InvoiceStatus.DRAFT,
  InvoiceStatus.SENT,
  InvoiceStatus.PAID,
  InvoiceStatus.OVERDUE,
];

export default async function DashboardPage() {
  const [{ data: summary }, { t }] = await Promise.all([getDashboardSummary(), getT('dashboard')]);

  const cards = [
    { label: t('cards.revenuePaid'), value: formatCurrency(summary.revenuePaid) },
    { label: t('cards.outstanding'), value: formatCurrency(summary.outstanding) },
    { label: t('cards.overdue'), value: String(summary.overdueCount) },
    { label: t('cards.customers'), value: String(summary.customerCount) },
  ];

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-semibold text-2xl">{t('title')}</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardBody className="flex flex-col gap-1">
              <span className="text-gray-500 text-sm dark:text-gray-400">{card.label}</span>
              <span className="font-semibold text-2xl tabular-nums">{card.value}</span>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('chart.title')}</CardTitle>
          </CardHeader>
          <CardBody>
            {summary.revenueByMonth.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center text-gray-400 text-sm">
                {t('chart.empty')}
              </div>
            ) : (
              <RevenueChartLoader data={summary.revenueByMonth} />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('statusCounts.title')}</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            {STATUS_ORDER.map((status) => (
              <div key={status} className="flex items-center justify-between">
                <InvoiceStatusBadge status={status} label={t(`status.${status}`)} />
                <span className="font-semibold tabular-nums">
                  {summary.countByStatus[status] ?? 0}
                </span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{t('recent.title')}</CardTitle>
          <Link
            href="/invoices"
            className="text-indigo-600 text-sm hover:underline dark:text-indigo-400"
          >
            {t('recent.viewAll')}
          </Link>
        </CardHeader>
        <CardBody className="p-0">
          {summary.recentInvoices.length === 0 ? (
            <EmptyState title={t('recent.empty')} />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>{t('fields.number')}</TH>
                  <TH>{t('fields.customer')}</TH>
                  <TH>{t('fields.status')}</TH>
                  <TH>{t('fields.total')}</TH>
                </TR>
              </THead>
              <tbody>
                {summary.recentInvoices.map((invoice) => (
                  <TR key={invoice.id}>
                    <TD>
                      <Link href={`/invoices/${invoice.id}`} className="hover:underline">
                        {invoice.number}
                      </Link>
                    </TD>
                    <TD>{invoice.customer.name}</TD>
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
          )}
        </CardBody>
      </Card>
    </section>
  );
}
