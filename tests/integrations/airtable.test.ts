import { describe, test, expect } from "bun:test";
import { airtableIntegration } from "../../src/integrations/airtable.js";

describe("Airtable Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = airtableIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("airtable");
    expect(integration.name).toBe("Airtable");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = airtableIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("airtable");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("accepts custom scopes", () => {
    const integration = airtableIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["data.records:read"],
    });

    expect(integration.oauth?.scopes).toEqual(["data.records:read"]);
  });

  test("includes expected tools", () => {
    const integration = airtableIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("airtable_list_bases");
    expect(integration.tools).toContain("airtable_list_records");
    expect(integration.tools).toContain("airtable_create_record");
    expect(integration.tools).toContain("airtable_delete_record");
  });

  test("has lifecycle hooks defined", () => {
    const integration = airtableIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = airtableIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.AIRTABLE_CLIENT_ID;
    const originalSecret = process.env.AIRTABLE_CLIENT_SECRET;

    process.env.AIRTABLE_CLIENT_ID = "env-client-id";
    process.env.AIRTABLE_CLIENT_SECRET = "env-client-secret";

    const integration = airtableIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.AIRTABLE_CLIENT_ID;
    else process.env.AIRTABLE_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.AIRTABLE_CLIENT_SECRET;
    else process.env.AIRTABLE_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.AIRTABLE_CLIENT_ID = "env-id";

    const integration = airtableIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.AIRTABLE_CLIENT_ID;
  });
});
