import { Badge, Button, EmptyState, TD, TH, THead, TR, Table } from '@/components/ui';
import { getT } from '@/i18n/server';
import { listExamples } from '@/lib/api/example';
import type { ExampleStatus } from '@/lib/schemas';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import Link from 'next/link';

const statusTone: Record<ExampleStatus, 'neutral' | 'success' | 'warning'> = {
  DRAFT: 'neutral',
  ACTIVE: 'success',
  ARCHIVED: 'warning',
};

export default async function ExampleListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? '1'));
  const { t } = await getT('example');
  const { data: rows, meta } = await listExamples({ page, limit: 20 });

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">{t('title')}</h1>
        <Link href="/example/new">
          <Button>{t('new')}</Button>
        </Link>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={t('empty')}
          description={t('emptyHint')}
          action={
            <Link href="/example/new">
              <Button>{t('new')}</Button>
            </Link>
          }
        />
      ) : (
        <>
          <Table>
            <THead>
              <TR>
                <TH>{t('fields.name')}</TH>
                <TH>{t('fields.status')}</TH>
                <TH>{t('fields.amount')}</TH>
                <TH>{t('fields.createdAt')}</TH>
              </TR>
            </THead>
            <tbody>
              {rows.map((row) => (
                <TR key={row.id}>
                  <TD>
                    <Link
                      href={`/example/${row.id}`}
                      className="text-[--color-primary] hover:underline"
                    >
                      {row.name}
                    </Link>
                  </TD>
                  <TD>
                    <Badge tone={statusTone[row.status]}>{t(`status.${row.status}`)}</Badge>
                  </TD>
                  <TD>{formatCurrency(row.amount)}</TD>
                  <TD>{formatDate(row.createdAt)}</TD>
                </TR>
              ))}
            </tbody>
          </Table>

          <nav aria-label="Pagination" className="flex items-center justify-between">
            <Link href={`/example?page=${page - 1}`} aria-disabled={page <= 1}>
              <Button variant="outline" size="sm" disabled={page <= 1}>
                Previous
              </Button>
            </Link>
            <span className="text-[--color-text-muted] text-sm">
              Page {meta?.page} of {meta?.totalPages}
            </span>
            <Link
              href={`/example?page=${page + 1}`}
              aria-disabled={page >= (meta?.totalPages ?? 1)}
            >
              <Button variant="outline" size="sm" disabled={page >= (meta?.totalPages ?? 1)}>
                Next
              </Button>
            </Link>
          </nav>
        </>
      )}
    </section>
  );
}
