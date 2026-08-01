'use server';
import { EXAMPLE_TAG } from '@/lib/api/example';
import { apiFetch } from '@/lib/api/server';
import { createExampleSchema, updateExampleSchema } from '@/lib/schemas';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createExampleAction(input: unknown): Promise<void> {
  const parsed = createExampleSchema.parse(input);
  await apiFetch('/example', { method: 'POST', body: parsed });
  revalidateTag(EXAMPLE_TAG);
  redirect('/example');
}

export async function updateExampleAction(id: string, input: unknown): Promise<void> {
  const parsed = updateExampleSchema.parse(input);
  await apiFetch(`/example/${id}`, { method: 'PATCH', body: parsed });
  revalidateTag(EXAMPLE_TAG);
  redirect(`/example/${id}`);
}

export async function deleteExampleAction(id: string): Promise<void> {
  await apiFetch(`/example/${id}`, { method: 'DELETE' });
  revalidateTag(EXAMPLE_TAG);
  redirect('/example');
}
