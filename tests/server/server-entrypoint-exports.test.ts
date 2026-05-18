import { describe, expect, test } from "bun:test";

import * as server from "../../server.ts";

const oauthBatchExports = [
  "googleAdsIntegration",
  "pinterestIntegration",
  "twitchIntegration",
  "xIntegration",
  "ebayIntegration",
  "miroIntegration",
  "smartsheetIntegration",
  "docusignIntegration",
  "pipedriveIntegration",
  "freshserviceIntegration",
  "zohoCrmIntegration",
  "zohoMailIntegration",
  "zohoDeskIntegration",
  "zohoBooksIntegration",
  "zohoProjectsIntegration",
  "zohoCampaignsIntegration",
  "zohoAnalyticsIntegration",
  "zohoInvoiceIntegration",
] as const;

describe("server entrypoint exports", () => {
  test("exports the OAuth integration batch from integrate-sdk/server", () => {
    for (const exportName of oauthBatchExports) {
      expect(server[exportName]).toBeFunction();
    }
  });
});
