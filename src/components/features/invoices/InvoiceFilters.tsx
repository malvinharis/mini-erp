'use client';

import { Input, Select } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import { InvoiceStatus } from '@/lib/schemas';
import type { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const STATUSES = [
  InvoiceStatus.DRAFT,
  InvoiceStatus.SENT,
  InvoiceStatus.PAID,
  InvoiceStatus.OVERDUE,
  InvoiceStatus.CANCELLED,
] as const;

interface CustomerOption {
  id: string;
  name: string;
}

interface Props {
  customers: CustomerOption[];
}

export function InvoiceFilters({ customers }: Props) {
  const { t } = useTranslation('invoices');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ''}` as Route);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        {t('filters.status')}
        <Select
          value={searchParams.get('status') ?? ''}
          onChange={(e) => setParam('status', e.target.value)}
          className="min-w-40"
        >
          <option value="">{t('filters.allStatuses')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`status.${s}`)}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        {t('filters.customer')}
        <Select
          value={searchParams.get('customerId') ?? ''}
          onChange={(e) => setParam('customerId', e.target.value)}
          className="min-w-48"
        >
          <option value="">{t('filters.allCustomers')}</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        {t('filters.from')}
        <Input
          type="date"
          value={searchParams.get('from') ?? ''}
          onChange={(e) => setParam('from', e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        {t('filters.to')}
        <Input
          type="date"
          value={searchParams.get('to') ?? ''}
          onChange={(e) => setParam('to', e.target.value)}
        />
      </label>
    </div>
  );
}
