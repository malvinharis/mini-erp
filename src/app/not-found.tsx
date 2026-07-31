import { Button } from '@/components/ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-gray-500 text-sm dark:text-gray-400">404</p>
      <h1 className="font-semibold text-2xl">Page not found</h1>
      <Link href="/">
        <Button variant="bordered" color="default">
          Back to dashboard
        </Button>
      </Link>
    </main>
  );
}
