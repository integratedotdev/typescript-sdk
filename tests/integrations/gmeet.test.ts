import { describe, test, expect } from "bun:test";
import { gmeetIntegration } from "../../src/integrations/gmeet.js";

describe("Google Meet Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = gmeetIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("gmeet");
    expect(integration.name).toBe("Google Meet");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Communication");
  });

  test("includes OAuth configuration", () => {
    const integration = gmeetIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("gmeet");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = gmeetIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = gmeetIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["https://www.googleapis.com/auth/calendar.events"],
    });

    expect(integration.oauth?.scopes).toEqual([
      "https://www.googleapis.com/auth/calendar.events",
    ]);
  });

  test("includes expected tools", () => {
    const integration = gmeetIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("gmeet_create_meeting");
    expect(integration.tools).toContain("gmeet_get_meeting");
    expect(integration.tools).toContain("gmeet_update_meeting");
    expect(integration.tools).toContain("gmeet_add_meet_to_event");
  });

  test("has lifecycle hooks defined", () => {
    const integration = gmeetIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = gmeetIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GMEET_CLIENT_ID;
    const originalSecret = process.env.GMEET_CLIENT_SECRET;

    process.env.GMEET_CLIENT_ID = "env-client-id";
    process.env.GMEET_CLIENT_SECRET = "env-client-secret";

    const integration = gmeetIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GMEET_CLIENT_ID;
    else process.env.GMEET_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GMEET_CLIENT_SECRET;
    else process.env.GMEET_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GMEET_CLIENT_ID = "env-id";

    const integration = gmeetIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GMEET_CLIENT_ID;
  });
});
