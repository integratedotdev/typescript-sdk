# integrate web

Unified Next.js app for [integrate.dev](https://integrate.dev): marketing, docs, and dashboard.

## Stack

- Next.js 16 (App Router)
- PlanetScale-inspired mono UI (IBM Plex Mono)
- MDX docs (no fumadocs)
- Better Auth + Polar + Neon (dashboard)
- dither-kit charts

## Develop

```bash
cp .env.example .env.local
# fill secrets from Vercel / 1Password
bun install
bun run dev
```

## Scripts

| Script | Purpose |
|--------|---------|
| `bun run dev` | Next.js dev server |
| `bun run build` | Generate integration docs + production build |
| `bun run generate:integrations` | Regenerate `content/docs/integrations/*` |
| `bun run db:migrate` | Apply Drizzle migrations |

## Routes

- `/` — marketing
- `/docs/*` — documentation
- `/dashboard/*` — authenticated product UI
- `/llms.txt` — Markdown index for agents

## Secrets

All secrets live in environment variables (see `.env.example`). Never commit `.env.local`.
