import { describe, expect, test } from "bun:test";
import { postmanIntegration } from "../../src/integrations/postman.js";

describe("postmanIntegration", () => {
  test("creates integration with explicit apiKey", () => {
    const integration = postmanIntegration({ apiKey: "PMAK-test-key" });
    expect(integration.id).toBe("postman");
    expect(integration.authType).toBe("apiKey");
    expect(integration.tools).toContain("postman_get_me");
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer PMAK-test-key",
    });
  });

  test("throws without apiKey or env", () => {
    const prev = process.env.POSTMAN_API_KEY;
    delete process.env.POSTMAN_API_KEY;
    expect(() => postmanIntegration()).toThrow(/POSTMAN_API_KEY/);
    if (prev !== undefined) {
      process.env.POSTMAN_API_KEY = prev;
    }
  });

  test("reads POSTMAN_API_KEY from environment", () => {
    const prev = process.env.POSTMAN_API_KEY;
    process.env.POSTMAN_API_KEY = "PMAK-from-env";
    try {
      const integration = postmanIntegration();
      expect(integration.getHeaders?.().Authorization).toBe("Bearer PMAK-from-env");
    } finally {
      if (prev === undefined) {
        delete process.env.POSTMAN_API_KEY;
      } else {
        process.env.POSTMAN_API_KEY = prev;
      }
    }
  });
});
