/**
 * Email fetcher tests
 *
 * Each provider's fetcher is exercised against a stubbed fetch to confirm
 * (a) the right URL/headers/body are sent, (b) the email is extracted from
 * the response shape, and (c) failures return undefined rather than
 * throwing.
 */
import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import {
  fetchUserEmail,
  registerEmailFetcher,
  type EmailFetcher,
} from "../../src/oauth/email-fetcher.js";
import type { ProviderTokenData } from "../../src/oauth/types.js";

function token(overrides: Partial<ProviderTokenData> = {}): ProviderTokenData {
  return {
    accessToken: "access-token",
    tokenType: "Bearer",
    expiresIn: 3600,
    ...overrides,
  };
}

function jsonResponse(body: unknown, init: { status?: number } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("fetchUserEmail", () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("falls back to tokenData.email when no fetcher is registered", async () => {
    global.fetch = mock(async () => new Response("", { status: 500 })) as any;
    const out = await fetchUserEmail("unknown-provider", token({ email: "stored@example.com" }));
    expect(out).toBe("stored@example.com");
  });

  test("returns undefined for unregistered provider with no stored email", async () => {
    global.fetch = mock(async () => new Response("", { status: 500 })) as any;
    const out = await fetchUserEmail("unknown-provider", token());
    expect(out).toBeUndefined();
  });

  test("github: returns public email when present", async () => {
    global.fetch = mock(async (url: any) => {
      if (String(url).endsWith("/user")) return jsonResponse({ email: "me@github.test" });
      return jsonResponse([]);
    }) as any;
    expect(await fetchUserEmail("github", token())).toBe("me@github.test");
  });

  test("github: falls through to /user/emails when no public email", async () => {
    global.fetch = mock(async (url: any) => {
      if (String(url).endsWith("/user")) return jsonResponse({ email: null });
      return jsonResponse([
        { email: "secondary@github.test", primary: false, verified: true },
        { email: "primary@github.test", primary: true, verified: true },
      ]);
    }) as any;
    expect(await fetchUserEmail("github", token())).toBe("primary@github.test");
  });

  test("gmail: reads userinfo endpoint", async () => {
    const fetchMock = mock(async () => jsonResponse({ email: "jess@gmail.test" }));
    global.fetch = fetchMock as any;
    expect(await fetchUserEmail("gmail", token())).toBe("jess@gmail.test");
    expect(String(fetchMock.mock.calls[0][0])).toContain("oauth2/v2/userinfo");
  });

  test("notion: reads /v1/users/me person.email", async () => {
    global.fetch = mock(async () =>
      jsonResponse({ person: { email: "jess@notion.test" } })
    ) as any;
    expect(await fetchUserEmail("notion", token())).toBe("jess@notion.test");
  });

  test("linear: posts GraphQL query and reads viewer.email", async () => {
    const fetchMock = mock(async () =>
      jsonResponse({ data: { viewer: { email: "jess@linear.test" } } })
    );
    global.fetch = fetchMock as any;
    expect(await fetchUserEmail("linear", token())).toBe("jess@linear.test");
    const call = fetchMock.mock.calls[0];
    expect(call[1].method).toBe("POST");
    expect(JSON.parse(call[1].body as string).query).toContain("viewer");
  });

  test("hubspot: hits /oauth/v1/access-tokens/<token> and reads user field", async () => {
    const fetchMock = mock(async () => jsonResponse({ user: "jess@hubspot.test" }));
    global.fetch = fetchMock as any;
    expect(await fetchUserEmail("hubspot", token({ accessToken: "abc" }))).toBe(
      "jess@hubspot.test"
    );
    expect(String(fetchMock.mock.calls[0][0])).toContain("/oauth/v1/access-tokens/abc");
  });

  test("polar: reads /v1/oauth2/userinfo", async () => {
    const fetchMock = mock(async () => jsonResponse({ email: "jess@polar.test" }));
    global.fetch = fetchMock as any;
    expect(await fetchUserEmail("polar", token())).toBe("jess@polar.test");
    expect(String(fetchMock.mock.calls[0][0])).toContain("polar.sh");
  });

  test("todoist: POST /sync/v9/sync, reads user.email", async () => {
    const fetchMock = mock(async () =>
      jsonResponse({ user: { email: "jess@todoist.test" } })
    );
    global.fetch = fetchMock as any;
    expect(await fetchUserEmail("todoist", token())).toBe("jess@todoist.test");
    expect(fetchMock.mock.calls[0][1].method).toBe("POST");
  });

  test("vercel: reads user.email from /v2/user", async () => {
    global.fetch = mock(async () =>
      jsonResponse({ user: { email: "jess@vercel.test" } })
    ) as any;
    expect(await fetchUserEmail("vercel", token())).toBe("jess@vercel.test");
  });

  test("slack: reads users.identity response", async () => {
    global.fetch = mock(async () =>
      jsonResponse({ ok: true, user: { email: "jess@slack.test" } })
    ) as any;
    expect(await fetchUserEmail("slack", token())).toBe("jess@slack.test");
  });

  test("slack: ok=false returns undefined", async () => {
    global.fetch = mock(async () =>
      jsonResponse({ ok: false, error: "invalid_auth" })
    ) as any;
    expect(await fetchUserEmail("slack", token())).toBeUndefined();
  });

  test("intercom: reads /me", async () => {
    global.fetch = mock(async () => jsonResponse({ email: "jess@intercom.test" })) as any;
    expect(await fetchUserEmail("intercom", token())).toBe("jess@intercom.test");
  });

  test("jira: reads atlassian.com/me", async () => {
    const fetchMock = mock(async () => jsonResponse({ email: "jess@atlassian.test" }));
    global.fetch = fetchMock as any;
    expect(await fetchUserEmail("jira", token())).toBe("jess@atlassian.test");
    expect(String(fetchMock.mock.calls[0][0])).toContain("atlassian.com/me");
  });

  test("zendesk: requires subdomain in providerConfig", async () => {
    global.fetch = mock(async () =>
      jsonResponse({ user: { email: "jess@zendesk.test" } })
    ) as any;
    expect(
      await fetchUserEmail(
        "zendesk",
        token({ providerConfig: { subdomain: "acme" } })
      )
    ).toBe("jess@zendesk.test");
  });

  test("zendesk: missing subdomain returns undefined without making request", async () => {
    const fetchMock = mock(async () => new Response("should not be called", { status: 500 }));
    global.fetch = fetchMock as any;
    expect(await fetchUserEmail("zendesk", token())).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("airtable: reads meta/whoami", async () => {
    global.fetch = mock(async () => jsonResponse({ email: "jess@airtable.test" })) as any;
    expect(await fetchUserEmail("airtable", token())).toBe("jess@airtable.test");
  });

  test("discord: reads /users/@me", async () => {
    global.fetch = mock(async () => jsonResponse({ email: "jess@discord.test" })) as any;
    expect(await fetchUserEmail("discord", token())).toBe("jess@discord.test");
  });

  test("dropbox: POSTs to get_current_account", async () => {
    const fetchMock = mock(async () => jsonResponse({ email: "jess@dropbox.test" }));
    global.fetch = fetchMock as any;
    expect(await fetchUserEmail("dropbox", token())).toBe("jess@dropbox.test");
    expect(fetchMock.mock.calls[0][1].method).toBe("POST");
  });

  test("gitlab: reads /api/v4/user", async () => {
    global.fetch = mock(async () => jsonResponse({ email: "jess@gitlab.test" })) as any;
    expect(await fetchUserEmail("gitlab", token())).toBe("jess@gitlab.test");
  });

  test("reddit: returns username when email isn't exposed", async () => {
    global.fetch = mock(async () => jsonResponse({ name: "jess-reddit" })) as any;
    expect(await fetchUserEmail("reddit", token())).toBe("jess-reddit");
  });

  test("microsoft providers: reads mail || userPrincipalName from Graph", async () => {
    global.fetch = mock(async () =>
      jsonResponse({ userPrincipalName: "jess@contoso.test" })
    ) as any;
    expect(await fetchUserEmail("outlook", token())).toBe("jess@contoso.test");
  });

  test("non-200 response returns undefined (falls back to stored email)", async () => {
    global.fetch = mock(async () => new Response("nope", { status: 500 })) as any;
    expect(
      await fetchUserEmail("linear", token({ email: "fallback@example.test" }))
    ).toBe("fallback@example.test");
  });

  test("fetch throwing returns undefined (falls back to stored email)", async () => {
    global.fetch = mock(async () => {
      throw new Error("boom");
    }) as any;
    expect(
      await fetchUserEmail("vercel", token({ email: "fallback@example.test" }))
    ).toBe("fallback@example.test");
  });

  test("registerEmailFetcher: custom provider works", async () => {
    const fetcher: EmailFetcher = mock(async () => "custom@example.test");
    registerEmailFetcher("custom-provider", fetcher);
    expect(await fetchUserEmail("custom-provider", token())).toBe("custom@example.test");
  });
});
