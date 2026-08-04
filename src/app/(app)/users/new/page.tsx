import { UserForm } from '@/components/features/users/UserForm';
import { Card, CardBody } from '@/components/ui';
import { getT } from '@/i18n/server';
import { can, getCurrentUser } from '@/lib/auth/rbac';
import { notFound } from 'next/navigation';

export default async function NewUserPage() {
  const me = await getCurrentUser();
  if (!can(me.role, 'users.manage')) notFound();

  const { t } = await getT('users');

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-semibold text-2xl">{t('create.title')}</h1>
      <Card className="max-w-2xl rounded-2xl">
        <CardBody>
          <UserForm />
        </CardBody>
      </Card>
    </section>
  );
}
