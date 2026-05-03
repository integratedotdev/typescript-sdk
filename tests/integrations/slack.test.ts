import { describe, test, expect } from "bun:test";
import { slackIntegration } from "../../src/integrations/slack.js";

describe("Slack Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = slackIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("slack");
    expect(integration.name).toBe("Slack");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = slackIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("slack");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = slackIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = slackIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["chat:write"],
    });

    expect(integration.oauth?.scopes).toEqual(["chat:write"]);
  });

  test("includes expected tools", () => {
    const integration = slackIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("slack_send_message");
    expect(integration.tools).toContain("slack_list_channels");
    expect(integration.tools).toContain("slack_list_users");
    expect(integration.tools).toContain("slack_upload_file");
  });

  test("has lifecycle hooks defined", () => {
    const integration = slackIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = slackIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.SLACK_CLIENT_ID;
    const originalSecret = process.env.SLACK_CLIENT_SECRET;

    process.env.SLACK_CLIENT_ID = "env-client-id";
    process.env.SLACK_CLIENT_SECRET = "env-client-secret";

    const integration = slackIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.SLACK_CLIENT_ID;
    else process.env.SLACK_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.SLACK_CLIENT_SECRET;
    else process.env.SLACK_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.SLACK_CLIENT_ID = "env-id";

    const integration = slackIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.SLACK_CLIENT_ID;
  });
});
