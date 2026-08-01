'use client';

import { Button, Spinner } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import useFetcher, { HttpMethod } from '@/lib/hooks/useFetcher';
import type { Customer } from '@/lib/schemas';
import Link from 'next/link';
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
    <div className="flex items-center gap-2">
      <Link href={`/customers/${customer.id}/edit`}>
        <Button variant="flat" color="default" size="sm">
          {t('actions.edit')}
        </Button>
      </Link>
      <Button
        variant="flat"
        color="danger"
        size="sm"
        disabled={pending}
        onClick={remove}
        className="flex items-center gap-2"
      >
        {pending && <Spinner size="sm" color="danger" />}
        {t('actions.delete')}
      </Button>
    </div>
  );
}
