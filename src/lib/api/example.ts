import 'server-only';
import type { Example, PaginationQuery } from '@/lib/schemas';
import { apiFetch } from './server';

const EXAMPLE_TAG = 'example';

export async function listExamples(query: Partial<PaginationQuery> = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  const qs = params.toString();
  return apiFetch<Example[]>(`/example${qs ? `?${qs}` : ''}`, { tags: [EXAMPLE_TAG] });
}

export async function getExample(id: string) {
  return apiFetch<Example>(`/example/${id}`, { tags: [EXAMPLE_TAG] });
}

export { EXAMPLE_TAG };
