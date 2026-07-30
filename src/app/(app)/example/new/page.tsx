import { ExampleForm } from '@/components/features/example/ExampleForm';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui';
import { getT } from '@/i18n/server';
import { createExampleAction } from '../actions';

export default async function NewExamplePage() {
  const { t } = await getT('example');
  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-semibold text-2xl">{t('new')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('new')}</CardTitle>
        </CardHeader>
        <CardBody>
          <ExampleForm onSubmit={createExampleAction} submitLabel={t('new')} />
        </CardBody>
      </Card>
    </section>
  );
}
