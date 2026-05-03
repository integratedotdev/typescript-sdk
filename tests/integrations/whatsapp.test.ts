import { describe, test, expect } from "bun:test";
import { whatsappIntegration } from "../../src/integrations/whatsapp.js";

describe("WhatsApp Business Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = whatsappIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("whatsapp");
    expect(integration.name).toBe("WhatsApp Business");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = whatsappIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("whatsapp");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = whatsappIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes and business account config", () => {
    const integration = whatsappIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["business_management"],
      businessAccountId: "123456789",
    });

    expect(integration.oauth?.scopes).toEqual(["business_management"]);
    expect(integration.oauth?.config).toMatchObject({
      businessAccountId: "123456789",
    });
  });

  test("includes expected tools", () => {
    const integration = whatsappIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("whatsapp_send_message");
    expect(integration.tools).toContain("whatsapp_send_template");
    expect(integration.tools).toContain("whatsapp_list_templates");
    expect(integration.tools).toContain("whatsapp_get_profile");
  });

  test("has lifecycle hooks defined", () => {
    const integration = whatsappIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = whatsappIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.WHATSAPP_CLIENT_ID;
    const originalSecret = process.env.WHATSAPP_CLIENT_SECRET;

    process.env.WHATSAPP_CLIENT_ID = "env-client-id";
    process.env.WHATSAPP_CLIENT_SECRET = "env-client-secret";

    const integration = whatsappIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.WHATSAPP_CLIENT_ID;
    else process.env.WHATSAPP_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.WHATSAPP_CLIENT_SECRET;
    else process.env.WHATSAPP_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.WHATSAPP_CLIENT_ID = "env-id";

    const integration = whatsappIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.WHATSAPP_CLIENT_ID;
  });
});
