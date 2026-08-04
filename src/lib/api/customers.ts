import 'server-only';
import type { Customer, PaginationQuery } from '@/lib/schemas';
import { apiFetch } from './server';

export const CUSTOMERS_TAG = 'customers';

export async function listCustomers(query: Partial<PaginationQuery> = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  const qs = params.toString();
  return apiFetch<Customer[]>(`/customers${qs ? `?${qs}` : ''}`, { tags: [CUSTOMERS_TAG] });
}

export async function getCustomer(id: string) {
  return apiFetch<Customer>(`/customers/${id}`, { tags: [CUSTOMERS_TAG] });
}
