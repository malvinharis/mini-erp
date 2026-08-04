'use client';

import { useState } from 'react';
import { cn } from '../lib/cn';
import { AvatarSize } from '../lib/variants';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  ring?: boolean;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  [AvatarSize.Sm]: 'h-8 w-8 text-xs',
  [AvatarSize.Md]: 'h-10 w-10 text-sm',
  [AvatarSize.Lg]: 'h-14 w-14 text-lg',
  [AvatarSize.Xl]: 'h-20 w-20 text-2xl',
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts.at(0)?.[0] ?? '';
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

export function Avatar({
  src,
  name = '',
  size = AvatarSize.Md,
  ring = false,
  className,
}: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300',
        sizeClasses[size],
        ring && 'ring-2 ring-white ring-offset-2 dark:ring-gray-900',
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  );
}
