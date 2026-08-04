import { type VariantProps, cva } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { UIColor, UISize, UIVariant, colorVariants } from '../lib/variants';

const badge = cva('inline-flex items-center rounded-full font-medium', {
  variants: {
    size: {
      [UISize.Sm]: 'px-2 py-0.5 text-xs',
      [UISize.Md]: 'px-2.5 py-1 text-xs',
    },
  },
  defaultVariants: { size: UISize.Md },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof badge>, 'color'> {
  variant?: UIVariant;
  color?: UIColor;
}

export function Badge({
  className,
  variant = UIVariant.Flat,
  color = UIColor.Default,
  size,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badge({ size }), colorVariants[variant][color], className)} {...props} />
  );
}
