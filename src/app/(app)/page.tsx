import { getT } from '@/i18n/server';
import { getCurrentUser } from '@/lib/auth/rbac';

export default async function DashboardPage() {
  const [user, { t }] = await Promise.all([getCurrentUser(), getT('common')]);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-semibold text-2xl">{t('dashboard.welcome', { name: user.name })}</h1>
    </section>
  );
}
