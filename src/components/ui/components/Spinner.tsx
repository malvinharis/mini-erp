import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { UIColor, UISize } from '../lib/variants';

const spinner = cva(
  'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      color: {
        [UIColor.Default]: 'text-gray-500',
        [UIColor.Primary]: 'text-primary-600',
        [UIColor.Success]: 'text-success-600',
        [UIColor.Warning]: 'text-warning-500',
        [UIColor.Danger]: 'text-danger-600',
      },
      size: {
        [UISize.Sm]: 'h-3.5 w-3.5',
        [UISize.Md]: 'h-4 w-4',
        [UISize.Lg]: 'h-6 w-6',
      },
    },
    defaultVariants: { color: UIColor.Default, size: UISize.Md },
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
