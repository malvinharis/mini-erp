import 'server-only';
import type { Invoice, InvoiceListItem, PaginationQuery } from '@/lib/schemas';
import { apiFetch } from './server';

export const INVOICES_TAG = 'invoices';

interface InvoiceListQuery extends Partial<PaginationQuery> {
  status?: string;
  customerId?: string;
  from?: string;
  to?: string;
}

export async function listInvoices(query: InvoiceListQuery = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  if (query.status) params.set('status', query.status);
  if (query.customerId) params.set('customerId', query.customerId);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  const qs = params.toString();
  return apiFetch<InvoiceListItem[]>(`/invoices${qs ? `?${qs}` : ''}`, { tags: [INVOICES_TAG] });
}

export async function getInvoice(id: string) {
  return apiFetch<Invoice>(`/invoices/${id}`, { tags: [INVOICES_TAG] });
}
