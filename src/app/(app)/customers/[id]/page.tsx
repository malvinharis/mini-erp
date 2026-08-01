import { Button, Card, CardBody, CardHeader, CardTitle } from '@/components/ui';
import { getT } from '@/i18n/server';
import { getCustomer } from '@/lib/api/customers';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await getCurrentUser();
  const canManage = can(me.role, 'customers.manage');

  const { id } = await params;
  const { t } = await getT('customers');
  const { data: customer } = await getCustomer(id);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Link
          href="/customers"
          className="flex items-center gap-2 font-semibold text-2xl hover:underline"
        >
          <ArrowLeft size={20} />
          {customer.name}
        </Link>
        {canManage ? (
          <Link href={`/customers/${customer.id}/edit`}>
            <Button>{t('detail.edit')}</Button>
          </Link>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('detail.contact')}</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-col gap-2 text-sm">
          <div className="flex gap-2">
            <span className="w-24 text-gray-500 dark:text-gray-400">{t('fields.email')}</span>
            <span>{customer.email}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 text-gray-500 dark:text-gray-400">{t('fields.phone')}</span>
            <span>{customer.phone ?? '—'}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 text-gray-500 dark:text-gray-400">{t('fields.npwp')}</span>
            <span>{customer.npwp ?? '—'}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 text-gray-500 dark:text-gray-400">{t('fields.address')}</span>
            <span>{customer.address ?? '—'}</span>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
