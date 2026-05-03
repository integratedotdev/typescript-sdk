import { describe, test, expect } from "bun:test";
import { trelloIntegration } from "../../src/integrations/trello.js";

describe("Trello Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = trelloIntegration({
      apiKey: "trello-key",
      memberToken: "trello-token",
    });

    expect(integration.id).toBe("trello");
    expect(integration.name).toBe("Trello");
    expect(integration.authType).toBe("apiKey");
    expect(integration.tools).toContain("trello_list_boards");
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Productivity");
  });

  test("encodes credentials in bearer header", () => {
    const integration = trelloIntegration({
      apiKey: "trello-key",
      memberToken: "trello-token",
    });

    const auth = integration.getHeaders?.().Authorization ?? "";
    expect(auth.startsWith("Bearer trello:")).toBe(true);
  });

  test("throws without credentials", () => {
    const originalKey = process.env.TRELLO_API_KEY;
    const originalToken = process.env.TRELLO_TOKEN;
    delete process.env.TRELLO_API_KEY;
    delete process.env.TRELLO_TOKEN;

    expect(() => trelloIntegration()).toThrow();

    if (originalKey === undefined) delete process.env.TRELLO_API_KEY;
    else process.env.TRELLO_API_KEY = originalKey;
    if (originalToken === undefined) delete process.env.TRELLO_TOKEN;
    else process.env.TRELLO_TOKEN = originalToken;
  });
});
