import { describe, test, expect } from "bun:test";
import { calcomIntegration } from "../../src/integrations/calcom.js";

describe("Cal.com Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = calcomIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("calcom");
    expect(integration.name).toBe("Cal.com");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = calcomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("calcom");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
    expect(integration.oauth?.config).toMatchObject({
      apiBaseUrl: "https://api.cal.com/v1",
    });
  });

  test("accepts custom scopes and api base url", () => {
    const integration = calcomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["READ_BOOKING"],
      apiBaseUrl: "https://api.eu.cal.com/v1",
    });

    expect(integration.oauth?.scopes).toEqual(["READ_BOOKING"]);
    expect(integration.oauth?.config).toMatchObject({
      apiBaseUrl: "https://api.eu.cal.com/v1",
    });
  });

  test("includes expected tools", () => {
    const integration = calcomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("calcom_list_bookings");
    expect(integration.tools).toContain("calcom_list_event_types");
    expect(integration.tools).toContain("calcom_get_slots");
    expect(integration.tools).toContain("calcom_get_me");
  });

  test("has lifecycle hooks defined", () => {
    const integration = calcomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });
});
