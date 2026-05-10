# Changelog

## 0.9.44

### Fixed

- **Connection UI no longer shows "needs to reconnect" for non-expiring tokens.** Providers that don't return an `expires_in` (GitHub, Linear long-lived, Todoist, Polar, HubSpot, Vercel, etc.) previously had `expiresAt` serialized as `"0001-01-01T00:00:00Z"` (or, in older builds, a fabricated `now + 24h`). Consumer UIs that compared `expiresAt < now()` then mis-rendered the integration as expired. The MCP server now omits `expiresAt` entirely for these providers, and the SDK forwards `undefined` to your `setProviderToken` callback so you write `null` (or skip the column).

- **Connected-account email is now populated for ~30 providers.** `fetchUserEmail` was previously only implemented for `github`, `gmail`, and `notion`. It now covers all Google services, Linear, HubSpot, Polar, Todoist, Vercel, Slack, Intercom, Jira/Atlassian, Zendesk, Airtable, Discord, Dropbox, GitLab, Reddit (returns username — Reddit doesn't expose email), and every Microsoft Graph provider (Outlook, Teams, OneDrive, SharePoint, Excel, Word, PowerPoint, Planner). Each fetcher is best-effort and falls back to `tokenData.email` on failure.

- **`registerEmailFetcher(provider, fn)`** exported so you can wire your own custom providers without forking the SDK.

### Migration (one-time, per consumer)

The MCP server fix only prevents *new* rows from being written with a bogus `expiresAt`. If your database already contains rows with `accessTokenExpiresAt = '0001-01-01'` (or some fabricated `now+24h` value from before 0.9.43), they'll continue to drive "needs reconnect" until you clear them. Run this once against your token store:

```sql
-- Drizzle / Better-Auth schema (account.accessTokenExpiresAt)
UPDATE account
SET access_token_expires_at = NULL
WHERE access_token_expires_at < '2000-01-01';

-- For providers known to issue non-expiring tokens, optionally also clear
-- any far-future fabricated expiries from the pre-0.9.43 24h bug:
-- UPDATE account
-- SET access_token_expires_at = NULL
-- WHERE provider_id IN ('github','linear','vercel','todoist','polar','hubspot')
--   AND refresh_token IS NULL;
```

Adjust table/column names to match your schema. Apps that hand-write integrations against the SDK should also normalize on read in their `getProviderToken` callback if they can't run a migration:

```ts
getProviderToken: async (provider, email, ctx) => {
  const row = await db.tokens.find({ provider, userId: ctx.userId });
  if (!row) return undefined;
  const expiresAt =
    row.expiresAt && row.expiresAt > new Date("2000-01-01") ? row.expiresAt : null;
  return { ...row, expiresAt: expiresAt?.toISOString() };
}
```

## 0.9.43

### Fixed

- **OAuth tokens auto-refresh on retrieval and on 401.** `OAuthManager.getProviderToken` now proactively exchanges the refresh token via the MCP server's `/oauth/refresh` endpoint when the stored access token is within 2 minutes of expiry, then persists the new tokens via your existing `setProviderToken` callback. No code change required in consumer apps as long as integrations are configured with `clientId` / `clientSecret` (which you already do for OAuth callbacks).
- Tokens that the provider has permanently rejected (`invalid_grant`) now surface as a typed `RefreshRejectedError`; the SDK clears the stored token via `setProviderToken(provider, null, ...)` so your UI naturally moves the integration back to "Connect."
- Transient refresh failures (5xx, network) fall back to the stored access token; the next call either succeeds or returns a 401 that propagates normally.

### Added

- `resolveAccessToken`, `refreshViaMcp`, `shouldRefreshToken`, `RefreshRejectedError`, `RefreshTransientError`, `DEFAULT_REFRESH_WINDOW_MS` exported from `integrate-sdk`. Useful when you manage tokens outside the SDK (e.g., your own `getUserOAuthTokens` reads — wrap them in `resolveAccessToken` to get the same auto-refresh).

### Notes

- Requires the MCP server build that returns `HTTP 401 { "error": "invalid_grant" }` on permanent refresh failure. Older MCP servers return 500 in that case; the SDK will treat it as a transient failure and just return the stored access token (the call itself will then surface the auth error).
