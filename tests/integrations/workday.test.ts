import { describe, test, expect } from "bun:test";
import { workdayIntegration } from "../../src/integrations/workday.js";

describe("Workday Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = workdayIntegration({
      clientId: "test-client-id",
      clientSecret: "test-client-secret",
      subdomain: "services1.workday.com|acme_dpt1",
    });

    expect(integration.id).toBe("workday");
    expect(integration.name).toBe("Workday");
    expect(integration.tools).toEqual(["workday_list_workers", "workday_get_worker"]);
    expect(integration.oauth).toBeDefined();
    expect(integration.oauth?.provider).toBe("workday");
    expect((integration.oauth?.config as { subdomain?: string })?.subdomain).toBe(
      "services1.workday.com|acme_dpt1",
    );
  });
});
