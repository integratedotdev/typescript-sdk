/**
 * OAuth refresh helper tests
 */
import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import {
  refreshViaMcp,
  resolveAccessToken,
  shouldRefreshToken,
  RefreshRejectedError,
  RefreshTransientError,
} from "../../src/oauth/refresh.js";
import type { ProviderTokenData } from "../../src/oauth/types.js";

const MCP_URL = "https://mcp.example.test";

function makeToken(overrides: Partial<ProviderTokenData> = {}): ProviderTokenData {
  return {
    accessToken: "current-access",
    refreshToken: "current-refresh",
    tokenType: "Bearer",
    expiresIn: 3600,
    expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    ...overrides,
  };
}

describe("shouldRefreshToken", () => {
  test("returns false for undefined token", () => {
    expect(shouldRefreshToken(undefined)).toBe(false);
  });

  test("returns false when refresh token is missing", () => {
    expect(shouldRefreshToken(makeToken({ refreshToken: undefined }))).toBe(false);
  });

  test("returns false when expiresAt is missing (treated as non-expiring)", () => {
    expect(shouldRefreshToken(makeToken({ expiresAt: undefined }))).toBe(false);
  });

  test("returns false when expiresAt is far in the future", () => {
    const future = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    expect(shouldRefreshToken(makeToken({ expiresAt: future }))).toBe(false);
  });

  test("returns true when within refresh window", () => {
    const near = new Date(Date.now() + 30 * 1000).toISOString();
    expect(shouldRefreshToken(makeToken({ expiresAt: near }))).toBe(true);
  });

  test("returns true when already expired", () => {
    const past = new Date(Date.now() - 60 * 1000).toISOString();
    expect(shouldRefreshToken(makeToken({ expiresAt: past }))).toBe(true);
  });
});

describe("refreshViaMcp", () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("returns parsed result on 200", async () => {
    const fetchMock = mock(async () =>
      new Response(
        JSON.stringify({
          accessToken: "new-access",
          refreshToken: "new-refresh",
          tokenType: "Bearer",
          expiresIn: 3600,
          expiresAt: new Date(Date.now() + 3600_000).toISOString(),
          scopes: ["read", "write"],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    global.fetch = fetchMock as any;

    const result = await refreshViaMcp({
      provider: "gmail",
      refreshToken: "old-refresh",
      clientId: "client-id",
      clientSecret: "client-secret",
      serverUrl: MCP_URL,
    });

    expect(result.accessToken).toBe("new-access");
    expect(result.refreshToken).toBe("new-refresh");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const call = fetchMock.mock.calls[0];
    expect(call[0]).toBe(`${MCP_URL}/oauth/refresh`);
    expect(call[1].method).toBe("POST");
    const body = JSON.parse(call[1].body as string);
    expect(body.provider).toBe("gmail");
    expect(body.refresh_token).toBe("old-refresh");
    expect(body.client_id).toBe("client-id");
    expect(body.client_secret).toBe("client-secret");
  });

  test("echoes back request refreshToken when server omits one", async () => {
    global.fetch = mock(async () =>
      new Response(
        JSON.stringify({
          accessToken: "new-access",
          tokenType: "Bearer",
          expiresIn: 3600,
        }),
        { status: 200 }
      )
    ) as any;

    const result = await refreshViaMcp({
      provider: "gmail",
      refreshToken: "preserved-refresh",
      clientId: "client-id",
      serverUrl: MCP_URL,
    });

    expect(result.refreshToken).toBe("preserved-refresh");
  });

  test("throws RefreshRejectedError on 401 invalid_grant", async () => {
    global.fetch = mock(async () =>
      new Response(JSON.stringify({ error: "invalid_grant" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    ) as any;

    await expect(
      refreshViaMcp({
        provider: "gmail",
        refreshToken: "old",
        clientId: "id",
        serverUrl: MCP_URL,
      })
    ).rejects.toBeInstanceOf(RefreshRejectedError);
  });

  test("throws RefreshTransientError on 5xx", async () => {
    global.fetch = mock(async () =>
      new Response("oops", { status: 502 })
    ) as any;

    await expect(
      refreshViaMcp({
        provider: "gmail",
        refreshToken: "old",
        clientId: "id",
        serverUrl: MCP_URL,
      })
    ).rejects.toBeInstanceOf(RefreshTransientError);
  });

  test("throws RefreshTransientError on network failure", async () => {
    global.fetch = mock(async () => {
      throw new Error("ECONNREFUSED");
    }) as any;

    await expect(
      refreshViaMcp({
        provider: "gmail",
        refreshToken: "old",
        clientId: "id",
        serverUrl: MCP_URL,
      })
    ).rejects.toBeInstanceOf(RefreshTransientError);
  });

  test("omits client_secret for public clients", async () => {
    const fetchMock = mock(async () =>
      new Response(
        JSON.stringify({ accessToken: "x", tokenType: "Bearer", expiresIn: 3600 }),
        { status: 200 }
      )
    );
    global.fetch = fetchMock as any;

    await refreshViaMcp({
      provider: "polar",
      refreshToken: "rt",
      clientId: "cid",
      serverUrl: MCP_URL,
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.client_secret).toBeUndefined();
  });
});

describe("resolveAccessToken", () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  const providerOAuth = { clientId: "cid", clientSecret: "csec" };

  test("returns current access token unchanged when not near expiry", async () => {
    const fetchMock = mock(async () => new Response("nope", { status: 500 }));
    global.fetch = fetchMock as any;
    const set = mock(async () => {});

    const out = await resolveAccessToken({
      provider: "gmail",
      currentTokens: makeToken(),
      providerOAuth,
      serverUrl: MCP_URL,
      setProviderToken: set,
    });

    expect(out).toBe("current-access");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
  });

  test("returns current access token when expiresAt is missing (non-expiring)", async () => {
    const fetchMock = mock(async () => new Response("nope", { status: 500 }));
    global.fetch = fetchMock as any;
    const set = mock(async () => {});

    const out = await resolveAccessToken({
      provider: "github",
      currentTokens: makeToken({ expiresAt: undefined }),
      providerOAuth,
      serverUrl: MCP_URL,
      setProviderToken: set,
    });

    expect(out).toBe("current-access");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("refreshes, persists, and returns new token when near expiry", async () => {
    global.fetch = mock(async () =>
      new Response(
        JSON.stringify({
          accessToken: "fresh-access",
          refreshToken: "fresh-refresh",
          tokenType: "Bearer",
          expiresIn: 3600,
          expiresAt: new Date(Date.now() + 3600_000).toISOString(),
          scopes: ["read"],
        }),
        { status: 200 }
      )
    ) as any;
    const set = mock(async () => {});

    const near = new Date(Date.now() + 30_000).toISOString();
    const out = await resolveAccessToken({
      provider: "gmail",
      currentTokens: makeToken({ expiresAt: near }),
      providerOAuth,
      serverUrl: MCP_URL,
      setProviderToken: set,
    });

    expect(out).toBe("fresh-access");
    expect(set).toHaveBeenCalledTimes(1);
    const [, persisted] = set.mock.calls[0];
    expect(persisted).not.toBeNull();
    expect((persisted as ProviderTokenData).accessToken).toBe("fresh-access");
    expect((persisted as ProviderTokenData).refreshToken).toBe("fresh-refresh");
  });

  test("force=true triggers refresh even when not near expiry", async () => {
    const fetchMock = mock(async () =>
      new Response(
        JSON.stringify({
          accessToken: "forced-access",
          tokenType: "Bearer",
          expiresIn: 3600,
        }),
        { status: 200 }
      )
    );
    global.fetch = fetchMock as any;
    const set = mock(async () => {});

    const out = await resolveAccessToken({
      provider: "gmail",
      currentTokens: makeToken(),
      providerOAuth,
      serverUrl: MCP_URL,
      setProviderToken: set,
      force: true,
    });

    expect(out).toBe("forced-access");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("on invalid_grant, clears token and rethrows", async () => {
    global.fetch = mock(async () =>
      new Response(JSON.stringify({ error: "invalid_grant" }), { status: 401 })
    ) as any;
    const set = mock(async () => {});

    const near = new Date(Date.now() + 30_000).toISOString();
    await expect(
      resolveAccessToken({
        provider: "gmail",
        currentTokens: makeToken({ expiresAt: near }),
        providerOAuth,
        serverUrl: MCP_URL,
        setProviderToken: set,
      })
    ).rejects.toBeInstanceOf(RefreshRejectedError);

    expect(set).toHaveBeenCalledTimes(1);
    const [, persisted] = set.mock.calls[0];
    expect(persisted).toBeNull();
  });

  test("on transient failure, falls back to existing access token", async () => {
    global.fetch = mock(async () => new Response("503", { status: 503 })) as any;
    const set = mock(async () => {});

    const near = new Date(Date.now() + 30_000).toISOString();
    const out = await resolveAccessToken({
      provider: "gmail",
      currentTokens: makeToken({ expiresAt: near }),
      providerOAuth,
      serverUrl: MCP_URL,
      setProviderToken: set,
    });

    expect(out).toBe("current-access");
    expect(set).not.toHaveBeenCalled();
  });
});
