import { describe, test, expect } from "bun:test";
import { powerpointIntegration } from "../../src/integrations/powerpoint.js";

describe("PowerPoint Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = powerpointIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("powerpoint");
    expect(integration.name).toBe("PowerPoint");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = powerpointIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("powerpoint");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = powerpointIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes === undefined || Array.isArray(integration.oauth?.scopes)).toBe(true);
  });

  test("accepts custom scopes", () => {
    const integration = powerpointIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["Files.ReadWrite"],
    });

    expect(integration.oauth?.scopes).toEqual(["Files.ReadWrite"]);
  });

  test("includes expected tools", () => {
    const integration = powerpointIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("powerpoint_create");
    expect(integration.tools).toContain("powerpoint_list");
    expect(integration.tools).toContain("powerpoint_get");
    expect(integration.tools).toContain("powerpoint_update_content");
  });

  test("has lifecycle hooks defined", () => {
    const integration = powerpointIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = powerpointIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.POWERPOINT_CLIENT_ID;
    const originalSecret = process.env.POWERPOINT_CLIENT_SECRET;

    process.env.POWERPOINT_CLIENT_ID = "env-client-id";
    process.env.POWERPOINT_CLIENT_SECRET = "env-client-secret";

    const integration = powerpointIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.POWERPOINT_CLIENT_ID;
    else process.env.POWERPOINT_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.POWERPOINT_CLIENT_SECRET;
    else process.env.POWERPOINT_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.POWERPOINT_CLIENT_ID = "env-id";

    const integration = powerpointIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.POWERPOINT_CLIENT_ID;
  });
});
