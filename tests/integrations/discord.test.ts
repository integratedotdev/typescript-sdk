import { describe, test, expect } from "bun:test";
import { discordIntegration } from "../../src/integrations/discord.js";

describe("Discord Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = discordIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("discord");
    expect(integration.name).toBe("Discord");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration with default scopes", () => {
    const integration = discordIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("discord");
    expect(integration.oauth?.scopes).toContain("identify");
    expect(integration.oauth?.scopes).toContain("applications.commands");
  });

  test("accepts custom scopes", () => {
    const integration = discordIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["identify"],
    });

    expect(integration.oauth?.scopes).toEqual(["identify"]);
  });

  test("includes expected tools", () => {
    const integration = discordIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("discord_get_current_user");
    expect(integration.tools).toContain("discord_list_my_guilds");
    expect(integration.tools).toContain("discord_send_message");
    expect(integration.tools).toContain("discord_delete_message");
  });

  test("has lifecycle hooks defined", () => {
    const integration = discordIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });
});
