import { describe, expect, test } from "bun:test";
import { xeroIntegration } from "../../src/integrations/xero.ts";

describe("xeroIntegration", () => {
  test("returns stable id and provider", () => {
    const integration = xeroIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });
    expect(integration.id).toBe("xero");
    expect(integration.name).toBe("Xero");
    expect(integration.oauth?.provider).toBe("xero");
  });

  test("includes expected tools", () => {
    const integration = xeroIntegration({
      clientId: "id",
      clientSecret: "secret",
    });
    expect(integration.tools).toContain("xero_list_connections");
    expect(integration.tools).toContain("xero_create_invoice");
  });
});
