# mini-erp (web)

Frontend for the **Mini ERP Invoicing** system — a **Next.js 15 App Router** application (React 19). Server Components fetch data over the REST API; interactive surfaces are thin Client Components. Pairs with [`mini-erp-api`](../mini-erp-api).

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router) · React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + Sass modules (`globals.scss` → generated CSS) |
| Components | `class-variance-authority`, `clsx` + `tailwind-merge` (`cn()`) |
| Forms | React Hook Form + zod (`@hookform/resolvers`) |
| Data fetching | `fetch` in Server Components · axios in Client Components |
| State | Zustand (UI state only) |
| Charts | Chart.js + `react-chartjs-2` (dynamic import) |
| i18n | i18next + react-i18next (single locale, no `[locale]` routing) |
| UX | motion, sonner (toasts), lucide-react (icons), date-fns |
| Tooling | pnpm 10, Biome (lint + format), Jest + Testing Library, Husky + commitlint |

---

## Prerequisites

- **Node.js ≥ 22**
- **pnpm 10** (`corepack enable`)
- A running **`mini-erp-api`** instance (default `http://localhost:4000/api`)

---

## Installation

```bash
pnpm install
cp .env.example .env      # set API_URL / NEXT_PUBLIC_API_URL
```

---

## Running locally

Start the backend first (see `mini-erp-api` README), then:

```bash
pnpm dev                  # compiles Sass, then next dev on http://localhost:3000
```

`predev`/`prebuild` compile `src/styles/globals.scss` to CSS before Next runs; `dev` keeps Sass in `--watch`.

Production build:

```bash
pnpm build
pnpm start                # http://localhost:3000
```

Docker:

```bash
docker build -t mini-erp-web .
docker compose -f docker-compose.prod.yml up --build
```

---

## Environment

| Variable | Purpose |
|---|---|
| `API_URL` | Backend base URL for **server-side** fetch (RSC). Includes the `/api` prefix. |
| `NEXT_PUBLIC_API_URL` | Backend base URL for **client** axios. Inlined into the browser bundle at build time. |

---

## Scripts

| Command | Action |
|---|---|
| `pnpm dev` | Sass watch + `next dev` on :3000 |
| `pnpm build` / `pnpm start` | Production build then serve |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `pnpm lint:fix` | Biome check / autofix |
| `pnpm test` / `pnpm test:watch` | Jest |
| `pnpm release` | version + CHANGELOG from conventional commits |

Default seeded login: **admin@mini-erp.local** / **changeme123** (also `staff@` and `viewer@`).

---

## Architectural decisions & assumptions

- **RSC-first data fetching** — Server Components `await` the API with `fetch` so they participate in the Next.js cache and ship less JS. axios is used **only** in Client Components (its Node `http` transport bypasses `revalidate`).
- **httpOnly cookie sessions** — access/refresh tokens live in `httpOnly` + `SameSite=Lax` cookies set server-side, never `localStorage`, closing the XSS token-theft class. `middleware.ts` guards routes and silently refreshes an expired access token from the refresh token.
- **Zustand for UI state only** — server-derived data is never mirrored into a client store; it stays in RSC / route state to keep the caching benefits.
- **Shared zod contract** — request/response schemas mirror the backend's `src/shared`, so a backend field change surfaces as a frontend compile error rather than a runtime surprise.
- **Tailwind for ~90% of styling, Sass modules for the rest** — Tailwind directives live only in `.css` (Sass compiles before PostCSS); `.module.scss` handles complex selectors, keyframes, and third-party overrides.
- **i18n wired, single language** — all UI strings are namespaced keys under `src/i18n/locales/en/`; adding a second language needs no code changes.
- **Cache invalidation via `revalidateTag`** after mutations, not a blanket `router.refresh()`.
- **Assumptions**: same-origin or CORS-allowlisted deployment with the API; one active locale (`en`); the API enforces authorization — the frontend route gate is UX, not security.

---

## Project layout

```
src/
├── app/
│   ├── (auth)/login/        sign-in (server action → API)
│   └── (app)/               authenticated shell: dashboard, users, customers, invoices
├── components/
│   ├── features/            domain components (dashboard, invoices, …)
│   └── ui/                  portable design-system primitives
├── lib/
│   ├── api/                 server.ts (RSC fetch) · client.ts (axios) · per-domain clients
│   ├── auth/session.ts      httpOnly cookie helpers
│   └── schemas/             zod schemas mirroring the backend
├── i18n/                    server + client providers, locales/en
├── stores/                  zustand UI state
└── styles/                  globals.scss, mixins, *.module.scss
middleware.ts                route protection + silent token refresh
```

---

## Deployed application

- **Web**: https://mini-erp.malvinharis.web.id
- **API**: https://mini-erp-api.malvinharis.web.id/api
