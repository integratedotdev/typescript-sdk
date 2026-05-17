import { describe, expect, test } from "bun:test";
import {
  asanaIntegration,
  bitbucketIntegration,
  confluenceIntegration,
  oktaIntegration,
  paypalIntegration,
  quickbooksIntegration,
  smartthingsIntegration,
  spotifyIntegration,
  squareIntegration,
  stravaIntegration,
} from "../../src/index.js";

describe("new integration batch", () => {
  test("creates OAuth integrations with expected ids, providers, and tool names", () => {
    const cases = [
      [squareIntegration({ clientId: "id", clientSecret: "secret" }), "square", "square_list_payments"],
      [spotifyIntegration({ clientId: "id", clientSecret: "secret" }), "spotify", "spotify_search"],
      [stravaIntegration({ clientId: "id", clientSecret: "secret" }), "strava", "strava_list_athlete_activities"],
      [asanaIntegration({ clientId: "id", clientSecret: "secret" }), "asana", "asana_list_tasks"],
      [confluenceIntegration({ clientId: "id", clientSecret: "secret" }), "confluence", "confluence_search"],
      [quickbooksIntegration({ clientId: "id", clientSecret: "secret" }), "quickbooks", "quickbooks_query"],
      [bitbucketIntegration({ clientId: "id", clientSecret: "secret" }), "bitbucket", "bitbucket_list_pull_requests"],
      [smartthingsIntegration({ clientId: "id", clientSecret: "secret" }), "smartthings", "smartthings_list_devices"],
    ] as const;

    for (const [integration, id, tool] of cases) {
      expect(integration.id).toBe(id);
      expect(integration.oauth?.provider).toBe(id);
      expect(integration.tools).toContain(tool);
      expect(integration.tools.length).toBeGreaterThan(5);
    }
  });

  test("PayPal uses client credentials to produce bearer headers", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ access_token: "paypal-token" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })) as typeof fetch;

    const integration = paypalIntegration({
      clientId: "client",
      clientSecret: "secret",
      environment: "sandbox",
    });

    expect(integration.id).toBe("paypal");
    expect(integration.oauth).toBeUndefined();
    expect(integration.tools).toContain("paypal_create_order");
    await integration.onBeforeConnect?.(null as any);
    expect(integration.getHeaders?.().Authorization).toBe("Bearer paypal-token");

    globalThis.fetch = original;
  });

  test("Okta normalizes domain and forwards it as a static header", () => {
    const integration = oktaIntegration({
      domain: "https://dev-123.okta.com/",
      accessToken: "okta-token",
      clientId: "id",
      clientSecret: "secret",
    });

    expect(integration.id).toBe("okta");
    expect(integration.oauth?.provider).toBe("okta");
    expect((integration.oauth?.config as Record<string, string>).subdomain).toBe("dev-123.okta.com");
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer okta-token",
      "X-Okta-Domain": "dev-123.okta.com",
    });
  });

  test("SmartThings supports a PAT-style bearer token", () => {
    const integration = smartthingsIntegration({ accessToken: "pat-token" });

    expect(integration.id).toBe("smartthings");
    expect(integration.authType).toBe("apiKey");
    expect(integration.getHeaders?.()).toEqual({ Authorization: "Bearer pat-token" });
  });
});
