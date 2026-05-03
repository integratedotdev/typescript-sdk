import { describe, test, expect } from "bun:test";
import { gcalIntegration } from "../../src/integrations/gcal.js";

describe("Google Calendar Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = gcalIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("gcal");
    expect(integration.name).toBe("Google Calendar");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = gcalIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("gcal");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = gcalIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = gcalIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    expect(integration.oauth?.scopes).toEqual([
      "https://www.googleapis.com/auth/calendar.readonly",
    ]);
  });

  test("includes expected tools", () => {
    const integration = gcalIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("gcal_create_event");
    expect(integration.tools).toContain("gcal_list_events");
    expect(integration.tools).toContain("gcal_freebusy");
    expect(integration.tools).toContain("gcal_update_event");
  });

  test("has lifecycle hooks defined", () => {
    const integration = gcalIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = gcalIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GCAL_CLIENT_ID;
    const originalSecret = process.env.GCAL_CLIENT_SECRET;

    process.env.GCAL_CLIENT_ID = "env-client-id";
    process.env.GCAL_CLIENT_SECRET = "env-client-secret";

    const integration = gcalIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GCAL_CLIENT_ID;
    else process.env.GCAL_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GCAL_CLIENT_SECRET;
    else process.env.GCAL_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GCAL_CLIENT_ID = "env-id";

    const integration = gcalIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GCAL_CLIENT_ID;
  });
});
