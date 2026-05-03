import { describe, test, expect } from "bun:test";
import { gslidesIntegration } from "../../src/integrations/gslides.js";

describe("Google Slides Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = gslidesIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("gslides");
    expect(integration.name).toBe("Google Slides");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = gslidesIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("gslides");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided", () => {
    const integration = gslidesIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = gslidesIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["https://www.googleapis.com/auth/presentations.readonly"],
    });

    expect(integration.oauth?.scopes).toEqual([
      "https://www.googleapis.com/auth/presentations.readonly",
    ]);
  });

  test("includes expected tools", () => {
    const integration = gslidesIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("gslides_create");
    expect(integration.tools).toContain("gslides_get");
    expect(integration.tools).toContain("gslides_add_slide");
    expect(integration.tools).toContain("gslides_update_text");
  });

  test("has lifecycle hooks defined", () => {
    const integration = gslidesIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = gslidesIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GSLIDES_CLIENT_ID;
    const originalSecret = process.env.GSLIDES_CLIENT_SECRET;

    process.env.GSLIDES_CLIENT_ID = "env-client-id";
    process.env.GSLIDES_CLIENT_SECRET = "env-client-secret";

    const integration = gslidesIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GSLIDES_CLIENT_ID;
    else process.env.GSLIDES_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GSLIDES_CLIENT_SECRET;
    else process.env.GSLIDES_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GSLIDES_CLIENT_ID = "env-id";

    const integration = gslidesIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GSLIDES_CLIENT_ID;
  });
});
