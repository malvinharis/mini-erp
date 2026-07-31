import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

const spinner = cva(
  'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      color: {
        default: 'text-gray-500 dark:text-gray-400',
        primary: 'text-blue-600 dark:text-blue-500',
        success: 'text-green-600 dark:text-green-500',
        warning: 'text-amber-500 dark:text-amber-400',
        danger: 'text-red-600 dark:text-red-500',
      },
      size: {
        sm: 'h-3.5 w-3.5',
        md: 'h-4 w-4',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: { color: 'default', size: 'md' },
  },
);

export interface SpinnerProps extends VariantProps<typeof spinner> {
  className?: string;
}

export function Spinner({ className, color, size }: SpinnerProps) {
  return (
    <span role="status" aria-label="Loading" className={cn(spinner({ color, size }), className)} />
  );
}
