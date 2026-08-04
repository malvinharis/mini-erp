export const fallbackLng = 'en';
export const defaultNS = 'common';
export const namespaces = [
  'common',
  'validation',
  'users',
  'customers',
  'invoices',
  'dashboard',
] as const;
export type Namespace = (typeof namespaces)[number];
