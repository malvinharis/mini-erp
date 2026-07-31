import { cn } from '../lib/cn';
import { Button } from './Button';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-between gap-4', className)}
    >
      <Button
        variant="bordered"
        color="default"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-gray-500 text-sm dark:text-gray-400">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="bordered"
        color="default"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
