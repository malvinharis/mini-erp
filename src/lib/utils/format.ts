import { format } from 'date-fns';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(value: number | string): string {
  return currency.format(typeof value === 'string' ? Number(value) : value);
}

export function formatDate(value: string | Date): string {
  return format(new Date(value), 'dd MMM yyyy');
}

export function formatDateTime(value: string | Date): string {
  return format(new Date(value), 'dd MMM yyyy HH:mm');
}
