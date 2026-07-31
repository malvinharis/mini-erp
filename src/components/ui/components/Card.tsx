import { type VariantProps, cva } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

const card = cva('rounded-xl bg-white dark:bg-gray-900', {
  variants: {
    variant: {
      flat: 'border border-gray-100 dark:border-gray-800',
      bordered: 'border border-gray-200 dark:border-gray-700',
      shadow: 'border border-gray-100 shadow-md dark:border-gray-800',
    },
  },
  defaultVariants: { variant: 'shadow' },
});

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof card> {}

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(card({ variant }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-gray-100 border-b px-5 py-4 dark:border-gray-800', className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-semibold text-gray-900 text-lg dark:text-gray-50', className)}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-4', className)} {...props} />;
}
