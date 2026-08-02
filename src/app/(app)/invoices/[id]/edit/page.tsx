import { InvoiceForm } from '@/components/features/invoices/InvoiceForm';
import { getT } from '@/i18n/server';
import { listCustomers } from '@/lib/api/customers';
import { getInvoice } from '@/lib/api/invoices';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import { InvoiceStatus } from '@/lib/schemas';
import { notFound } from 'next/navigation';

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await getCurrentUser();
  if (!can(me.role, 'invoices.manage')) notFound();

  const { id } = await params;
  const { t } = await getT('invoices');
  const { data: invoice } = await getInvoice(id);
  // Non-draft invoices are read-only.
  if (invoice.status !== InvoiceStatus.DRAFT) notFound();

  const { data: customers } = await listCustomers({ limit: 100 });

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-semibold text-2xl">{t('edit.title')}</h1>
      <InvoiceForm invoice={invoice} customers={customers} />
    </section>
  );
}
