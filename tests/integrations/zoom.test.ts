import { describe, test, expect } from "bun:test";
import { zoomIntegration } from "../../src/integrations/zoom.js";

describe("Zoom Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = zoomIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("zoom");
    expect(integration.name).toBe("Zoom");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = zoomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("zoom");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = zoomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = zoomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["meeting:read"],
    });

    expect(integration.oauth?.scopes).toEqual(["meeting:read"]);
  });

  test("includes expected tools", () => {
    const integration = zoomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("zoom_get_user");
    expect(integration.tools).toContain("zoom_list_meetings");
    expect(integration.tools).toContain("zoom_create_meeting");
    expect(integration.tools).toContain("zoom_delete_meeting");
  });

  test("has lifecycle hooks defined", () => {
    const integration = zoomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = zoomIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.ZOOM_CLIENT_ID;
    const originalSecret = process.env.ZOOM_CLIENT_SECRET;

    process.env.ZOOM_CLIENT_ID = "env-client-id";
    process.env.ZOOM_CLIENT_SECRET = "env-client-secret";

    const integration = zoomIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.ZOOM_CLIENT_ID;
    else process.env.ZOOM_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.ZOOM_CLIENT_SECRET;
    else process.env.ZOOM_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.ZOOM_CLIENT_ID = "env-id";

    const integration = zoomIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.ZOOM_CLIENT_ID;
  });
});
