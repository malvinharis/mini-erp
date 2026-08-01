'use client';
import { cn } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import { Contact, LayoutDashboard, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const baseItems = [
  { href: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/customers', labelKey: 'nav.customers', icon: Contact },
] as const;
const adminItems = [{ href: '/users', labelKey: 'nav.users', icon: Users }] as const;

export function Sidebar({ canManageUsers = false }: { canManageUsers?: boolean }) {
  const pathname = usePathname();
  const { t } = useTranslation('common');
  const items = canManageUsers ? [...baseItems, ...adminItems] : baseItems;

  return (
    <aside className="hidden w-60 shrink-0 border-gray-200 border-r bg-white dark:border-gray-800 dark:bg-gray-900 md:block">
      <div className="px-5 py-4 font-semibold text-lg">{t('app.name')}</div>
      <nav aria-label="Main navigation" className="flex flex-col gap-1 px-3">
        {items.map(({ href, labelKey, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
              )}
            >
              <Icon size={18} />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
