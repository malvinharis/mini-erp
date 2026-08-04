/** Shared color scale — Button, Badge, Spinner, Select/Input/Textarea field state. */
export enum UIColor {
  Default = 'default',
  Primary = 'primary',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
}

/** Visual weight — solid fill, outlined, or tinted flat background. */
export enum UIVariant {
  Solid = 'solid',
  Bordered = 'bordered',
  Flat = 'flat',
}

/** Shared size scale — Button, Input, Select, Textarea, Spinner, Badge (sm/md subset). */
export enum UISize {
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
}

/** Avatar has its own scale (adds `xl`) — kept separate from UISize. */
export enum AvatarSize {
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
  Xl = 'xl',
}

/** Modal has its own scale (adds `full`) — kept separate from UISize. */
export enum ModalSize {
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
  Full = 'full',
}

/** Card surface treatment — distinct from UIVariant (no solid fill). */
export enum CardVariant {
  Flat = 'flat',
  Bordered = 'bordered',
  Shadow = 'shadow',
}

/**
 * variant x color class lookup, shared by Button/Badge/Chip. A plain object
 * map instead of CVA compoundVariants — 3 x 5 combinations read better as a
 * table than as 15 compoundVariants entries.
 */
export const colorVariants: Record<UIVariant, Record<UIColor, string>> = {
  [UIVariant.Solid]: {
    [UIColor.Default]:
      'bg-neutral-800 text-white hover:bg-neutral-900 focus-visible:ring-neutral-500',
    [UIColor.Primary]:
      'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
    [UIColor.Success]:
      'bg-success-600 text-white hover:bg-success-700 focus-visible:ring-success-500',
    [UIColor.Warning]:
      'bg-warning-500 text-neutral-900 hover:bg-warning-600 focus-visible:ring-warning-500',
    [UIColor.Danger]: 'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500',
  },
  [UIVariant.Bordered]: {
    [UIColor.Default]:
      'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus-visible:ring-neutral-500',
    [UIColor.Primary]:
      'border border-primary-300 text-primary-700 hover:bg-primary-50 focus-visible:ring-primary-500',
    [UIColor.Success]:
      'border border-success-300 text-success-700 hover:bg-success-50 focus-visible:ring-success-500',
    [UIColor.Warning]:
      'border border-warning-300 text-warning-700 hover:bg-warning-50 focus-visible:ring-warning-500',
    [UIColor.Danger]:
      'border border-danger-300 text-danger-700 hover:bg-danger-50 focus-visible:ring-danger-500',
  },
  [UIVariant.Flat]: {
    [UIColor.Default]:
      'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus-visible:ring-neutral-500',
    [UIColor.Primary]:
      'bg-primary-100 text-primary-700 hover:bg-primary-200 focus-visible:ring-primary-500',
    [UIColor.Success]:
      'bg-success-100 text-success-700 hover:bg-success-200 focus-visible:ring-success-500',
    [UIColor.Warning]:
      'bg-warning-100 text-warning-700 hover:bg-warning-200 focus-visible:ring-warning-500',
    [UIColor.Danger]:
      'bg-danger-100 text-danger-700 hover:bg-danger-200 focus-visible:ring-danger-500',
  },
};

/** Border/ring color for validation-style states (Input/Textarea/Select). */
export const fieldStateVariants: Record<
  UIColor.Default | UIColor.Success | UIColor.Danger,
  string
> = {
  [UIColor.Default]: 'border-neutral-200 focus-visible:ring-primary-500',
  [UIColor.Success]: 'border-success-400 focus-visible:ring-success-500',
  [UIColor.Danger]: 'border-danger-400 focus-visible:ring-danger-500',
};
