import { describe, test, expect } from "bun:test";
import { mercuryIntegration } from "../../src/integrations/mercury.js";

describe("Mercury Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = mercuryIntegration({ apiKey: "test-api-key" });

    expect(integration.id).toBe("mercury");
    expect(integration.name).toBe("Mercury");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.authType).toBe("apiKey");
  });

  test("throws without apiKey", () => {
    expect(() => mercuryIntegration({ apiKey: "" })).toThrow();
  });

  test("getHeaders returns Bearer token header", () => {
    const integration = mercuryIntegration({ apiKey: "my-api-key" });

    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer my-api-key",
    });
  });

  test("includes expected tools", () => {
    const integration = mercuryIntegration({ apiKey: "test-key" });

    expect(integration.tools).toContain("mercury_list_accounts");
    expect(integration.tools).toContain("mercury_get_account");
    expect(integration.tools).toContain("mercury_list_transactions");
    expect(integration.tools).toContain("mercury_send_money");
  });

  test("does not have lifecycle hooks", () => {
    const integration = mercuryIntegration({ apiKey: "test-key" });

    // Mercury integration does not define onInit or onAfterConnect
    expect(integration.onInit).toBeUndefined();
    expect(integration.onAfterConnect).toBeUndefined();
  });
});
