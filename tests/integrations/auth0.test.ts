import { describe, test, expect } from "bun:test";
import { auth0Integration } from "../../src/integrations/auth0.js";

describe("Auth0 Integration", () => {
  test("creates integration with access token", () => {
    const integration = auth0Integration({
      domain: "dev-test.us.auth0.com",
      accessToken: "mgmt-test-token",
    });

    expect(integration.id).toBe("auth0");
    expect(integration.name).toBe("Auth0");
    expect(integration.tools.length).toBe(11);
    expect(integration.tools).toContain("auth0_list_users");
    expect(integration.authType).toBe("apiKey");
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer mgmt-test-token",
      "X-Auth0-Domain": "dev-test.us.auth0.com",
    });
  });

  test("normalizes domain in headers", () => {
    const integration = auth0Integration({
      domain: "https://tenant.eu.auth0.com/",
      accessToken: "tok",
    });
    expect(integration.getHeaders?.()["X-Auth0-Domain"]).toBe("tenant.eu.auth0.com");
  });

  test("throws without domain", () => {
    expect(() =>
      auth0Integration({
        domain: "",
        accessToken: "x",
      })
    ).toThrow(/domain/);
  });

  test("throws without credentials", () => {
    expect(() =>
      auth0Integration({
        domain: "dev.us.auth0.com",
      })
    ).toThrow(/accessToken|CLIENT/);
  });

  test("accepts client credentials pair", () => {
    const integration = auth0Integration({
      domain: "dev.us.auth0.com",
      clientId: "cid",
      clientSecret: "sec",
    });
    expect(integration.onBeforeConnect).toBeDefined();
  });

  test("lifecycle hooks run", async () => {
    const integration = auth0Integration({
      domain: "dev.us.auth0.com",
      accessToken: "tok",
    });
    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("onBeforeConnect fetches token with mock fetch", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ access_token: "from-cc", expires_in: 3600 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })) as typeof fetch;

    const integration = auth0Integration({
      domain: "dev-mock.us.auth0.com",
      clientId: "c",
      clientSecret: "s",
    });

    await integration.onBeforeConnect?.(null as any);
    expect(integration.getHeaders?.().Authorization).toBe("Bearer from-cc");

    globalThis.fetch = original;
  });
});
