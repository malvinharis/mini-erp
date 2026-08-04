'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  Spinner,
  UIColor,
  UISize,
  UIVariant,
} from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import useFetcher, { HttpMethod } from '@/lib/hooks/useFetcher';
import type { Customer } from '@/lib/schemas';
import { MoreVertical } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  customer: Customer;
}

export function CustomerRowActions({ customer }: Props) {
  const { t } = useTranslation('customers');
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const { fetchData: deleteCustomer } = useFetcher<null>({ method: HttpMethod.DELETE });

  async function remove() {
    if (!window.confirm(t('confirm.delete'))) return;
    setPending(true);
    try {
      await deleteCustomer({ url: `customers/${customer.id}` });
      toast.success(t('toast.deleted'));
      router.refresh();
    } catch {
      // useFetcher already toasts the error (showNotification defaults true).
    } finally {
      setPending(false);
    }
  }

  return (
    <Dropdown
      align="end"
      trigger={
        <Button
          variant={UIVariant.Flat}
          color={UIColor.Default}
          size={UISize.Md}
          aria-label={t('actions.menu')}
        >
          <MoreVertical size={16} />
        </Button>
      }
    >
      <DropdownItem onClick={() => router.push(`/customers/${customer.id}` as Route)}>
        {t('actions.view')}
      </DropdownItem>
      <DropdownItem onClick={() => router.push(`/customers/${customer.id}/edit` as Route)}>
        {t('actions.edit')}
      </DropdownItem>
      <DropdownItem
        disabled={pending}
        className="text-danger hover:bg-danger/10 dark:text-danger"
        onClick={remove}
      >
        <span className="flex items-center gap-2">
          {pending && <Spinner size={UISize.Sm} color={UIColor.Danger} />}
          {t('actions.delete')}
        </span>
      </DropdownItem>
    </Dropdown>
  );
}
