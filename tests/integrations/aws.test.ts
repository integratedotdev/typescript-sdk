import { describe, test, expect } from "bun:test";
import { awsIntegration, encodeAwsCredentialsPayload } from "../../src/integrations/aws.js";

describe("AWS Integration", () => {
  test("creates integration with correct structure", () => {
    const integration = awsIntegration({
      credentials: {
        accessKeyId: "AKIA_TEST",
        secretAccessKey: "secret",
        region: "us-east-1",
      },
    });

    expect(integration.id).toBe("aws");
    expect(integration.name).toBe("Amazon Web Services");
    expect(integration.tools).toBeArray();
    expect(integration.tools.length).toBeGreaterThan(0);
    expect(integration.authType).toBe("apiKey");
    expect(integration.logoUrl).toBeDefined();
    expect(integration.description).toBeDefined();
    expect(integration.category).toBe("Infrastructure");
  });

  test("includes expected tools", () => {
    const integration = awsIntegration({
      credentials: { accessKeyId: "A", secretAccessKey: "B" },
    });
    expect(integration.tools).toContain("aws_sts_get_caller_identity");
    expect(integration.tools).toContain("aws_s3_list_buckets");
    expect(integration.tools).toContain("aws_ec2_describe_instances");
  });

  test("sends compact JSON bearer credentials", () => {
    const integration = awsIntegration({
      credentials: {
        accessKeyId: "AKIA",
        secretAccessKey: "KEY",
        sessionToken: "tok",
        region: "eu-west-1",
      },
    });
    const h = integration.getHeaders?.();
    expect(h?.Authorization?.startsWith("Bearer ")).toBe(true);
    const body = h!.Authorization!.slice(7);
    const parsed = JSON.parse(body) as Record<string, string>;
    expect(parsed.accessKeyId).toBe("AKIA");
    expect(parsed.secretAccessKey).toBe("KEY");
    expect(parsed.sessionToken).toBe("tok");
    expect(parsed.region).toBe("eu-west-1");
  });

  test("encodeAwsCredentialsPayload omits optional fields when absent", () => {
    const s = encodeAwsCredentialsPayload({
      accessKeyId: "A",
      secretAccessKey: "B",
    });
    expect(s).not.toContain("sessionToken");
    const p = JSON.parse(s) as Record<string, string>;
    expect(Object.keys(p).sort()).toEqual(["accessKeyId", "secretAccessKey"]);
  });

  test("has lifecycle hooks defined", () => {
    const integration = awsIntegration({
      credentials: { accessKeyId: "A", secretAccessKey: "B" },
    });
    expect(integration.onInit).toBeDefined();
    expect(integration.onAfterConnect).toBeDefined();
  });

  test("lifecycle hooks execute successfully", async () => {
    const integration = awsIntegration({
      credentials: { accessKeyId: "A", secretAccessKey: "B" },
    });
    await expect(integration.onInit?.(null as any)).resolves.toBeUndefined();
    await expect(integration.onAfterConnect?.(null as any)).resolves.toBeUndefined();
  });

  test("throws without credentials or env", () => {
    const prevId = process.env.AWS_ACCESS_KEY_ID;
    const prevSecret = process.env.AWS_SECRET_ACCESS_KEY;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
    try {
      expect(() => awsIntegration()).toThrow();
    } finally {
      if (prevId === undefined) delete process.env.AWS_ACCESS_KEY_ID;
      else process.env.AWS_ACCESS_KEY_ID = prevId;
      if (prevSecret === undefined) delete process.env.AWS_SECRET_ACCESS_KEY;
      else process.env.AWS_SECRET_ACCESS_KEY = prevSecret;
    }
  });

  test("reads credentials from environment variables", () => {
    const oId = process.env.AWS_ACCESS_KEY_ID;
    const oSec = process.env.AWS_SECRET_ACCESS_KEY;
    process.env.AWS_ACCESS_KEY_ID = "env-id";
    process.env.AWS_SECRET_ACCESS_KEY = "env-secret";
    try {
      const integration = awsIntegration();
      const auth = integration.getHeaders?.()?.Authorization ?? "";
      const json = JSON.parse(auth.replace(/^Bearer\s+/i, "")) as { accessKeyId: string };
      expect(json.accessKeyId).toBe("env-id");
    } finally {
      if (oId === undefined) delete process.env.AWS_ACCESS_KEY_ID;
      else process.env.AWS_ACCESS_KEY_ID = oId;
      if (oSec === undefined) delete process.env.AWS_SECRET_ACCESS_KEY;
      else process.env.AWS_SECRET_ACCESS_KEY = oSec;
    }
  });
});
