export const fallbackLng = 'en';
export const defaultNS = 'common';
export const namespaces = ['common', 'validation', 'example'] as const;
export type Namespace = (typeof namespaces)[number];
