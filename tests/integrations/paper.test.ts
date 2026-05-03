import { describe, test, expect } from "bun:test";
import { paperIntegration } from "../../src/integrations/paper.js";

describe("Paper Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = paperIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("paper");
    expect(integration.name).toBe("Dropbox Paper");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = paperIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("paper");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("uses default scopes when none provided", () => {
    const integration = paperIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeArray();
    expect(integration.oauth?.scopes?.length).toBe(4);
  });

  test("accepts custom scopes", () => {
    const integration = paperIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["files.content.read"],
    });

    expect(integration.oauth?.scopes).toEqual(["files.content.read"]);
  });

  test("includes expected tools", () => {
    const integration = paperIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("paper_create_doc");
    expect(integration.tools).toContain("paper_export_doc");
  });

  test("has lifecycle hooks defined", () => {
    const integration = paperIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = paperIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });
});
