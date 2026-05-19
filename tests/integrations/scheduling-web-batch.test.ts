import { describe, expect, test } from "bun:test";
import {
  calendlyIntegration,
  klaviyoIntegration,
  googleFormsIntegration,
  firebaseIntegration,
  microsoftToDoIntegration,
  onenoteIntegration,
  microsoftBookingsIntegration,
  azureDevopsIntegration,
  googlePlayConsoleIntegration,
  squarespaceIntegration,
  zohoPeopleIntegration,
  zohoRecruitIntegration,
  zohoSignIntegration,
  zohoWorkdriveIntegration,
  zohoCreatorIntegration,
  zohoInventoryIntegration,
  zohoBillingIntegration,
  zohoWriterIntegration,
  zohoSprintsIntegration,
} from "../../src/index.js";

const cases = [
  [calendlyIntegration({ clientId: "id", clientSecret: "secret" }), "calendly", "Scheduling"],
  [klaviyoIntegration({ clientId: "id", clientSecret: "secret" }), "klaviyo", "Marketing"],
  [googleFormsIntegration({ clientId: "id", clientSecret: "secret" }), "google_forms", "Productivity"],
  [firebaseIntegration({ clientId: "id", clientSecret: "secret" }), "firebase", "Infrastructure"],
  [microsoftToDoIntegration({ clientId: "id", clientSecret: "secret" }), "microsoft_to_do", "Productivity"],
  [onenoteIntegration({ clientId: "id", clientSecret: "secret" }), "onenote", "Productivity"],
  [microsoftBookingsIntegration({ clientId: "id", clientSecret: "secret" }), "microsoft_bookings", "Scheduling"],
  [azureDevopsIntegration({ clientId: "id", clientSecret: "secret" }), "azure_devops", "Engineering"],
  [googlePlayConsoleIntegration({ clientId: "id", clientSecret: "secret" }), "google_play_console", "Engineering"],
  [squarespaceIntegration({ clientId: "id", clientSecret: "secret" }), "squarespace", "Websites & CMS"],
  [zohoPeopleIntegration({ clientId: "id", clientSecret: "secret", region: "eu" }), "zoho_people", "HR & Recruiting"],
  [zohoRecruitIntegration({ clientId: "id", clientSecret: "secret", region: "eu" }), "zoho_recruit", "HR & Recruiting"],
  [zohoSignIntegration({ clientId: "id", clientSecret: "secret", region: "eu" }), "zoho_sign", "Legal"],
  [zohoWorkdriveIntegration({ clientId: "id", clientSecret: "secret", region: "eu" }), "zoho_workdrive", "Storage"],
  [zohoCreatorIntegration({ clientId: "id", clientSecret: "secret", region: "eu" }), "zoho_creator", "Business"],
  [zohoInventoryIntegration({ clientId: "id", clientSecret: "secret", region: "eu" }), "zoho_inventory", "Commerce"],
  [zohoBillingIntegration({ clientId: "id", clientSecret: "secret", region: "eu" }), "zoho_billing", "Accounting"],
  [zohoWriterIntegration({ clientId: "id", clientSecret: "secret", region: "eu" }), "zoho_writer", "Productivity"],
  [zohoSprintsIntegration({ clientId: "id", clientSecret: "secret", region: "eu" }), "zoho_sprints", "Engineering"],
] as const;

describe("Scheduling, websites, and productivity integration batch", () => {
  test("creates integrations with expected ids, categories, and tool lists", () => {
    for (const [integration, id, category] of cases) {
      expect(integration.id).toBe(id);
      expect(integration.oauth?.provider).toBe(id);
      expect(integration.authType).toBe("oauth");
      expect(integration.category).toBe(category);
      expect(integration.description).toBeTruthy();
      expect(integration.tools.length).toBeGreaterThanOrEqual(5);
    }
  });
});
