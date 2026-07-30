import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui';
import { listExamples } from '@/lib/api/example';
import Link from 'next/link';

export default async function DashboardPage() {
  const { meta } = await listExamples({ limit: 1 });

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-semibold text-2xl">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="font-semibold text-3xl">{meta?.total ?? 0}</p>
            <Link href="/example" className="text-[--color-primary] text-sm hover:underline">
              View all →
            </Link>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
