import { describe, test, expect } from "bun:test";
import { googleContactsIntegration } from "../../src/integrations/google_contacts.js";

describe("Google Contacts Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = googleContactsIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("google_contacts");
    expect(integration.name).toBe("Google Contacts");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBeDefined();
  });

  test("includes OAuth configuration", () => {
    const integration = googleContactsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.provider).toBe("google_contacts");
    expect(integration.oauth?.clientId).toBe("test-id");
    expect(integration.oauth?.clientSecret).toBe("test-secret");
  });

  test("does not set scopes when not provided (server provides defaults)", () => {
    const integration = googleContactsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toBeUndefined();
  });

  test("accepts custom scopes", () => {
    const integration = googleContactsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
      scopes: ["https://www.googleapis.com/auth/contacts.readonly"],
    });

    expect(integration.oauth?.scopes).toEqual(["https://www.googleapis.com/auth/contacts.readonly"]);
  });

  test("includes expected tools", () => {
    const integration = googleContactsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("google_contacts_list_connections");
    expect(integration.tools).toContain("google_contacts_get_person");
    expect(integration.tools).toContain("google_contacts_copy_other_contact");
  });

  test("has lifecycle hooks defined", () => {
    const integration = googleContactsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = googleContactsIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("reads credentials from environment variables", () => {
    const originalId = process.env.GOOGLE_CONTACTS_CLIENT_ID;
    const originalSecret = process.env.GOOGLE_CONTACTS_CLIENT_SECRET;

    process.env.GOOGLE_CONTACTS_CLIENT_ID = "env-client-id";
    process.env.GOOGLE_CONTACTS_CLIENT_SECRET = "env-client-secret";

    const integration = googleContactsIntegration();

    expect(integration.oauth?.clientId).toBe("env-client-id");
    expect(integration.oauth?.clientSecret).toBe("env-client-secret");

    if (originalId === undefined) delete process.env.GOOGLE_CONTACTS_CLIENT_ID;
    else process.env.GOOGLE_CONTACTS_CLIENT_ID = originalId;
    if (originalSecret === undefined) delete process.env.GOOGLE_CONTACTS_CLIENT_SECRET;
    else process.env.GOOGLE_CONTACTS_CLIENT_SECRET = originalSecret;
  });

  test("explicit config overrides environment variables", () => {
    process.env.GOOGLE_CONTACTS_CLIENT_ID = "env-id";

    const integration = googleContactsIntegration({
      clientId: "explicit-id",
      clientSecret: "explicit-secret",
    });

    expect(integration.oauth?.clientId).toBe("explicit-id");

    delete process.env.GOOGLE_CONTACTS_CLIENT_ID;
  });
});
