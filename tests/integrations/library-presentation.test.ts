import { describe, expect, test } from "bun:test";
import {
  astronomerIntegration,
  betterstackIntegration,
  clerkIntegration,
  gocardlessIntegration,
  googleHomeIntegration,
  rampIntegration,
  sageIntegration,
  workdayIntegration,
  workosIntegration,
} from "../../src/index.js";
import { integrationLibraryPresentationFields } from "../../src/integrations/library-metadata.js";

describe("library presentation metadata", () => {
  test("preserves branded provider names that rely on mixed casing", () => {
    expect(gocardlessIntegration({ clientId: "id", clientSecret: "secret" }).name).toBe("GoCardless");
    expect(googleHomeIntegration({ clientId: "id", clientSecret: "secret" }).name).toBe("Google Home");
    expect(sageIntegration({ clientId: "id", clientSecret: "secret" }).name).toBe("Sage");
  });

  test("uses audited categories for integrations that were previously too broad", () => {
    expect(rampIntegration({ clientId: "id", clientSecret: "secret" }).category).toBe("Finance");
    expect(clerkIntegration({ secretKey: "sk_test" }).category).toBe("Identity & Access");
    expect(workosIntegration({ apiKey: "sk_test" }).category).toBe("Identity & Access");
    expect(workdayIntegration({ clientId: "id", clientSecret: "secret" }).category).toBe("HR & Recruiting");
    expect(astronomerIntegration({ apiToken: "token" }).category).toBe("Engineering");
    expect(betterstackIntegration({ apiKey: "token" }).category).toBe("Engineering");
  });

  test("library metadata returns the updated display copy", () => {
    expect(integrationLibraryPresentationFields({ id: "google_home" })).toEqual({
      description: "Manage Google Home devices, structures, rooms, and device commands",
      category: "Lifestyle",
    });
    expect(integrationLibraryPresentationFields({ id: "gocardless" })).toEqual({
      description: "Manage GoCardless institutions, requisitions, accounts, balances, and transactions",
      category: "Banking",
    });
    expect(integrationLibraryPresentationFields({ id: "sage" })).toEqual({
      description: "Manage Sage business details, contacts, products, and sales invoices",
      category: "Accounting",
    });
  });
});
