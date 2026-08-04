import { CustomerForm } from '@/components/features/customers/CustomerForm';
import { Card, CardBody } from '@/components/ui';
import { getT } from '@/i18n/server';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import { notFound } from 'next/navigation';

export default async function NewCustomerPage() {
  const me = await getCurrentUser();
  if (!can(me.role, 'customers.manage')) notFound();

  const { t } = await getT('customers');

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-semibold text-2xl">{t('create.title')}</h1>
      <Card className="max-w-2xl rounded-2xl">
        <CardBody>
          <CustomerForm />
        </CardBody>
      </Card>
    </section>
  );
}
