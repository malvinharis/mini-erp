'use server';
import { apiFetch } from '@/lib/api/server';
import { clearSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export async function logoutAction(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST' }).catch(() => undefined);
  await clearSession();
  redirect('/login');
}
