'use client';
import i18next from 'i18next';
import { type ReactNode, useState } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import common from './locales/en/common.json';
import customers from './locales/en/customers.json';
import dashboard from './locales/en/dashboard.json';
import invoices from './locales/en/invoices.json';
import users from './locales/en/users.json';
import validation from './locales/en/validation.json';
import { defaultNS, fallbackLng } from './settings';

/**
 * Resources are bundled synchronously (static JSON imports) and init runs with
 * `initImmediate: false`, so the very first client render already has translations.
 * That keeps SSR and client output identical — no hydration mismatch. Single language,
 * so the bundle cost is trivial; add a second locale by extending `resources`.
 */
function createClientInstance() {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    lng: fallbackLng,
    fallbackLng,
    defaultNS,
    fallbackNS: defaultNS,
    ns: ['common', 'validation', 'users', 'customers', 'invoices', 'dashboard'],
    resources: { en: { common, validation, users, customers, invoices, dashboard } },
    react: { useSuspense: false },
    initImmediate: false,
  });
  return instance;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [instance] = useState(createClientInstance);
  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}

export { useTranslation } from 'react-i18next';
