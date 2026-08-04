import { format } from 'date-fns';

// Indonesian grouping (dot thousands separator), plain number — no currency
// symbol, no decimals.
const currency = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number | string): string {
  return currency.format(typeof value === 'string' ? Number(value) : value);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : format(date, 'dd MMM yyyy');
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : format(date, 'dd MMM yyyy HH:mm');
}
