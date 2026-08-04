import { type VariantProps, cva } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { CardVariant } from '../lib/variants';

const card = cva('rounded-2xl bg-white/70 backdrop-blur-md', {
  variants: {
    variant: {
      [CardVariant.Flat]: 'border border-white/50',
      [CardVariant.Bordered]: 'border border-white/50',
      [CardVariant.Shadow]: 'border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)]',
    },
  },
  defaultVariants: { variant: CardVariant.Shadow },
});

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof card> {}

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(card({ variant }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-neutral-200 border-b px-6 py-5', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-semibold text-neutral-900 text-lg', className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-5', className)} {...props} />;
}
