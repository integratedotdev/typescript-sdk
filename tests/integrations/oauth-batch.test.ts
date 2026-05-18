import { describe, expect, test } from "bun:test";
import {
  googleAdsIntegration,
  pinterestIntegration,
  twitchIntegration,
  xIntegration,
  ebayIntegration,
  miroIntegration,
  smartsheetIntegration,
  docusignIntegration,
  pipedriveIntegration,
  freshserviceIntegration,
  zohoCrmIntegration,
  zohoMailIntegration,
  zohoDeskIntegration,
  zohoBooksIntegration,
  zohoProjectsIntegration,
  zohoCampaignsIntegration,
  zohoAnalyticsIntegration,
  zohoInvoiceIntegration
} from "../../src/index.js";

describe("oauth integration batch", () => {
  test("creates OAuth integrations with expected ids and metadata", () => {
    const cases = [
      [googleAdsIntegration({ clientId: "id", clientSecret: "secret", developerToken: "dev" }), "google_ads"],
      [pinterestIntegration({ clientId: "id", clientSecret: "secret" }), "pinterest"],
      [twitchIntegration({ clientId: "id", clientSecret: "secret" }), "twitch"],
      [xIntegration({ clientId: "id", clientSecret: "secret" }), "x"],
      [ebayIntegration({ clientId: "id", clientSecret: "secret" }), "ebay"],
      [miroIntegration({ clientId: "id", clientSecret: "secret" }), "miro"],
      [smartsheetIntegration({ clientId: "id", clientSecret: "secret" }), "smartsheet"],
      [docusignIntegration({ clientId: "id", clientSecret: "secret" }), "docusign"],
      [pipedriveIntegration({ clientId: "id", clientSecret: "secret" }), "pipedrive"],
      [freshserviceIntegration({ clientId: "id", clientSecret: "secret", domain: "acme" }), "freshservice"],
      [zohoCrmIntegration({ clientId: "id", clientSecret: "secret" }), "zoho_crm"],
      [zohoMailIntegration({ clientId: "id", clientSecret: "secret" }), "zoho_mail"],
      [zohoDeskIntegration({ clientId: "id", clientSecret: "secret" }), "zoho_desk"],
      [zohoBooksIntegration({ clientId: "id", clientSecret: "secret" }), "zoho_books"],
      [zohoProjectsIntegration({ clientId: "id", clientSecret: "secret" }), "zoho_projects"],
      [zohoCampaignsIntegration({ clientId: "id", clientSecret: "secret" }), "zoho_campaigns"],
      [zohoAnalyticsIntegration({ clientId: "id", clientSecret: "secret" }), "zoho_analytics"],
      [zohoInvoiceIntegration({ clientId: "id", clientSecret: "secret" }), "zoho_invoice"],
    ] as const;

    for (const [integration, id] of cases) {
      expect(integration.id).toBe(id);
      expect(integration.oauth?.provider).toBe(id);
      expect(integration.authType).toBe("oauth");
      expect(integration.tools.length).toBeGreaterThan(4);
      expect(integration.description).toBeTruthy();
      expect(integration.category).toBeTruthy();
    }
  });

  test("adds provider-specific static headers", () => {
    expect(googleAdsIntegration({ developerToken: "dev" }).getHeaders?.()).toEqual({ "X-Google-Ads-Developer-Token": "dev" });
    expect(twitchIntegration({ clientId: "tw-client" }).getHeaders?.()).toEqual({ "X-Twitch-Client-Id": "tw-client" });
    expect(freshserviceIntegration({ domain: "acme" }).getHeaders?.()).toEqual({ "X-Freshservice-Domain": "acme" });
    expect(zohoCrmIntegration({ region: "eu" }).getHeaders?.()).toEqual({ "X-Zoho-Region": "eu" });
  });
});
