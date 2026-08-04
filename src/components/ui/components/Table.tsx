import type { HTMLAttributes, ReactNode, TableHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]">
      <table className={cn('w-full border-collapse text-sm', className)} {...props} />
    </div>
  );
}

export function THead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="border-neutral-100 border-b bg-neutral-50/60" {...props} />;
}

export function TR({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-neutral-100 border-b transition-colors duration-150 last:border-0 hover:bg-neutral-50',
        className,
      )}
      {...props}
    />
  );
}

export interface THProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Optional affordance rendered next to the label (e.g. a sort icon). */
  hint?: ReactNode;
}

export function TH({ className, hint, children, ...props }: THProps) {
  return (
    <th
      className={cn(
        'px-4 py-2.5 text-left font-medium text-[11px] text-neutral-500 uppercase tracking-wider',
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        {hint || null}
      </span>
    </th>
  );
}

export function TD({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-2.5 text-neutral-700', className)} {...props} />;
}
