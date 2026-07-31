import { type VariantProps, cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { fieldStateVariants } from '../lib/variants';

const select = cva(
  'w-full appearance-none rounded-lg border bg-white pr-9 text-gray-900 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:text-gray-50',
  {
    variants: {
      color: fieldStateVariants,
      size: {
        sm: 'h-8 pl-2.5 text-sm',
        md: 'h-10 pl-3 text-sm',
        lg: 'h-12 pl-4 text-base',
      },
    },
    defaultVariants: { color: 'default', size: 'md' },
  },
);

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'color' | 'size'>,
    VariantProps<typeof select> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, color, size, children, ...props }, ref) => (
    <div className="relative">
      <select ref={ref} className={cn(select({ color, size }), className)} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-4 w-4 text-gray-400 dark:text-gray-500"
      />
    </div>
  ),
);
Select.displayName = 'Select';
