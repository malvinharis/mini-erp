import type { Route } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { UIColor, UISize, UIVariant } from '../lib/variants';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { TD, TH, THead, TR, Table } from './Table';

export interface DataTableColumn<T> {
  /** Unique key — also used as the React list key for header/cell. */
  key: string;
  header: ReactNode;
  /** Cell content for one row. */
  render: (row: T) => ReactNode;
  /** Right-align header + cell (numeric columns, trailing actions). */
  align?: 'left' | 'right';
  /** Passed through to TH — `false` hides the default filter glyph. */
  hint?: ReactNode | false;
  className?: string;
}

export interface DataTablePagination {
  page: number;
  totalPages: number;
  /** Build the href for a given page number (keeps other query params). */
  buildHref: (page: number) => string;
  /** e.g. "42 invoices · page 1 of 3". Omit for a bare page-number row. */
  summary?: ReactNode;
}

const ELLIPSIS = 'ellipsis' as const;

/** 1, …, current-1..current+1, …, total — collapses long ranges. */
function pageNumbers(current: number, total: number): (number | typeof ELLIPSIS)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | typeof ELLIPSIS)[] = [];
  let previous: number | undefined;
  for (const p of sorted) {
    if (previous !== undefined && p - previous > 1) result.push(ELLIPSIS);
    result.push(p);
    previous = p;
  }
  return result;
}

export interface DataTableEmptyState {
  title: string;
  description?: string;
  action?: ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  empty: DataTableEmptyState;
  pagination?: DataTablePagination;
  className?: string;
}

/**
 * Declarative list table — column config + data in, Table/EmptyState/pagination
 * nav out. Pagination renders plain `next/link`s (no client state), so it
 * works unmodified inside async Server Component pages.
 */
export function DataTable<T>({
  columns,
  data,
  getRowKey,
  empty,
  pagination,
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState {...empty} />;
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Table>
        <THead>
          <TR>
            {columns.map((col) => (
              <TH
                key={col.key}
                hint={col.hint}
                className={cn(col.align === 'right' && 'text-right', col.className)}
              >
                {col.header}
              </TH>
            ))}
          </TR>
        </THead>
        <tbody>
          {data.map((row) => (
            <TR key={getRowKey(row)}>
              {columns.map((col) => (
                <TD
                  key={col.key}
                  className={cn(col.align === 'right' && 'text-right', col.className)}
                >
                  {col.render(row)}
                </TD>
              ))}
            </TR>
          ))}
        </tbody>
      </Table>

      {pagination && pagination.totalPages > 1 ? (
        <nav aria-label="Pagination" className="flex items-center justify-center">
          <div className="flex items-center gap-1">
            {pageNumbers(pagination.page, pagination.totalPages).map((p, i) =>
              p === ELLIPSIS ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: static gaps, never reordered
                <span key={`ellipsis-${i}`} className="px-1.5 text-neutral-400 text-sm">
                  …
                </span>
              ) : (
                <Link
                  key={p}
                  href={pagination.buildHref(p) as Route}
                  aria-current={p === pagination.page ? 'page' : undefined}
                >
                  <Button
                    variant={p === pagination.page ? UIVariant.Solid : UIVariant.Bordered}
                    color={p === pagination.page ? UIColor.Primary : UIColor.Default}
                    size={UISize.Sm}
                    className="min-w-9 px-0"
                  >
                    {p}
                  </Button>
                </Link>
              ),
            )}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
