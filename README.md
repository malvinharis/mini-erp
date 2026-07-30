# mini-erp

Fullstack monorepo template — **NestJS + Next.js**. Base infrastructure with no
domain features; the `example` module/page/schema is the pattern to copy.

## Stack

- **Monorepo**: pnpm workspaces, TypeScript strict, Biome, Husky + commitlint
- **API** (`apps/api`): NestJS, Prisma + PostgreSQL 16, JWT + refresh rotation,
  zod validation (nestjs-zod), Swagger, Throttler, Helmet, pino logging, Terminus health
- **Web** (`apps/web`): Next.js App Router, Tailwind v4 + Sass modules, RHF + zod,
  Zustand (UI only), axios (client) / fetch (RSC), i18next, sonner
- **Packages**: `ui` (portable components), `shared-types` (zod schemas), `config`

## Quick start

```bash
pnpm install

# Database
docker compose -f docker/docker-compose.yml up -d db

# API
cp apps/api/.env.example apps/api/.env
pnpm --filter @mini-erp/api prisma:generate
pnpm --filter @mini-erp/api prisma:migrate
pnpm --filter @mini-erp/api seed        # admin@mini-erp.local / changeme123

# Web
cp apps/web/.env.example apps/web/.env

# Run both
pnpm dev
```

- API: http://localhost:4000/api · Swagger: http://localhost:4000/docs · Health: http://localhost:4000/api/health
- Web: http://localhost:3000

## Full stack in Docker

```bash
docker compose -f docker/docker-compose.yml up --build
```

## Adding a domain

1. `packages/shared-types/src/<domain>.ts` — zod schema (source of truth)
2. `apps/api/prisma/schema.prisma` — model + indexes, then migrate
3. `apps/api/src/modules/<domain>/` — copy from `example/`
4. `apps/web/src/lib/api/<domain>.ts` + `app/(app)/<domain>/` — client + pages
5. `apps/web/src/i18n/locales/en/<domain>.json`

See `CLAUDE.md` for conventions, security, scalability, and performance rules.

## Scripts

| Command | Action |
|---|---|
| `pnpm dev` | run api + web |
| `pnpm build` | build all workspaces |
| `pnpm typecheck` | type-check all |
| `pnpm lint` / `pnpm lint:fix` | Biome |
| `pnpm release` | version + CHANGELOG from commits |

Default seeded login: **admin@mini-erp.local** / **changeme123**.
