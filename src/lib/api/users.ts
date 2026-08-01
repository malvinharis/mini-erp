import 'server-only';
import type { PaginationQuery, User } from '@/lib/schemas';
import { apiFetch } from './server';

export const USERS_TAG = 'users';

export async function listUsers(query: Partial<PaginationQuery> = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  const qs = params.toString();
  return apiFetch<User[]>(`/users${qs ? `?${qs}` : ''}`, { tags: [USERS_TAG] });
}
