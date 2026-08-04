'use client';
import { cn } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import { Contact, FileText, LayoutDashboard, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const baseItems = [
  { href: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/customers', labelKey: 'nav.customers', icon: Contact },
  { href: '/invoices', labelKey: 'nav.invoices', icon: FileText },
] as const;
const adminItems = [{ href: '/users', labelKey: 'nav.users', icon: Users }] as const;

export function Sidebar({ canManageUsers = false }: { canManageUsers?: boolean }) {
  const pathname = usePathname();
  const { t } = useTranslation('common');
  const items = canManageUsers ? [...baseItems, ...adminItems] : baseItems;

  return (
    <aside className="hidden w-60 shrink-0 border-neutral-200 border-r bg-white md:block">
      <div className="px-6 py-5 font-semibold text-lg text-neutral-900">{t('app.name')}</div>
      <nav aria-label="Main navigation" className="flex flex-col gap-1 px-4">
        {items.map(({ href, labelKey, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-full px-4 py-2.5 font-medium text-sm transition-colors',
                active
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
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
