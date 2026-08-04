'use client';

import { Button, Spinner, UIColor, UISize, UIVariant } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import useFetcher, { HttpMethod } from '@/lib/hooks/useFetcher';
import { INVOICE_TRANSITIONS, type Invoice, InvoiceStatus } from '@/lib/schemas';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  invoice: Invoice;
  canManage: boolean;
  isAdmin: boolean;
}

export function InvoiceStatusActions({ invoice, canManage, isAdmin }: Props) {
  const { t } = useTranslation('invoices');
  const router = useRouter();
  const [pending, setPending] = useState<InvoiceStatus | null>(null);
  const { fetchData: changeStatus } = useFetcher<Invoice>({ method: HttpMethod.POST });

  if (!canManage) return null;

  const nextStatuses = INVOICE_TRANSITIONS[invoice.status].filter(
    (s) => s !== InvoiceStatus.CANCELLED || isAdmin,
  );
  if (nextStatuses.length === 0) return null;

  async function transition(status: InvoiceStatus) {
    const message =
      status === InvoiceStatus.CANCELLED
        ? t('confirm.cancel')
        : t('confirm.status', { status: t(`status.${status}`) });
    if (!window.confirm(message)) return;
    setPending(status);
    try {
      await changeStatus({ url: `invoices/${invoice.id}/status`, data: { status } });
      toast.success(t('toast.statusChanged'));
      router.refresh();
    } catch {
      // useFetcher already toasts the error (showNotification defaults true).
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {nextStatuses.map((status) => {
        const isCancel = status === InvoiceStatus.CANCELLED;
        return (
          <Button
            key={status}
            variant={isCancel ? UIVariant.Flat : UIVariant.Solid}
            color={isCancel ? UIColor.Danger : UIColor.Primary}
            size={UISize.Md}
            disabled={pending !== null}
            onClick={() => transition(status)}
            className="flex items-center gap-2"
          >
            {pending === status && (
              <Spinner size={UISize.Sm} color={isCancel ? UIColor.Danger : undefined} />
            )}
            {isCancel ? t('actions.cancel') : t(`status.${status}`)}
          </Button>
        );
      })}
    </div>
  );
}
