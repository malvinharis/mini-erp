'use client';

import { Button, Input, Select, UIColor, UISize, UIVariant } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import { InvoiceStatus } from '@/lib/schemas';
import { formatDate } from '@/lib/utils/format';
import { Calendar, Search } from 'lucide-react';
import type { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const DEBOUNCE_MS = 300;

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
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

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

  useEffect(() => {
    const id = setTimeout(() => setParam('search', search), DEBOUNCE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
      <div className="relative min-w-56 flex-1">
        <Search size={16} className="-translate-y-1/2 absolute top-1/2 left-3 text-neutral-400" />
        <Input
          value={search}
          size={UISize.Md}
          aria-label={t('actions.search')}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="rounded-full border-neutral-200 bg-neutral-100 pl-9 focus-visible:bg-white"
        />
      </div>

      <Select
        pill
        size={UISize.Md}
        aria-label={t('filters.status')}
        value={searchParams.get('status') ?? ''}
        onChange={(e) => setParam('status', e.target.value)}
        className="w-32 shrink-0 border-neutral-200 bg-neutral-100"
      >
        <option value="">{t('filters.allStatuses')}</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {t(`status.${s}`)}
          </option>
        ))}
      </Select>

      <Select
        pill
        size={UISize.Md}
        aria-label={t('filters.customer')}
        value={searchParams.get('customerId') ?? ''}
        onChange={(e) => setParam('customerId', e.target.value)}
        className="w-36 shrink-0 border-neutral-200 bg-neutral-100"
      >
        <option value="">{t('filters.allCustomers')}</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <DateFilterButton
        label={t('filters.from')}
        value={searchParams.get('from') ?? ''}
        onChange={(v) => setParam('from', v)}
      />
      <DateFilterButton
        label={t('filters.to')}
        value={searchParams.get('to') ?? ''}
        onChange={(v) => setParam('to', v)}
      />
    </div>
  );
}

interface DateFilterButtonProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * A single real button — clicking it calls the hidden date input's
 * `showPicker()` to open the browser's native date picker. Shows the label
 * until a date is picked, the formatted date after.
 */
function DateFilterButton({ label, value, onChange }: DateFilterButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;
    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker();
        return;
      } catch {
        // falls through to focus() below (e.g. not user-activated context)
      }
    }
    input.focus();
  }

  return (
    <div className="relative w-40 shrink-0">
      <Button
        type="button"
        variant={UIVariant.Bordered}
        color={UIColor.Default}
        size={UISize.Md}
        onClick={openPicker}
        className="w-full justify-between border-neutral-200 bg-neutral-100 font-normal"
      >
        <span className={value ? undefined : 'text-neutral-400'}>
          {value ? formatDate(value) : label}
        </span>
        <Calendar size={16} className="text-neutral-400" />
      </Button>
      <input
        ref={inputRef}
        type="date"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        className="sr-only"
      />
    </div>
  );
}
