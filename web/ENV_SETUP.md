# Environment Variables Setup

Copy these to your `.env.local` file:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=<generate-a-random-secret-key>
# Site origin only — basePath (/dashboard/api/auth) is set in lib/auth-config.ts
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Application URL (for invitation emails and other external links)
INTEGRATE_URL=http://localhost:3000/dashboard  # Production: https://integrate.dev/dashboard
NEXT_PUBLIC_APP_URL=http://localhost:3000/dashboard

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Polar.sh Billing Configuration
POLAR_ACCESS_TOKEN=<your-polar-access-token>
POLAR_WEBHOOK_SECRET=<your-polar-webhook-secret>
POLAR_SERVER=sandbox  # or "production"
POLAR_USAGE_EVENT_NAME=api_request  # Must match the event name configured in your Polar meter filter
POLAR_STARTER_PRODUCT_ID=<your-starter-plan-product-id>
POLAR_GROW_PRODUCT_ID=<your-grow-plan-product-id>

# OpenAI Configuration (for AI Chat)
OPENAI_API_KEY=<your-openai-api-key>

# Resend Email Configuration
RESEND_API_KEY=<your-resend-api-key>
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=Your App Name

# Integrate SDK OAuth Configuration (for GitHub, Gmail & Notion integrations)
GITHUB_CLIENT_ID=<your-github-oauth-app-client-id>
GITHUB_CLIENT_SECRET=<your-github-oauth-app-client-secret>
GMAIL_CLIENT_ID=<your-google-oauth-client-id>
GMAIL_CLIENT_SECRET=<your-google-oauth-client-secret>
NOTION_CLIENT_ID=<your-notion-oauth-client-id>
NOTION_CLIENT_SECRET=<your-notion-oauth-client-secret>

# MCP Server Authentication
MCP_SERVER_SECRET=<generate-a-random-secret-for-mcp-server>

# Integrate SDK (server-side MCP client)
INTEGRATE_API_KEY=<your-integrate-api-key>  # Sent as X-API-Key on MCP tool calls for billing/usage
INTEGRATE_MCP_SERVER_URL=https://mcp.integrate.dev/api/v1/mcp  # Override for local MCP server

# Usage pipeline (MCP server → dashboard)
# The Go MCP server POSTs usage events to {APP_BASE_URL}/api/usage (e.g. https://integrate.dev/dashboard/api/usage).
# Production dashboard origin: https://integrate.dev/dashboard
# /dashboard/api/usage is a public path (no session) — authenticated via MCP_SERVER_SECRET only.

# Integrate SDK production patterns (see integrate-sdk docs)
# - Chat route uses getVercelAITools with connectedOnly + mode: "code"
# - For multi-integration apps, migrate OAuth storage to drizzleAdapter + provider_token table
#   (see guides/production-nextjs in integrate-sdk docs)
```

## Production URLs (integrate.dev)

| Variable | Production value |
|---|---|
| `BETTER_AUTH_URL` | `https://integrate.dev` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | `https://integrate.dev` |
| `INTEGRATE_URL` | `https://integrate.dev/dashboard` |
| `NEXT_PUBLIC_APP_URL` | `https://integrate.dev/dashboard` |

## OAuth callback URLs (update in provider consoles)

| Provider | Callback URL |
|---|---|
| GitHub (Better Auth) | `https://integrate.dev/dashboard/api/auth/callback/github` |
| GitHub (Integrate SDK) | `https://integrate.dev/dashboard/api/integrate/oauth/callback/github` |
| Gmail (Integrate SDK) | `https://integrate.dev/dashboard/api/integrate/oauth/callback/gmail` |
| Notion (Integrate SDK) | `https://integrate.dev/dashboard/api/integrate/oauth/callback/notion` |

## MCP server

Set `APP_BASE_URL=https://integrate.dev/dashboard` on the production MCP server.

## Local development

```bash
bun install
bun run dev
```

Open `http://localhost:3000` for marketing/docs and `http://localhost:3000/dashboard` for the app.
