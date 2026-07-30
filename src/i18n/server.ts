import 'server-only';
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { type Namespace, defaultNS, fallbackLng } from './settings';

/** getT() for Server Components — one language, no [locale] routing. */
export async function getT(ns: Namespace = defaultNS) {
  const i18n = createInstance();
  await i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lng: string, namespace: string) => import(`./locales/${lng}/${namespace}.json`),
      ),
    )
    .init({
      lng: fallbackLng,
      fallbackLng,
      ns,
      defaultNS,
      fallbackNS: defaultNS,
    });
  return { t: i18n.getFixedT(fallbackLng, ns), i18n };
}
