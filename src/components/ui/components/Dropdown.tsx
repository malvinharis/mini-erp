'use client';

import { AnimatePresence, motion } from 'motion/react';
import {
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';

export interface DropdownProps {
  trigger: ReactElement;
  children: ReactNode;
  align?: 'start' | 'end';
  className?: string;
}

export function Dropdown({ trigger, children, align = 'start', className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: (align === 'end' ? rect.right : rect.left) + window.scrollX,
      });
    }
    setOpen(true);
  };

  const closeMenu = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: closeMenu only reads stable refs/setOpen
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      closeMenu(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
    first?.focus();
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLElement);

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus();
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    }
    if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
    }
    if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  const clonedTrigger = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        ref: triggerRef,
        onClick: () => (open ? closeMenu() : openMenu()),
        'aria-haspopup': 'menu',
        'aria-expanded': open,
      })
    : trigger;

  return (
    <>
      {clonedTrigger}
      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  ref={panelRef}
                  role="menu"
                  onKeyDown={handleKeyDown}
                  onClickCapture={(event) => {
                    if ((event.target as HTMLElement).closest('[role="menuitem"]')) closeMenu();
                  }}
                  initial={{ opacity: 0, scale: 0.96, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -4 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    position: 'absolute',
                    top: position.top,
                    left: position.left,
                    transform: align === 'end' ? 'translateX(-100%)' : undefined,
                  }}
                  className={cn(
                    'z-50 min-w-40 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900',
                    className,
                  )}
                >
                  {children}
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

export function DropdownItem({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      className={cn(
        'w-full rounded-lg px-3 py-2 text-left text-gray-700 text-sm transition-colors duration-150 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800',
        className,
      )}
      {...props}
    />
  );
}
