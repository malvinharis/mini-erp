'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import { type HTMLMotionProps, motion } from 'motion/react';
import { forwardRef } from 'react';
import { cn } from '../lib/cn';
import { type UIColor, type UIVariant, colorVariants } from '../lib/variants';

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'color'>,
    VariantProps<typeof button> {
  variant?: UIVariant;
  color?: UIColor;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'solid', color = 'primary', size, type = 'button', ...props }, ref) => (
    <motion.button
      ref={ref}
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={cn(button({ size }), colorVariants[variant][color], className)}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
