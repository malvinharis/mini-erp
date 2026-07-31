import { type VariantProps, cva } from 'class-variance-authority';
import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { fieldStateVariants } from '../lib/variants';

const textarea = cva(
  'w-full rounded-lg border bg-white text-gray-900 placeholder:text-gray-400 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:text-gray-50 dark:placeholder:text-gray-500',
  {
    variants: {
      color: fieldStateVariants,
      size: {
        sm: 'px-2.5 py-2 text-sm',
        md: 'px-3 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base',
      },
    },
    defaultVariants: { color: 'default', size: 'md' },
  },
);

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'color'>,
    VariantProps<typeof textarea> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, color, size, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(textarea({ color, size }), className)}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
