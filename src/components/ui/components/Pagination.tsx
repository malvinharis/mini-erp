import { cn } from '../lib/cn';
import { UIColor, UISize, UIVariant } from '../lib/variants';
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
        variant={UIVariant.Bordered}
        color={UIColor.Default}
        size={UISize.Md}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-neutral-500 text-sm">
        Page {page} of {totalPages}
      </span>
      <Button
        variant={UIVariant.Bordered}
        color={UIColor.Default}
        size={UISize.Md}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
