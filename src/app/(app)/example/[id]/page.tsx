import { ExampleForm } from '@/components/features/example/ExampleForm';
import { Button, Card, CardBody, CardHeader, CardTitle } from '@/components/ui';
import { getT } from '@/i18n/server';
import { getExample } from '@/lib/api/example';
import { deleteExampleAction, updateExampleAction } from '../actions';

export default async function ExampleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { t } = await getT('example');
  const { data: example } = await getExample(id);

  const update = updateExampleAction.bind(null, id);
  const remove = deleteExampleAction.bind(null, id);

  return (
    <section className="flex max-w-2xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">{example.name}</h1>
        <form action={remove}>
          <Button type="submit" variant="danger" size="sm">
            Delete
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit</CardTitle>
        </CardHeader>
        <CardBody>
          <ExampleForm
            defaultValues={{
              name: example.name,
              status: example.status,
              amount: Number(example.amount),
            }}
            onSubmit={update}
            submitLabel="Save"
          />
        </CardBody>
      </Card>
    </section>
  );
}
