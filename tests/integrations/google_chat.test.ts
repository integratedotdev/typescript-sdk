import { describe, test, expect } from "bun:test";
import { googleChatIntegration } from "../../src/integrations/google_chat.js";

describe("Google Chat Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = googleChatIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("google_chat");
    expect(integration.name).toBe("Google Chat");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = googleChatIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("google_chat");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = googleChatIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBeGreaterThan(0);
    expect(integration.oauth?.scopes).toContain(
      "https://www.googleapis.com/auth/chat.messages"
    );
    expect(integration.oauth?.scopes).toContain(
      "https://www.googleapis.com/auth/chat.spaces.readonly"
    );
  });

  test("accepts custom scopes", () => {
    const integration = googleChatIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["https://www.googleapis.com/auth/chat.messages"],
    });

    expect(integration.oauth?.scopes).toEqual([
      "https://www.googleapis.com/auth/chat.messages",
    ]);
  });

  test("includes expected tools", () => {
    const integration = googleChatIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("google_chat_send_message");
    expect(integration.tools).toContain("google_chat_list_spaces");
    expect(integration.tools).toContain("google_chat_list_messages");
    expect(integration.tools).toContain("google_chat_get_space");
  });

  test("has lifecycle hooks defined", () => {
    const integration = googleChatIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = googleChatIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GOOGLE_CHAT_CLIENT_ID;
    const originalSecret = process.env.GOOGLE_CHAT_CLIENT_SECRET;

    process.env.GOOGLE_CHAT_CLIENT_ID = "env-client-id";
    process.env.GOOGLE_CHAT_CLIENT_SECRET = "env-client-secret";

    const integration = googleChatIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GOOGLE_CHAT_CLIENT_ID;
    else process.env.GOOGLE_CHAT_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GOOGLE_CHAT_CLIENT_SECRET;
    else process.env.GOOGLE_CHAT_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GOOGLE_CHAT_CLIENT_ID = "env-id";

    const integration = googleChatIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GOOGLE_CHAT_CLIENT_ID;
  });
});
