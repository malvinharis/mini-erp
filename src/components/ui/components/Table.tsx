import type { HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className={cn('w-full border-collapse text-sm', className)} {...props} />
    </div>
  );
}

export function THead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-gray-50 dark:bg-gray-900" {...props} />;
}

export function TR({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-gray-100 border-b transition-colors duration-150 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900',
        className,
      )}
      {...props}
    />
  );
}

export function TH({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn('px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400', className)}
      {...props}
    />
  );
}

export function TD({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-3 text-gray-900 dark:text-gray-50', className)} {...props} />;
}
