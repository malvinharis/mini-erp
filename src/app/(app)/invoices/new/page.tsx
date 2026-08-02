import { InvoiceForm } from '@/components/features/invoices/InvoiceForm';
import { getT } from '@/i18n/server';
import { listCustomers } from '@/lib/api/customers';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import { notFound } from 'next/navigation';

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const me = await getCurrentUser();
  if (!can(me.role, 'invoices.manage')) notFound();

  const { customerId } = await searchParams;
  const { t } = await getT('invoices');
  const { data: customers } = await listCustomers({ limit: 100 });

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-semibold text-2xl">{t('create.title')}</h1>
      <InvoiceForm customers={customers} defaultCustomerId={customerId} />
    </section>
  );
}
