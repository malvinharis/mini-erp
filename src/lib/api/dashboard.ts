import 'server-only';
import type { DashboardSummary } from '@/lib/schemas';
import { apiFetch } from './server';

export const DASHBOARD_TAG = 'dashboard';

export async function getDashboardSummary() {
  return apiFetch<DashboardSummary>('/dashboard/summary', { tags: [DASHBOARD_TAG] });
}
