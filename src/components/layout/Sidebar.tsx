'use client';
import { cn } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import { LayoutDashboard, Package } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/example', labelKey: 'nav.example', icon: Package },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation('common');

  return (
    <aside className="hidden w-60 shrink-0 border-[--color-border] border-r bg-[--color-surface] md:block">
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
                  ? 'bg-[--color-primary] text-[--color-primary-foreground]'
                  : 'text-[--color-text-muted] hover:bg-[--color-surface-muted]',
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
