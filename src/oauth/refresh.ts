/**
 * OAuth token refresh helper
 *
 * Centralizes the logic for refreshing OAuth provider tokens via the
 * Integrate MCP server's /oauth/refresh endpoint. Used by the SDK to
 * transparently refresh expiring tokens before forwarding tool calls, so
 * consumer apps (dashboard, third-party integrations) don't need to wire
 * their own refresh code as long as they implement the existing
 * setProviderToken callback.
 */
import type { ProviderTokenData } from "./types.js";
import type { MCPContext } from "../config/types.js";

/**
 * Thrown when the provider has permanently rejected the refresh token
 * (RFC 6749 `invalid_grant`). The caller should mark the integration
 * disconnected and prompt the user to reconnect; do not retry.
 */
export class RefreshRejectedError extends Error {
  public readonly provider: string;
  constructor(provider: string, message?: string) {
    super(message ?? `OAuth refresh rejected (invalid_grant) for ${provider}`);
    this.name = "RefreshRejectedError";
    this.provider = provider;
  }
}

/**
 * Thrown for transient refresh failures (network errors, 5xx, malformed
 * responses). The caller may proceed with the existing access token; a
 * subsequent 401 from the provider will surface the real auth error.
 */
export class RefreshTransientError extends Error {
  public readonly provider: string;
  constructor(provider: string, message: string) {
    super(message);
    this.name = "RefreshTransientError";
    this.provider = provider;
  }
}

/**
 * Result of a successful refresh exchange with the MCP server.
 */
export interface RefreshResult {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  expiresAt?: string;
  scopes?: string[];
  email?: string;
}

export interface RefreshViaMcpOptions {
  /** OAuth provider id (e.g. "gmail", "github"). */
  provider: string;
  /** Current refresh token. */
  refreshToken: string;
  /** Provider OAuth client id (server-side credential). */
  clientId: string;
  /** Provider OAuth client secret (omit for public clients). */
  clientSecret?: string;
  /** Optional subdomain for tenant-aware providers (e.g. Zendesk). */
  subdomain?: string;
  /**
   * Additional provider-specific forwardable config (already filtered to
   * exclude OAuth secrets). Pass-through to the MCP refresh endpoint.
   */
  extraConfig?: Record<string, string>;
  /** MCP server base URL (e.g. https://mcp.integrate.dev). */
  serverUrl: string;
  /** Optional API key, forwarded as X-API-KEY for usage tracking. */
  apiKey?: string;
  /** Optional AbortSignal for cancellation. */
  signal?: AbortSignal;
}

/**
 * Default window before token expiry when we proactively refresh. Mirrors
 * the MCP server's `sessionRefreshWindow` (2 minutes).
 */
export const DEFAULT_REFRESH_WINDOW_MS = 2 * 60 * 1000;

/**
 * Returns true when the token should be refreshed before the next call.
 *
 * - If there is no refresh token, never refresh (the caller can't recover).
 * - If `expiresAt` is missing or unparseable, treat the token as
 *   non-expiring and skip refresh. The MCP server now returns a zero
 *   expiry for providers that don't issue one (e.g. GitHub), so this is
 *   the steady-state path for long-lived tokens.
 * - Otherwise refresh when within `windowMs` of expiry (or already past).
 */
export function shouldRefreshToken(
  tokenData: ProviderTokenData | undefined,
  windowMs: number = DEFAULT_REFRESH_WINDOW_MS
): boolean {
  if (!tokenData || !tokenData.refreshToken || !tokenData.expiresAt) {
    return false;
  }
  const expiresAtMs = Date.parse(tokenData.expiresAt);
  if (Number.isNaN(expiresAtMs)) {
    return false;
  }
  return expiresAtMs - Date.now() <= windowMs;
}

/**
 * Call the MCP server's /oauth/refresh endpoint to exchange a refresh
 * token for a new access token.
 *
 * @throws {RefreshRejectedError} when the provider returned `invalid_grant`
 *   (HTTP 401 with `{error:"invalid_grant"}` from the MCP server).
 * @throws {RefreshTransientError} for any other non-OK response or
 *   network failure.
 */
export async function refreshViaMcp(opts: RefreshViaMcpOptions): Promise<RefreshResult> {
  const url = new URL("/oauth/refresh", opts.serverUrl);

  const body: Record<string, string> = {
    provider: opts.provider,
    refresh_token: opts.refreshToken,
    client_id: opts.clientId,
  };
  if (opts.clientSecret) {
    body.client_secret = opts.clientSecret;
  }
  if (opts.subdomain) {
    body.subdomain = opts.subdomain;
  }
  if (opts.extraConfig) {
    for (const [key, value] of Object.entries(opts.extraConfig)) {
      if (body[key] === undefined) {
        body[key] = value;
      }
    }
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.apiKey) {
    headers["X-API-KEY"] = opts.apiKey;
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: opts.signal,
    });
  } catch (err) {
    throw new RefreshTransientError(
      opts.provider,
      `Network error refreshing ${opts.provider} token: ${(err as Error).message}`
    );
  }

  // The MCP server returns HTTP 401 with `{"error":"invalid_grant"}` when
  // the provider has permanently rejected the refresh token.
  if (response.status === 401) {
    let parsed: { error?: string } = {};
    try {
      parsed = (await response.json()) as { error?: string };
    } catch {
      // Body wasn't JSON; treat as invalid_grant since the status is 401.
    }
    if (parsed.error === "invalid_grant") {
      throw new RefreshRejectedError(opts.provider);
    }
    throw new RefreshTransientError(opts.provider, `Refresh endpoint returned 401`);
  }

  if (!response.ok) {
    let text = "";
    try {
      text = await response.text();
    } catch {
      // ignore
    }
    throw new RefreshTransientError(
      opts.provider,
      `Refresh endpoint returned ${response.status}: ${text || "<no body>"}`
    );
  }

  let result: RefreshResult;
  try {
    result = (await response.json()) as RefreshResult;
  } catch (err) {
    throw new RefreshTransientError(
      opts.provider,
      `Malformed refresh response: ${(err as Error).message}`
    );
  }

  if (!result.accessToken) {
    throw new RefreshTransientError(
      opts.provider,
      `Refresh response missing access_token`
    );
  }

  // The MCP server now echoes back the request's refresh token when the
  // provider didn't issue a new one, so callers can always trust the
  // returned value. Fall back to the request value just in case (e.g.
  // calling against an older MCP server).
  if (!result.refreshToken) {
    result.refreshToken = opts.refreshToken;
  }

  return result;
}

export interface ResolveAccessTokenOptions {
  provider: string;
  currentTokens: ProviderTokenData;
  /**
   * Provider OAuth credentials & config, as configured on the consumer
   * app's `createMCPServer` call. Used to call /oauth/refresh.
   */
  providerOAuth: {
    clientId: string;
    clientSecret?: string;
    subdomain?: string;
    extraConfig?: Record<string, string>;
  };
  serverUrl: string;
  apiKey?: string;
  /** Persistence callback (consumer-supplied). */
  setProviderToken?: (
    provider: string,
    tokenData: ProviderTokenData | null,
    email?: string,
    context?: MCPContext
  ) => Promise<void> | void;
  context?: MCPContext;
  /** When true, refresh regardless of current expiry. Used for 401 retry. */
  force?: boolean;
  windowMs?: number;
}

/**
 * Refresh-if-needed wrapper. Returns the access token that should be sent
 * on the next call.
 *
 * Refresh is best-effort by default: a transient failure logs and returns
 * the existing access token (the next call will either succeed or return a
 * 401 the caller can react to). An `invalid_grant` failure is permanent —
 * we clear the stored token via `setProviderToken(null)` and rethrow.
 */
export async function resolveAccessToken(opts: ResolveAccessTokenOptions): Promise<string> {
  const { provider, currentTokens, force = false } = opts;
  const needsRefresh = force || shouldRefreshToken(currentTokens, opts.windowMs);
  if (!needsRefresh || !currentTokens.refreshToken) {
    return currentTokens.accessToken;
  }

  try {
    const refreshed = await refreshViaMcp({
      provider,
      refreshToken: currentTokens.refreshToken,
      clientId: opts.providerOAuth.clientId,
      clientSecret: opts.providerOAuth.clientSecret,
      subdomain: opts.providerOAuth.subdomain,
      extraConfig: opts.providerOAuth.extraConfig,
      serverUrl: opts.serverUrl,
      apiKey: opts.apiKey,
    });

    const updated: ProviderTokenData = {
      ...currentTokens,
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken ?? currentTokens.refreshToken,
      tokenType: refreshed.tokenType || currentTokens.tokenType,
      expiresIn: refreshed.expiresIn ?? currentTokens.expiresIn,
      expiresAt: refreshed.expiresAt ?? currentTokens.expiresAt,
      scopes: refreshed.scopes && refreshed.scopes.length > 0 ? refreshed.scopes : currentTokens.scopes,
    };

    if (opts.setProviderToken) {
      try {
        await opts.setProviderToken(provider, updated, updated.email, opts.context);
      } catch {
        // Persistence failed — the new token is still usable for this
        // call; the next request will retry the refresh.
      }
    }

    return updated.accessToken;
  } catch (err) {
    if (err instanceof RefreshRejectedError) {
      if (opts.setProviderToken) {
        try {
          await opts.setProviderToken(provider, null, currentTokens.email, opts.context);
        } catch {
          // ignore
        }
      }
      throw err;
    }
    // Transient — fall back to the existing access token.
    return currentTokens.accessToken;
  }
}
