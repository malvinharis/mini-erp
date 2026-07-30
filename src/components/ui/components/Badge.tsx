import { type VariantProps, cva } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

const badge = cva('inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs', {
  variants: {
    tone: {
      neutral: 'bg-[--color-surface-muted] text-[--color-text-muted]',
      primary: 'bg-[--color-primary] text-[--color-primary-foreground]',
      success: 'bg-[--color-success] text-white',
      warning: 'bg-[--color-warning] text-black',
      danger: 'bg-[--color-danger] text-white',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badge> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />;
}
