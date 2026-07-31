export type UIColor = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export type UIVariant = 'solid' | 'bordered' | 'flat';

/**
 * variant x color class lookup, shared by Button/Badge/Chip. A plain object
 * map instead of CVA compoundVariants — 3 x 5 combinations read better as a
 * table than as 15 compoundVariants entries.
 */
export const colorVariants: Record<UIVariant, Record<UIColor, string>> = {
  solid: {
    default:
      'bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500 dark:bg-gray-500 dark:hover:bg-gray-400',
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400',
    success:
      'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 dark:bg-green-500 dark:hover:bg-green-400',
    warning:
      'bg-amber-500 text-gray-900 hover:bg-amber-600 focus-visible:ring-amber-500 dark:bg-amber-400 dark:text-gray-900 dark:hover:bg-amber-300',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 dark:bg-red-500 dark:hover:bg-red-400',
  },
  bordered: {
    default:
      'border border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800',
    primary:
      'border border-blue-300 text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-500 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950',
    success:
      'border border-green-300 text-green-700 hover:bg-green-50 focus-visible:ring-green-500 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-950',
    warning:
      'border border-amber-300 text-amber-700 hover:bg-amber-50 focus-visible:ring-amber-500 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950',
    danger:
      'border border-red-300 text-red-700 hover:bg-red-50 focus-visible:ring-red-500 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950',
  },
  flat: {
    default:
      'bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-500 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
    primary:
      'bg-blue-100 text-blue-700 hover:bg-blue-200 focus-visible:ring-blue-500 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800',
    success:
      'bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800',
    warning:
      'bg-amber-100 text-amber-700 hover:bg-amber-200 focus-visible:ring-amber-500 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800',
    danger:
      'bg-red-100 text-red-700 hover:bg-red-200 focus-visible:ring-red-500 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800',
  },
};

/** Border/ring color for validation-style states (Input/Textarea/Select). */
export const fieldStateVariants: Record<'default' | 'success' | 'danger', string> = {
  default: 'border-gray-300 focus-visible:ring-blue-500 dark:border-gray-700',
  success: 'border-green-400 focus-visible:ring-green-500 dark:border-green-600',
  danger: 'border-red-400 focus-visible:ring-red-500 dark:border-red-600',
};
