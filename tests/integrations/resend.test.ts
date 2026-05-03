import { describe, test, expect } from "bun:test";
import { resendIntegration } from "../../src/integrations/resend.js";

describe("Resend Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = resendIntegration({
      apiKey: "re_test_key",
    });

    expect(integration.id).toBe("resend");
    expect(integration.name).toBe("Resend");
    expect(integration.authType).toBe("apiKey");
    expect(integration.tools).toContain("resend_send_email");
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer re_test_key",
    });
  });

  test("throws without api key", () => {
    const original = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;

    expect(() => resendIntegration()).toThrow();

    if (original === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = original;
  });

  test("reads api key from environment variables", () => {
    const original = process.env.RESEND_API_KEY;
    process.env.RESEND_API_KEY = "env-key";

    const integration = resendIntegration();
    expect(integration.getHeaders?.()).toEqual({
      Authorization: "Bearer env-key",
    });

    if (original === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = original;
  });
});
