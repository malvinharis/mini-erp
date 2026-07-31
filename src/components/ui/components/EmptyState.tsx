import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 border-dashed px-6 py-12 text-center dark:border-gray-700',
        className,
      )}
    >
      <p className="font-medium text-gray-900 dark:text-gray-50">{title}</p>
      {description ? (
        <p className="text-gray-500 text-sm dark:text-gray-400">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
