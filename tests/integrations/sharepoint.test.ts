import { describe, test, expect } from "bun:test";
import { sharepointIntegration } from "../../src/integrations/sharepoint.js";

describe("SharePoint Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = sharepointIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
    });

    expect(integration.id).toBe("sharepoint");
    expect(integration.name).toBe("SharePoint");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.oauth).toBeDefined();
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Productivity");
  });

  test("uses default scopes and oauth endpoints", () => {
    const integration = sharepointIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.oauth?.scopes).toContain("Sites.ReadWrite.All");
    expect(integration.oauth?.config).toMatchObject({
      authorization_endpoint:
        "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      token_endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    });
  });

  test("includes expected tools", () => {
    const integration = sharepointIntegration({
      clientId: "test-id",
      clientSecret: "test-secret",
    });

    expect(integration.tools).toContain("sharepoint_get_site");
    expect(integration.tools).toContain("sharepoint_list_drives");
    expect(integration.tools).toContain("sharepoint_search_files");
    expect(integration.tools).toContain("sharepoint_upload_file");
  });
});
