import { type VariantProps, cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { UIColor, UISize, fieldStateVariants } from '../lib/variants';

const select = cva(
  'w-full appearance-none rounded-xl border bg-white pr-9 text-neutral-900 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      color: fieldStateVariants,
      size: {
        [UISize.Sm]: 'h-8 pl-2.5 text-sm',
        [UISize.Md]: 'h-10 pl-3 text-sm',
        [UISize.Lg]: 'h-12 pl-4 text-base',
      },
    },
    defaultVariants: { color: UIColor.Default, size: UISize.Md },
  },
);

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'color' | 'size'>,
    VariantProps<typeof select> {
  /** Rounded-full pill visual for filter toolbars. */
  pill?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, color, size, pill, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(select({ color, size }), pill && 'rounded-full', className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-4 w-4 text-neutral-400"
      />
    </div>
  ),
);
Select.displayName = 'Select';
