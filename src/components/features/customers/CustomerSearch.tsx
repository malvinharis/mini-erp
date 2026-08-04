'use client';

import { Input, UISize } from '@/components/ui';
import { useTranslation } from '@/i18n/client';
import { Search } from 'lucide-react';
import type { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DEBOUNCE_MS = 300;

export function CustomerSearch() {
  const { t } = useTranslation('customers');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') ?? '');

  useEffect(() => {
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      params.delete('page');
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ''}` as Route);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
      <div className="relative min-w-40 max-w-xs flex-1">
        <Search size={16} className="-translate-y-1/2 absolute top-1/2 left-3 text-neutral-400" />
        <Input
          value={value}
          size={UISize.Md}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="rounded-full border-neutral-200 bg-neutral-100 pl-9 focus-visible:bg-white"
        />
      </div>
    </div>
  );
}
