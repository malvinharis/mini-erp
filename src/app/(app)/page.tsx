import { RevenueChartLoader } from '@/components/features/dashboard/RevenueChartLoader';
import { InvoiceStatusBadge } from '@/components/features/invoices/InvoiceStatusBadge';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  UIColor,
  UISize,
  UIVariant,
} from '@/components/ui';
import { getT } from '@/i18n/server';
import { getDashboardSummary } from '@/lib/api/dashboard';
import { formatCurrency } from '@/lib/utils/format';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

type Accent = {
  dot: string;
  value: string;
};

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default async function DashboardPage() {
  const [{ data: summary }, { t }] = await Promise.all([getDashboardSummary(), getT('dashboard')]);

  const stats: { label: string; value: string; accent: Accent }[] = [
    {
      label: t('cards.revenuePaid'),
      value: formatCurrency(summary.revenuePaid),
      accent: { dot: 'bg-primary-400', value: 'text-primary-700' },
    },
    {
      label: t('cards.outstanding'),
      value: formatCurrency(summary.outstanding),
      accent: { dot: 'bg-indigo-400', value: 'text-neutral-900' },
    },
    {
      label: t('cards.overdue'),
      value: String(summary.overdueCount),
      accent: { dot: 'bg-amber-400', value: 'text-amber-600' },
    },
    {
      label: t('cards.customers'),
      value: String(summary.customerCount),
      accent: { dot: 'bg-emerald-400', value: 'text-emerald-700' },
    },
  ];

  const recentActivity = summary.recentInvoices.slice(0, 5);

  return (
    <section className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-2xl text-neutral-900">{t('title')}</h1>
          <p className="text-neutral-500 text-sm">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant={UIVariant.Bordered} color={UIColor.Default} size={UISize.Md}>
              <RefreshCw size={15} />
              {t('actions.refresh')}
            </Button>
          </Link>
          <Link href="/invoices/new">
            <Button size={UISize.Md}>
              <Plus size={15} />
              {t('actions.newInvoice')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Hero stat bento */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="rounded-2xl">
              <CardBody className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${stat.accent.dot}`} />
                  <span className="text-neutral-500 text-sm">{stat.label}</span>
                </div>
                <span className={`font-semibold text-3xl tabular-nums ${stat.accent.value}`}>
                  {stat.value}
                </span>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Chart + status counts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="rounded-2xl lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('chart.title')}</CardTitle>
            </CardHeader>
            <CardBody>
              {summary.revenueByMonth.length === 0 ? (
                <div className="flex h-[280px] items-center justify-center text-neutral-400 text-sm">
                  {t('chart.empty')}
                </div>
              ) : (
                <RevenueChartLoader data={summary.revenueByMonth} />
              )}
            </CardBody>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>{t('rail.activity')}</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
              {recentActivity.length === 0 ? (
                <p className="py-6 text-center text-neutral-400 text-sm">{t('recent.empty')}</p>
              ) : (
                recentActivity.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/invoices/${invoice.id}`}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-neutral-100"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-100 font-semibold text-primary-700 text-xs">
                      {initials(invoice.customer.name)}
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium text-neutral-900 text-sm">
                        {invoice.customer.name}
                      </span>
                      <span className="truncate text-neutral-500 text-xs">{invoice.number}</span>
                    </div>
                    <span className="ml-auto shrink-0">
                      <InvoiceStatusBadge
                        status={invoice.status}
                        label={t(`status.${invoice.status}`)}
                      />
                    </span>
                  </Link>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
