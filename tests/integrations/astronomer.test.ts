import { describe, test, expect, afterEach } from "bun:test";
import { astronomerIntegration } from "../../src/integrations/astronomer.js";

describe("Astronomer integration", () => {
  const keys = ["ASTRO_API_TOKEN", "ASTRONOMER_API_TOKEN"] as const;
  const saved: Partial<Record<(typeof keys)[number], string | undefined>> = {};

  afterEach(() => {
    for (const k of keys) {
      if (saved[k] === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = saved[k];
      }
    }
  });

  test("throws when no API token is configured", () => {
    for (const k of keys) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
    expect(() => astronomerIntegration()).toThrow(/apiToken or ASTRO_API_TOKEN/);
  });

  test("builds apiKey integration with explicit token", () => {
    const integration = astronomerIntegration({ apiToken: "test-token" });
    expect(integration.id).toBe("astronomer");
    expect(integration.authType).toBe("apiKey");
    expect(integration.getHeaders?.().Authorization).toBe("Bearer test-token");
    expect(integration.tools).toContain("astronomer_list_organizations");
    expect(integration.tools).toContain("astronomer_get_deployment");
    expect(integration.tools).toContain("astronomer_create_deployment");
  });
});
