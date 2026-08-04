'use client';
import { cn } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const baseItems = [
  { href: '/', labelKey: 'nav.dashboard' },
  { href: '/customers', labelKey: 'nav.customers' },
  { href: '/invoices', labelKey: 'nav.invoices' },
] as const;
const adminItems = [{ href: '/users', labelKey: 'nav.users' }] as const;

export function TopNav({ canManageUsers = false }: { canManageUsers?: boolean }) {
  const pathname = usePathname();
  const { t } = useTranslation('common');
  const items = canManageUsers ? [...baseItems, ...adminItems] : baseItems;

  return (
    <nav
      aria-label="Main navigation"
      className="flex flex-auto min-w-0 items-center gap-2 overflow-x-auto "
    >
      {items.map(({ href, labelKey }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'whitespace-nowrap rounded-full border px-5 py-2 font-medium text-sm backdrop-blur-md transition-colors',
              active
                ? 'border-primary-300 text-primary-900 shadow-sm'
                : 'border-black/5 bg-neutral-50/80 text-neutral-700 hover:bg-primary-300/90 hover:text-primary-900',
            )}
          >
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
