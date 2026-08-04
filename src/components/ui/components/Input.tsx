import { type VariantProps, cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { UIColor, UISize, fieldStateVariants } from '../lib/variants';

const input = cva(
  'w-full rounded-xl border bg-white text-neutral-900 placeholder:text-neutral-400 transition-colors duration-150 ease-out focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      color: fieldStateVariants,
      size: {
        [UISize.Sm]: 'h-8 px-2.5 text-sm',
        [UISize.Md]: 'h-10 px-3 text-sm',
        [UISize.Lg]: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: { color: UIColor.Default, size: UISize.Md },
  },
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'size'>,
    VariantProps<typeof input> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, color, size, ...props }, ref) => (
    <input ref={ref} className={cn(input({ color, size }), className)} {...props} />
  ),
);
Input.displayName = 'Input';
