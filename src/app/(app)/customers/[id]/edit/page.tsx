import { CustomerForm } from '@/components/features/customers/CustomerForm';
import { getT } from '@/i18n/server';
import { getCustomer } from '@/lib/api/customers';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import { notFound } from 'next/navigation';

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await getCurrentUser();
  if (!can(me.role, 'customers.manage')) notFound();

  const { id } = await params;
  const { t } = await getT('customers');
  const { data: customer } = await getCustomer(id);

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-semibold text-2xl">{t('edit.title')}</h1>
      <CustomerForm customer={customer} />
    </section>
  );
}
