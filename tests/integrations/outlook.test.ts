import { describe, test, expect } from "bun:test";
import { outlookIntegration } from "../../src/integrations/outlook.js";

describe("Outlook Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = outlookIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("outlook");
    expect(integration.name).toBe("Outlook");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = outlookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("outlook");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = outlookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = outlookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["Mail.Read"],
    });

    expect(integration.oauth?.scopes).toEqual(["Mail.Read"]);
  });

  test("includes expected tools", () => {
    const integration = outlookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("outlook_create_event");
    expect(integration.tools).toContain("outlook_list_messages");
    expect(integration.tools).toContain("outlook_send_message");
    expect(integration.tools).toContain("outlook_list_contacts");
  });

  test("has lifecycle hooks defined", () => {
    const integration = outlookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = outlookIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.OUTLOOK_CLIENT_ID;
    const originalSecret = process.env.OUTLOOK_CLIENT_SECRET;

    process.env.OUTLOOK_CLIENT_ID = "env-client-id";
    process.env.OUTLOOK_CLIENT_SECRET = "env-client-secret";

    const integration = outlookIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.OUTLOOK_CLIENT_ID;
    else process.env.OUTLOOK_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.OUTLOOK_CLIENT_SECRET;
    else process.env.OUTLOOK_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.OUTLOOK_CLIENT_ID = "env-id";

    const integration = outlookIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.OUTLOOK_CLIENT_ID;
  });
});
