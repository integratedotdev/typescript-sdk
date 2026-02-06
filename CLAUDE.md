# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Type-safe TypeScript SDK for the Integrate MCP (Model Context Protocol) server. Provides unified access to 25+ third-party integrations (GitHub, Gmail, Slack, Notion, Linear, etc.) with OAuth management, framework adapters, and AI provider support.

## Commands

```bash
bun install                  # Install dependencies
bun run prep                 # Type-check + build (full validation)
bun run type-check           # TypeScript type checking (tsc --noEmit)
bun run build                # Full build (client + server + adapters + ai + types)
bun test tests/              # Run all tests
bun test tests/oauth/        # Run tests in a specific directory
bun test tests/oauth/manager.test.ts  # Run a single test file
bun test --watch tests/      # Watch mode
bun test --coverage tests/   # Coverage report
bun run test:unit            # Unit tests only
bun run test:integration     # Integration tests only
```

## Pre-commit Hook

A pre-commit hook (`scripts/check-version.sh`) enforces that `package.json` version is bumped when source files change. Skipped for docs-only, examples-only, or markdown-only changes. Use `git commit --no-verify` to bypass.

## Architecture

### Dual Build Targets

The SDK builds separately for browser and Node.js:
- **Browser build**: `index.ts`, `react.ts` → `dist/` (target: browser, ESM)
- **Node build**: `server.ts`, `oauth.ts` → `dist/` (target: node, ESM)
- **Adapters/AI**: Built as Node targets into `dist/adapters/` and `dist/ai/`
- Type declarations generated separately via `tsc --emitDeclarationOnly`

### Package Entry Points

Multiple export paths defined in `package.json` `"exports"`:
- `integrate-sdk` — Client-side SDK (browser)
- `integrate-sdk/server` — Server-side SDK with OAuth secrets, AI tools
- `integrate-sdk/react` — React hooks
- `integrate-sdk/ai/vercel`, `/ai/openai`, `/ai/anthropic`, `/ai/google` — AI provider integrations

### Core Modules

- **`src/client.ts`** — `MCPClient` class: connection lifecycle (lazy/eager/manual), tool dispatch, singleton caching, OAuth events. Factory: `createMCPClient()`
- **`src/server.ts`** — Server-side `createMCPServer()`: OAuth handler, token callbacks, trigger integration, route handlers
- **`src/integrations/`** — Each integration has two files: `provider.ts` (factory + config) and `provider-client.ts` (typed method interface). Tools defined as `const` arrays for type inference
- **`src/oauth/`** — OAuth 2.0 with PKCE. `OAuthManager` orchestrates flows; `OAuthWindowManager` for popups; token storage via IndexedDB (client) or callbacks (server)
- **`src/transport/http-session.ts`** — HTTP POST-based JSON-RPC 2.0 transport with optional SSE notifications
- **`src/adapters/`** — Framework adapters (Next.js, SvelteKit, SolidStart, TanStack Start, Node.js) extending `OAuthHandler`
- **`src/ai/`** — Converts MCP tools to AI provider-specific tool formats (Vercel AI, OpenAI, Anthropic, Google)
- **`src/triggers/`** — Scheduled tool execution: one-time and cron triggers with full CRUD and status lifecycle
- **`src/protocol/`** — MCP JSON-RPC 2.0 message types and tool definitions

### Type System Patterns

- `createMCPClient<const TIntegrations>()` uses generic inference to provide typed integration namespaces (e.g., `client.github.createIssue()`)
- Integration tool names are `as const` arrays, extracted to union types
- Client-side vs server-side configs differ: server includes `clientSecret`, client only has scopes/tools
- OAuth config reads from environment variables: `PROVIDER_CLIENT_ID`, `PROVIDER_CLIENT_SECRET`

### Data Flow

Client code → `MCPClient` → Integration client method → HTTP transport (JSON-RPC) → Framework adapter route → `OAuthHandler` → MCP server (`mcp.integrate.dev`) → Response back through chain

## Testing

Uses Bun's native test runner (`describe`, `test`, `expect`, `mock`). Tests are organized by module under `tests/` mirroring `src/` structure.

## CI

GitHub Actions runs on push/PR to `main` and `dev`: type-check → tests → build. Publishing to npm happens automatically when version bumps on `main`. Canary releases created from `dev` branch.
