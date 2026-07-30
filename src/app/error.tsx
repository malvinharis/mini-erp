'use client';
import { Button } from '@/components/ui';

export default function AppError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-semibold text-2xl">Something went wrong</h1>
      <p className="text-[--color-text-muted]">An unexpected error occurred.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
