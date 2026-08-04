'use client';

import { Button, Dropdown, DropdownItem, UIColor, UISize, UIVariant } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import { InvoiceStatus } from '@/lib/schemas';
import { MoreVertical } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';

interface Props {
  invoice: { id: string; status: InvoiceStatus };
  canManage: boolean;
}

export function InvoiceRowActions({ invoice, canManage }: Props) {
  const { t } = useTranslation('invoices');
  const router = useRouter();
  // Only DRAFT invoices can be edited — matches /invoices/[id]/edit's own guard.
  const canEdit = canManage && invoice.status === InvoiceStatus.DRAFT;

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
      <DropdownItem onClick={() => router.push(`/invoices/${invoice.id}` as Route)}>
        {t('actions.view')}
      </DropdownItem>
      {canEdit ? (
        <DropdownItem onClick={() => router.push(`/invoices/${invoice.id}/edit` as Route)}>
          {t('actions.edit')}
        </DropdownItem>
      ) : null}
    </Dropdown>
  );
}
