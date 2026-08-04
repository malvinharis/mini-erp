# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.1.3](https://github.com/malvinharis/mini-erp/compare/v0.1.2...v0.1.3) (2026-08-04)

## [0.1.2](https://github.com/malvinharis/mini-erp/compare/v0.1.1...v0.1.2) (2026-08-04)

## 0.1.1 (2026-08-04)


### Features

* add customers module (schema, API routes, list/detail pages, RBAC, i18n) ([66c322f](https://github.com/malvinharis/mini-erp/commit/66c322f1994bda7f8ff29c84bb46032917a1abb5))
* add invoices module (schema, API, list/detail/create/edit, status machine, RBAC, i18n) ([b02973c](https://github.com/malvinharis/mini-erp/commit/b02973cc6cdd1ae8dde53a4d21d70de3a92d09f5))
* add production Docker deployment config ([ffe0c9f](https://github.com/malvinharis/mini-erp/commit/ffe0c9fffb7e065c80ebdaf5fa4e40a2661287a9))
* add useFetcher hook with axiosInstance for internal API calls ([22a88d8](https://github.com/malvinharis/mini-erp/commit/22a88d8fdcf5be5a36d3b4ce8b59adbabb8c8fdc))
* **customers,invoices:** show created by and updated by in tables and detail pages ([748ff3f](https://github.com/malvinharis/mini-erp/commit/748ff3ff5483983e818bf238ba70dd43643ea35f))
* **dashboard:** add i18n strings and register namespace ([ae85e96](https://github.com/malvinharis/mini-erp/commit/ae85e9620292a7b20b8112740c5f4c8d8def5045))
* **dashboard:** add summary schema and server API ([68811e7](https://github.com/malvinharis/mini-erp/commit/68811e7102373f7f6bd490211bf3480712f38f5c))
* **dashboard:** build landing page with revenue chart, status counts and recent invoices ([5b87cef](https://github.com/malvinharis/mini-erp/commit/5b87cef50da0767cd7d03ff7ad041705d11f0c0e))
* initial project setup ([eef86a6](https://github.com/malvinharis/mini-erp/commit/eef86a68c2ebfe71079ac6400c3a39e61ec6d5ce))
* rebuild ui kit with HeroUI-style variants, native Tailwind ([5a5dbf2](https://github.com/malvinharis/mini-erp/commit/5a5dbf23ab984cb1492b2db26ce92032048cc27c))
* show customer invoices on customer detail page ([105b652](https://github.com/malvinharis/mini-erp/commit/105b6528c5c0fa224446fa1e676c010763d1e9cb))
* **ui:** standardize components with enums, add DataTable, polish forms and detail pages ([16d69b5](https://github.com/malvinharis/mini-erp/commit/16d69b5ed6887577ad4676645b14434de53d3f07))
* users admin page with RBAC, remove example scaffold ([5245431](https://github.com/malvinharis/mini-erp/commit/5245431db08e6ed4bd1982248e6c29add6432ca2))


### Bug Fixes

* confine scrolling to main content, keep sidebar and topbar fixed ([b9e7baf](https://github.com/malvinharis/mini-erp/commit/b9e7baf00fea6284a87619299488372fbfad79ea))
* guard formatDate/formatDateTime against null and invalid dates ([b621e64](https://github.com/malvinharis/mini-erp/commit/b621e64dd954014a7d3caa7514e3fe1e67ff9896))
* remove hardcoded pnpm version in CI, conflicts with packageManager field ([55b63a9](https://github.com/malvinharis/mini-erp/commit/55b63a91d784f0ba179561bd52bf2196832a3bc4))
* track empty public/ dir so it survives git clone (Docker COPY needs it) ([6406061](https://github.com/malvinharis/mini-erp/commit/64060612776f224ca21b2da2ab4a44e81d0045d7))
* wire user mutations through useFetcher, fix PATCH/DELETE 405s ([5c5d1c3](https://github.com/malvinharis/mini-erp/commit/5c5d1c3aed2786265a7e539fb76470613d7f07f1))


### Refactoring

* standardize UserRole as a TS enum ([f2567dc](https://github.com/malvinharis/mini-erp/commit/f2567dcc3af0bcc994e46d77c11b66c974d6b8f5))
