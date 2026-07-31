'use client';

import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useEffect, useRef } from 'react';
import { cn } from '../lib/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const sizeClasses: Record<'sm' | 'md' | 'lg' | 'full', string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

export function Modal({ open, onClose, children, size = 'md', className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    dialog.showModal();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Esc already closes via the native `cancel` event handled above
    <dialog
      ref={dialogRef}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto border-none bg-transparent p-0 backdrop:bg-gray-900/50"
    >
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'w-full rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900',
              sizeClasses[size],
              className,
            )}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </dialog>
  );
}
