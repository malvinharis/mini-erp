'use client';
import { Spinner } from '@/components/ui';
import type { RevenuePoint } from '@/lib/schemas';
import dynamic from 'next/dynamic';

/**
 * Client-only loader — recharts is heavy and browser-only, so it is dynamically
 * imported with `ssr: false`. Keeping the dynamic() call in a client module lets
 * the Server Component page stream first and hydrate the chart lazily.
 */
const RevenueChart = dynamic(() => import('./RevenueChart').then((mod) => mod.RevenueChart), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] items-center justify-center text-gray-400">
      <Spinner className="h-6 w-6" />
    </div>
  ),
});

export function RevenueChartLoader({ data }: { data: RevenuePoint[] }) {
  return <RevenueChart data={data} />;
}
