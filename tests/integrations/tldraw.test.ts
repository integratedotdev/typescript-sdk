import { describe, test, expect } from "bun:test";
import { tldrawIntegration } from "../../src/integrations/tldraw.js";

describe("tldraw Integration", () => {
  test("creates integration with correct structure (no apiKey)", () => {
    const integration = tldrawIntegration();

    expect(integration.id).toBe("tldraw");
    expect(integration.name).toBe("tldraw");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
  });

  test("creates integration with correct structure (with apiKey)", () => {
    const integration = tldrawIntegration({ apiKey: "test-key" });

    expect(integration.id).toBe("tldraw");
    expect(integration.name).toBe("tldraw");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.authType).toBe("apiKey");
  });

  test("getHeaders returns Bearer token when apiKey provided", () => {
    const integration = tldrawIntegration({ apiKey: "my-api-key" });
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer my-api-key",
    });
  });

  test("no getHeaders when no apiKey provided", () => {
    const origKey = process.env.TLDRAW_API_KEY;
    delete process.env.TLDRAW_API_KEY;

    const integration = tldrawIntegration();
    expect(integration.getHeaders).toBeUndefined();

    if (origKey !== undefined) process.env.TLDRAW_API_KEY = origKey;
  });

  test("includes expected tools", () => {
    const integration = tldrawIntegration({ apiKey: "key" });

    expect(integration.tools).toContain("tldraw_unfurl_url");
    expect(integration.tools).toContain("tldraw_create_room_snapshot");
    expect(integration.tools).toContain("tldraw_get_room_snapshot");
    expect(integration.tools).toContain("tldraw_get_published_snapshot");
  });

  test("reads credentials from environment variables", () => {
    const origKey = process.env.TLDRAW_API_KEY;
    process.env.TLDRAW_API_KEY = "env-api-key";

    const integration = tldrawIntegration();
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer env-api-key",
    });

    if (origKey === undefined) delete process.env.TLDRAW_API_KEY;
    else process.env.TLDRAW_API_KEY = origKey;
  });

  test("explicit config overrides environment variables", () => {
    process.env.TLDRAW_API_KEY = "env-key";

    const integration = tldrawIntegration({ apiKey: "explicit-key" });
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer explicit-key",
    });

    delete process.env.TLDRAW_API_KEY;
  });
});
