import { describe, test, expect } from "bun:test";
import { etoroIntegration } from "../../src/integrations/etoro.js";

describe("eToro Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = etoroIntegration({
      publicApiKey: "test-public-key",
      userKey: "test-user-key",
    });

    expect(integration.id).toBe("etoro");
    expect(integration.name).toBe("eToro");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.authType).toBe("apiKey");
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Finance");
  });

  test("throws without credentials", () => {
    const origPublic = process.env.ETORO_PUBLIC_API_KEY;
    const origUser = process.env.ETORO_USER_KEY;
    delete process.env.ETORO_PUBLIC_API_KEY;
    delete process.env.ETORO_USER_KEY;

    expect(() => etoroIntegration()).toThrow();

    if (origPublic !== undefined) process.env.ETORO_PUBLIC_API_KEY = origPublic;
    else delete process.env.ETORO_PUBLIC_API_KEY;
    if (origUser !== undefined) process.env.ETORO_USER_KEY = origUser;
    else delete process.env.ETORO_USER_KEY;
  });

  test("getHeaders returns eToro key headers", () => {
    const integration = etoroIntegration({
      publicApiKey: "pub-key",
      userKey: "user-key",
    });

    expect(integration.getHeaders?.()).toEqual({
      "X-Api-Key": "pub-key",
      "X-User-Key": "user-key",
    });
  });

  test("includes expected tools", () => {
    const integration = etoroIntegration({
      publicApiKey: "pub-key",
      userKey: "user-key",
    });

    expect(integration.tools).toContain("etoro_get_identity");
    expect(integration.tools).toContain("etoro_get_portfolio");
    expect(integration.tools).toContain("etoro_search_instruments");
    expect(integration.tools).toContain("etoro_list_watchlists");
  });

  test("has lifecycle hooks defined", () => {
    const integration = etoroIntegration({
      publicApiKey: "pub-key",
      userKey: "user-key",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = etoroIntegration({
      publicApiKey: "pub-key",
      userKey: "user-key",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const origPublic = process.env.ETORO_PUBLIC_API_KEY;
    const origUser = process.env.ETORO_USER_KEY;

    process.env.ETORO_PUBLIC_API_KEY = "env-pub-key";
    process.env.ETORO_USER_KEY = "env-user-key";

    const integration = etoroIntegration();

    expect(integration.getHeaders?.()).toEqual({
      "X-Api-Key": "env-pub-key",
      "X-User-Key": "env-user-key",
    });

    if (origPublic === undefined) delete process.env.ETORO_PUBLIC_API_KEY;
    else process.env.ETORO_PUBLIC_API_KEY = origPublic;
    if (origUser === undefined) delete process.env.ETORO_USER_KEY;
    else process.env.ETORO_USER_KEY = origUser;
  });

  test("explicit config overrides environment variables", () => {
    process.env.ETORO_PUBLIC_API_KEY = "env-pub-key";
    process.env.ETORO_USER_KEY = "env-user-key";

    const integration = etoroIntegration({
      publicApiKey: "explicit-pub",
      userKey: "explicit-user",
    });

    expect(integration.getHeaders?.()).toEqual({
      "X-Api-Key": "explicit-pub",
      "X-User-Key": "explicit-user",
    });

    delete process.env.ETORO_PUBLIC_API_KEY;
    delete process.env.ETORO_USER_KEY;
  });
});
