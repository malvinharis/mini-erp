import { z } from 'zod';
import { InvoiceStatus, invoiceListItemSchema } from './invoice';

/**
 * Dashboard summary — mirrors backend `GET /dashboard/summary`. Money fields
 * are Decimal on the backend, so they arrive as strings; counts are numbers.
 */

const revenuePointSchema = z.object({
  /** e.g. "2026-07" or "Jul". */
  month: z.string(),
  total: z.string(),
});
export type RevenuePoint = z.infer<typeof revenuePointSchema>;

export const dashboardSummarySchema = z.object({
  revenuePaid: z.string(),
  outstanding: z.string(),
  overdueCount: z.number(),
  customerCount: z.number(),
  revenueByMonth: z.array(revenuePointSchema),
  countByStatus: z.record(z.nativeEnum(InvoiceStatus), z.number()),
  recentInvoices: z.array(invoiceListItemSchema),
});
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
