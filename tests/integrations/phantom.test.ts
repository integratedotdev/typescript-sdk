import { describe, test, expect } from "bun:test";
import { phantomIntegration, buildPhantomBrowseDeeplink } from "../../src/integrations/phantom.js";

describe("Phantom Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = phantomIntegration();

    expect(integration.id).toBe("phantom");
    expect(integration.name).toBe("Phantom");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Other");
  });

  test("includes expected tools", () => {
    const integration = phantomIntegration();

    expect(integration.tools).toContain("phantom_build_browse_deeplink");
    expect(integration.tools).toContain("phantom_deeplink_provider_reference");
  });

  test("has lifecycle hooks defined", () => {
    const integration = phantomIntegration();

    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = phantomIntegration();

    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("accepts optional ref config without throwing", () => {
    expect(() => phantomIntegration({})).not.toThrow();
    expect(() => phantomIntegration({ ref: "https://example.com" })).not.toThrow();
  });
});

describe("buildPhantomBrowseDeeplink", () => {
  test("builds a valid deeplink URL", () => {
    const result = buildPhantomBrowseDeeplink({
      url: "https://example.com/dapp",
      ref: "https://myapp.com",
    });

    expect(result).toStartWith("https://phantom.app/ul/browse/");
    expect(result).toContain("ref=");
  });

  test("throws when url is not https", () => {
    expect(() =>
      buildPhantomBrowseDeeplink({
        url: "http://example.com",
        ref: "https://myapp.com",
      })
    ).toThrow();
  });

  test("throws when ref is not https", () => {
    expect(() =>
      buildPhantomBrowseDeeplink({
        url: "https://example.com",
        ref: "http://myapp.com",
      })
    ).toThrow();
  });
});
