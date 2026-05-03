import { describe, test, expect } from "bun:test";
import { gmailIntegration } from "../../src/integrations/gmail.js";

describe("Gmail Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = gmailIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("gmail");
    expect(integration.name).toBe("Gmail");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = gmailIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("gmail");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = gmailIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = gmailIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["gmail.send"],
    });

    expect(integration.oauth?.scopes).toEqual(["gmail.send"]);
  });

  test("includes expected tools", () => {
    const integration = gmailIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("gmail_create_draft");
    expect(integration.tools).toContain("gmail_list_messages");
    expect(integration.tools).toContain("gmail_send_message");
    expect(integration.tools).toContain("gmail_trash_message");
  });

  test("has lifecycle hooks defined", () => {
    const integration = gmailIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = gmailIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GMAIL_CLIENT_ID;
    const originalSecret = process.env.GMAIL_CLIENT_SECRET;

    process.env.GMAIL_CLIENT_ID = "env-client-id";
    process.env.GMAIL_CLIENT_SECRET = "env-client-secret";

    const integration = gmailIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GMAIL_CLIENT_ID;
    else process.env.GMAIL_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GMAIL_CLIENT_SECRET;
    else process.env.GMAIL_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GMAIL_CLIENT_ID = "env-id";

    const integration = gmailIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GMAIL_CLIENT_ID;
  });
});
