import { Spinner } from '@/components/ui';

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-24 text-gray-500 dark:text-gray-400">
      <Spinner className="h-6 w-6" />
    </div>
  );
}
