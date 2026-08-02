import { z } from 'zod';

/**
 * Invoices domain — mirrors backend `shared/invoice.ts`. Single source of
 * truth: backend (createZodDto) and frontend (zodResolver) consume the same
 * shapes. Money is Decimal on the backend, so read-side amounts arrive as
 * strings; write-side line items are plain numbers from the form.
 */

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

/** Valid state-machine transitions triggered from the UI. OVERDUE is derived
 * server-side (SENT past due date), never set explicitly. */
export const INVOICE_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  [InvoiceStatus.DRAFT]: [InvoiceStatus.SENT, InvoiceStatus.CANCELLED],
  [InvoiceStatus.SENT]: [InvoiceStatus.PAID, InvoiceStatus.CANCELLED],
  [InvoiceStatus.OVERDUE]: [InvoiceStatus.PAID, InvoiceStatus.CANCELLED],
  [InvoiceStatus.PAID]: [],
  [InvoiceStatus.CANCELLED]: [],
};

const lineItemInputSchema = z.object({
  description: z.string().trim().min(1).max(255),
  quantity: z.coerce.number().positive().max(1_000_000),
  unitPrice: z.coerce.number().nonnegative().max(1_000_000_000),
});
export type LineItemInput = z.infer<typeof lineItemInputSchema>;

export const createInvoiceSchema = z
  .object({
    customerId: z.string().uuid(),
    issueDate: z.string().min(1),
    dueDate: z.string().min(1),
    /** PPN percent — 0 or 11 in practice. */
    taxRate: z.coerce.number().min(0).max(100).default(0),
    items: z.array(lineItemInputSchema).min(1).max(100),
    /** Initial status: the form's two save actions send DRAFT or SENT. */
    status: z.enum([InvoiceStatus.DRAFT, InvoiceStatus.SENT]).default(InvoiceStatus.DRAFT),
  })
  .strict();
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

/** Edit is only allowed while DRAFT; status is not editable here. */
export const updateInvoiceSchema = createInvoiceSchema.omit({ status: true }).partial();
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;

export const invoiceStatusChangeSchema = z.object({ status: z.nativeEnum(InvoiceStatus) }).strict();
export type InvoiceStatusChangeInput = z.infer<typeof invoiceStatusChangeSchema>;

/** Read models. */
const lineItemSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  quantity: z.string(),
  unitPrice: z.string(),
  amount: z.string(),
});
export type InvoiceLineItem = z.infer<typeof lineItemSchema>;

const statusLogSchema = z.object({
  id: z.string().uuid(),
  fromStatus: z.nativeEnum(InvoiceStatus).nullable(),
  toStatus: z.nativeEnum(InvoiceStatus),
  changedAt: z.string().datetime(),
  changedByName: z.string().nullable().optional(),
});
export type InvoiceStatusLog = z.infer<typeof statusLogSchema>;

const invoiceCustomerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

/** List row — lean, no line items. */
export const invoiceListItemSchema = z.object({
  id: z.string().uuid(),
  number: z.string(),
  status: z.nativeEnum(InvoiceStatus),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  total: z.string(),
  customer: invoiceCustomerSchema,
});
export type InvoiceListItem = z.infer<typeof invoiceListItemSchema>;

/** Detail — full line items + status history. */
export const invoiceSchema = invoiceListItemSchema.extend({
  taxRate: z.string(),
  subtotal: z.string(),
  taxAmount: z.string(),
  items: z.array(lineItemSchema),
  statusLogs: z.array(statusLogSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Invoice = z.infer<typeof invoiceSchema>;
