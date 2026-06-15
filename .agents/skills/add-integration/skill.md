# Add Integration Skill

Implements a new third-party integration into the Integrate TypeScript SDK from start to finish — factory, client types, tests, metadata, and all wiring.

## Working directory

`/Users/jeremy/Documents/github/typescript-sdk` (or the caller’s clone of the integrate TypeScript SDK).

## What you receive

The caller will provide a spec describing:
- Integration name and provider ID (e.g. `"sentry"`)
- OAuth URLs (authorization endpoint, token endpoint)
- Default scopes (or none, for full-access tokens like Netlify)
- MCP tool names (e.g. `sentry_list_issues`)
- Typed method signatures for the client interface
- Category for the integration library

If any of these are missing, infer them from context or ask before proceeding.

---

## Files to create

### 1. `src/integrations/{provider}.ts` — Integration factory

```typescript
/**
 * {Name} Integration
 * Enables {Name} tools with OAuth configuration
 */

import type { MCPIntegration, OAuthConfig } from "./types.js";
import { getEnv } from "../utils/env.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger("{Name}");

// Omit SCOPES const entirely if the provider grants full access with no scopes.
const {PROVIDER}_SCOPES = [
  "scope:one",
  "scope:two",
] as const;

const {PROVIDER}_TOOLS = [
  "{provider}_tool_name",
  // ...all tool names
] as const;

export interface {Name}IntegrationConfig {
  /** {Name} OAuth client ID (defaults to {PROVIDER}_CLIENT_ID env var) */
  clientId?: string;
  /** {Name} OAuth client secret (defaults to {PROVIDER}_CLIENT_SECRET env var) */
  clientSecret?: string;
  /** Override OAuth scopes */
  scopes?: string[];
  /** OAuth redirect URI (optional - auto-detected from environment) */
  redirectUri?: string;
  // Add provider-specific fields here (e.g. subdomain, baseUrl)
}

export function {camel}Integration(config: {Name}IntegrationConfig = {}): MCPIntegration<"{provider}"> {
  const oauth: OAuthConfig = {
    provider: "{provider}",
    clientId: config.clientId ?? getEnv("{PROVIDER}_CLIENT_ID"),
    clientSecret: config.clientSecret ?? getEnv("{PROVIDER}_CLIENT_SECRET"),
    scopes: config.scopes ?? [...{PROVIDER}_SCOPES],  // use [] if no scopes
    redirectUri: config.redirectUri,
    config: {
      authorization_endpoint: "https://provider.com/oauth/authorize",
      token_endpoint: "https://provider.com/oauth/token",
      response_type: "code",
      grant_types_supported: ["authorization_code", "refresh_token"],
    },
  };

  return {
    id: "{provider}",
    name: "{Name}",
    logoUrl: "https://wdvtnli2jn3texa6.public.blob.vercel-storage.com/{provider}.png",
    description: "One-line description for the integration library",
    category: "{Category}",
    tools: [...{PROVIDER}_TOOLS],
    oauth,

    async onInit(_client) {
      logger.debug("{Name} integration initialized");
    },

    async onAfterConnect(_client) {
      logger.debug("{Name} integration connected");
    },
  };
}

export type {Name}Tools = (typeof {PROVIDER}_TOOLS)[number];
export type {Name}Scopes = (typeof {PROVIDER}_SCOPES)[number]; // omit if no scopes

export type { {Name}IntegrationClient } from "./{provider}-client.js";
```

**Rules:**
- `id` must be a lowercase string matching the MCP server's provider ID exactly
- `logoUrl` always uses the blob storage base URL with `{provider}.png` — never make up a different URL
- `scopes: []` if the provider grants full API access without scopes
- Omit `{PROVIDER}_SCOPES` const and `{Name}Scopes` type export if no scopes
- For providers with a configurable base URL (self-hosted, regional), add `baseUrl?` to config and normalize it with a helper, following the PostHog pattern in `src/integrations/posthog.ts`

---

### 2. `src/integrations/{provider}-client.ts` — Typed client interface

```typescript
/**
 * {Name} Integration Client Types
 * Fully typed interface for {Name} integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

// Domain types (add as many as needed, matching the API shape)
export interface {Name}Thing {
  id: string;
  name: string;
  [key: string]: any;
}

export interface {Name}IntegrationClient {
  methodName(params: { required: string; optional?: string }): Promise<MCPToolCallResponse>;
  // ...one method per tool
}
```

**Rules:**
- One method per MCP tool, in the same order as `{PROVIDER}_TOOLS`
- Method names are camelCase versions of the tool name minus the `{provider}_` prefix (e.g. `sentry_list_issues` → `listIssues`)
- Always return `Promise<MCPToolCallResponse>`
- Use `params?: Record<string, never>` for methods with no parameters
- Domain interfaces use `[key: string]: any` as the last field for forward-compatibility

---

### 3. `tests/integrations/{provider}.test.ts` — Unit tests

Follow the exact pattern used in `tests/integrations/integration-system.test.ts`. Every new integration needs its own describe block with these tests:

```typescript
import { describe, test, expect } from "bun:test";
import { {camel}Integration } from "../../src/integrations/{provider}.js";

describe("{Name} Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = {camel}Integration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("{provider}");
    expect(integration.name).toBe("{Name}");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = {camel}Integration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("{provider}");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = {camel}Integration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
  });

  test("accepts custom scopes", () => {
    const integration = {camel}Integration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["custom:scope"],
    });

    expect(integration.oauth?.scopes).toEqual(["custom:scope"]);
  });

  test("includes expected tools", () => {
    const integration = {camel}Integration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    // Test 2-3 representative tool names
    expect(integration.tools).toContain("{provider}_tool_name");
  });

  test("has lifecycle hooks defined", () => {
    const integration = {camel}Integration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = {camel}Integration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    // Set env vars temporarily
    const originalId = process.env.{PROVIDER}_CLIENT_ID;
    const originalSecret = process.env.{PROVIDER}_CLIENT_SECRET;

    process.env.{PROVIDER}_CLIENT_ID = "env-client-id";
    process.env.{PROVIDER}_CLIENT_SECRET = "env-client-secret";

    const integration = {camel}Integration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    // Restore
    if (originalId === undefined) delete process.env.{PROVIDER}_CLIENT_ID;
    else process.env.{PROVIDER}_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.{PROVIDER}_CLIENT_SECRET;
    else process.env.{PROVIDER}_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.{PROVIDER}_CLIENT_ID = "env-id";

    const integration = {camel}Integration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.{PROVIDER}_CLIENT_ID;
  });
});
```

Adapt the scope tests if the provider has no scopes (assert `scopes` is `[]` or omit those tests).

---

## Files to modify

### 4. `src/client.ts` — Add typed namespace

Add the import near the other integration client imports (around line 57):

```typescript
import type { {Name}IntegrationClient } from "./integrations/{provider}-client.js";
```

In the `IntegrationNamespaces` mapped type, add to **both** the key-remapping clause and the value clause. Find the last `? "posthog"` line and insert before `: never]`:

```typescript
  : K extends "{provider}"
  ? "{provider}"
```

And in the value clause, find the last `PostHogIntegrationClient` line and insert before `never;`:

```typescript
  K extends "{provider}" ? {Name}IntegrationClient :
```

### 5. `src/index.ts` — Export factory and types

Add after the last integration export block:

```typescript
export { {camel}Integration } from "./integrations/{provider}.js";
export type { {Name}IntegrationConfig, {Name}Tools, {Name}Scopes, {Name}IntegrationClient } from "./integrations/{provider}.js";
// Omit {Name}Scopes from the type export if the provider has no scopes
```

### 6. `src/server.ts` — Export factory for server-side use

Find the block of integration exports (around line 1414) and add:

```typescript
export { {camel}Integration } from './integrations/{provider}.js';
```

### 7. `src/integrations/bundle.ts` — Add to default integration set (if zero-config)

Add the import and factory call to `allIntegrations()` **only if** the factory can be called with no arguments (OAuth integrations typically qualify). Integrations that require API keys or tenant config at construction time (e.g. `auth0Integration`, `granolaIntegration`) are exported from `src/index.ts` but are **not** in the default bundle — apps add them explicitly when credentials are available.

```typescript
import { {camel}Integration } from './{provider}.js';
// in allIntegrations():
    {camel}Integration(),
```

The root `index.ts` default `client` uses `createIntegrationBundle()` — do not duplicate the list there.

### 8. `src/integrations/library-metadata.ts` — Add catalog entry

Add to `INTEGRATION_LIBRARY_METADATA`:

```typescript
  {provider}: {
    description: "One-line description matching the integration's description field",
    category: "{Category}",
  },
```

If the category is new (not in `IntegrationCategory`), add it to both the type union and the `INTEGRATION_CATEGORY_ORDER` array in the same file.

### 9. `src/integrations/integration-docs-metadata.ts` — Add docs metadata

For OAuth integrations, add a developer portal link used by the docs generator:

```typescript
  {provider}: {
    authMode: "oauth",
    developerPortal: {
      label: "{Name} Developer Hub",
      url: "https://provider.com/oauth/apps",
    },
  },
```

For API-key integrations, set `authMode: "apiKey"` and optional `setupNotes`.

Docs pages are **auto-generated** at build time (`docs/scripts/generate-integration-docs.ts`). Do not create MDX files manually. After adding the SDK integration, run:

```bash
cd docs && bun run generate:integrations
```

---

## Integration system test

After creating the new files, **also add the new integration to `tests/integrations/integration-system.test.ts`**:

1. Add the import at the top with the other integration imports
2. Add a describe block following the same pattern as existing integrations in that file

---

## Verification steps

Run these after all changes:

```bash
bun run type-check   # Must pass with zero errors
bun test tests/integrations/{provider}.test.ts  # New tests must pass
bun test tests/integrations/integration-system.test.ts  # Must still pass
```

If `bun run type-check` fails, fix all errors before finishing.

---

## Category reference

Valid values for `IntegrationCategory` (defined in `src/integrations/library-metadata.ts`):

| Category | Examples |
|---|---|
| Analytics | PostHog |
| Business | HubSpot, Intercom, Airtable, Zendesk |
| Finance | Stripe, Polar, Mercury, Ramp |
| Productivity | Notion, Todoist, Cal.com, Google Calendar |
| Communication | Slack, Gmail, Outlook, WhatsApp |
| Engineering | GitHub, Linear, Jira, Sentry, Figma, Cursor |
| Infrastructure | Railway, Vercel, Netlify |
| Storage | OneDrive, Google Drive, Dropbox |
| Social Media | YouTube |

To add a new category: extend the `IntegrationCategory` union type AND the `INTEGRATION_CATEGORY_ORDER` array in `library-metadata.ts`.

---

## Environment variable convention

| Pattern | Example |
|---|---|
| `{PROVIDER_UPPERCASE}_CLIENT_ID` | `SENTRY_CLIENT_ID` |
| `{PROVIDER_UPPERCASE}_CLIENT_SECRET` | `SENTRY_CLIENT_SECRET` |
| `{PROVIDER_UPPERCASE}_ACCESS_TOKEN` | `AUTH0_ACCESS_TOKEN` (optional pre-issued Management API token) |

Multi-word providers: `GOOGLE_CALENDAR` → `GCAL`, `WHATSAPP` → `WHATSAPP`. Use the shortest unambiguous uppercase form.

---

## Common special cases

**No OAuth scopes** (e.g. Netlify): set `scopes: []`, omit `{PROVIDER}_SCOPES` const and `{Name}Scopes` type export, and skip scope-related tests.

**API key auth instead of OAuth** (e.g. Cursor, Granola, Mercury): use `authType: "apiKey"` and `getHeaders()` instead of `oauth`. See `src/integrations/cursor.ts` or `src/integrations/granola.ts` for the pattern. These integrations do NOT go in `IntegrationNamespaces` in `client.ts` unless a typed client interface is defined.

**Amazon Web Services (SigV4, IAM credentials)** — use `authType: "apiKey"` and `getHeaders()` returning `Authorization: Bearer` followed by **compact JSON**: `accessKeyId`, `secretAccessKey`, optional `sessionToken`, optional `region`. The MCP server parses JSON only from the bearer payload, loads `aws-sdk-go-v2` credentials, and signs control-plane requests (never log or echo secrets). Pair with Go tools under `tools/aws/` (see `parseCredentialsPayload` / `loadAWSConfig`). On the client, method names must map to tools via `methodToToolName`: e.g. `stsGetCallerIdentity` → `aws_sts_get_caller_identity`. Prefer env vars `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (and optional session/region) on the server. Omit from the root default `client` in `index.ts` unless the integration can construct without secrets (AWS cannot).

**Auth0-style: Management API + OAuth client credentials** — use `authType: "apiKey"` (bearer token), `getHeaders()` returning `Authorization` and a tenant header such as `X-Auth0-Domain` (must match the MCP server's expected header). Implement `onBeforeConnect` to exchange `client_credentials` at `https://{domain}/oauth/token` with `audience` `https://{domain}/api/v2/` (or a caller-supplied audience). Also support a pre-issued `AUTH0_ACCESS_TOKEN` / `accessToken` option. See `src/integrations/auth0.ts`. Omit from the root default `client` in `index.ts` if the factory requires secrets.

**Configurable base URL** (e.g. PostHog self-hosted): add `baseUrl?` to config, write a `normalize{Name}BaseUrl()` helper, and pass `baseUrl` and `apiBaseUrl` in `oauth.config`. See `src/integrations/posthog.ts`.

**Provider-specific OAuth params** (e.g. Notion `owner`): pass extra fields in `oauth.config` alongside the endpoint fields.

---

## Checklist

Before reporting the integration as complete, verify every item:

- [ ] `src/integrations/{provider}.ts` created
- [ ] `src/integrations/{provider}-client.ts` created with all methods typed
- [ ] `tests/integrations/{provider}.test.ts` created and passing
- [ ] `tests/integrations/integration-system.test.ts` updated with new import and describe block
- [ ] `src/client.ts` — import added, key-remap clause added, value clause added
- [ ] `src/index.ts` — factory and types exported
- [ ] `src/server.ts` — factory exported
- [ ] `index.ts` (root) — import added, factory added to default client **only if** the integration does not require secrets at construction time (otherwise export via `src/index.ts` only)
- [ ] `src/integrations/library-metadata.ts` — catalog entry added
- [ ] `src/integrations/integration-docs-metadata.ts` — developer portal / auth metadata added (OAuth integrations need `developerPortal`)
- [ ] `cd docs && bun run generate:integrations` — regenerate integration docs MDX
- [ ] `bun run type-check` passes with zero errors
- [ ] All new tests pass
