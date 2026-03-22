/**
 * Webhook Delivery Tests
 */

import { describe, test, expect, beforeEach, afterEach, mock } from "bun:test";
import { signPayload, deliverWebhook, deliverWebhooks } from "../../src/triggers/webhooks.js";
import type { WebhookConfig, WebhookPayload } from "../../src/triggers/types.js";

const makePayload = (overrides?: Partial<WebhookPayload>): WebhookPayload => ({
  triggerId: 'trig_test',
  success: true,
  steps: [{
    stepIndex: 0,
    toolName: 'github_create_issue',
    success: true,
    result: { issueNumber: 1 },
    duration: 150,
    executedAt: '2024-12-20T10:00:00Z',
  }],
  totalSteps: 1,
  totalDuration: 150,
  executedAt: '2024-12-20T10:00:00Z',
  ...overrides,
});

describe("Webhook Delivery", () => {
  let originalFetch: typeof fetch;
  let fetchCalls: Array<{ url: string; options: any }>;

  beforeEach(() => {
    originalFetch = global.fetch;
    fetchCalls = [];
    global.fetch = mock(async (url: string | URL | Request, options?: any) => {
      const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url.url;
      fetchCalls.push({ url: urlStr, options });
      return new Response('OK', { status: 200 });
    }) as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("signPayload", () => {
    test("produces a hex-encoded HMAC-SHA256 signature", async () => {
      const payload = makePayload();
      const signature = await signPayload(payload, 'test-secret');
      // Should be a hex string (64 chars for SHA-256)
      expect(signature).toMatch(/^[0-9a-f]{64}$/);
    });

    test("same payload and secret produce same signature", async () => {
      const payload = makePayload();
      const sig1 = await signPayload(payload, 'secret');
      const sig2 = await signPayload(payload, 'secret');
      expect(sig1).toBe(sig2);
    });

    test("different secrets produce different signatures", async () => {
      const payload = makePayload();
      const sig1 = await signPayload(payload, 'secret1');
      const sig2 = await signPayload(payload, 'secret2');
      expect(sig1).not.toBe(sig2);
    });
  });

  describe("deliverWebhook", () => {
    test("sends POST to webhook URL", async () => {
      const webhook: WebhookConfig = { url: 'https://example.com/hook' };
      const payload = makePayload();

      await deliverWebhook(webhook, payload, 5000);

      expect(fetchCalls).toHaveLength(1);
      expect(fetchCalls[0].url).toBe('https://example.com/hook');
      expect(fetchCalls[0].options.method).toBe('POST');
    });

    test("includes X-Webhook-Signature when secret is provided", async () => {
      const webhook: WebhookConfig = { url: 'https://example.com/hook', secret: 'my-secret' };
      const payload = makePayload();

      await deliverWebhook(webhook, payload, 5000);

      expect(fetchCalls).toHaveLength(1);
      const headers = fetchCalls[0].options.headers;
      expect(headers['X-Webhook-Signature']).toBeDefined();
      expect(headers['X-Webhook-Signature']).toMatch(/^[0-9a-f]{64}$/);
    });

    test("does NOT include X-Webhook-Signature when no secret", async () => {
      const webhook: WebhookConfig = { url: 'https://example.com/hook' };
      const payload = makePayload();

      await deliverWebhook(webhook, payload, 5000);

      const headers = fetchCalls[0].options.headers;
      expect(headers['X-Webhook-Signature']).toBeUndefined();
    });

    test("includes custom headers", async () => {
      const webhook: WebhookConfig = {
        url: 'https://example.com/hook',
        headers: { 'X-Custom': 'value', 'Authorization': 'Bearer token' },
      };
      const payload = makePayload();

      await deliverWebhook(webhook, payload, 5000);

      const headers = fetchCalls[0].options.headers;
      expect(headers['X-Custom']).toBe('value');
      expect(headers['Authorization']).toBe('Bearer token');
      expect(headers['Content-Type']).toBe('application/json');
    });

    test("sends JSON payload in body", async () => {
      const webhook: WebhookConfig = { url: 'https://example.com/hook' };
      const payload = makePayload();

      await deliverWebhook(webhook, payload, 5000);

      const body = JSON.parse(fetchCalls[0].options.body);
      expect(body.triggerId).toBe('trig_test');
      expect(body.success).toBe(true);
      expect(body.steps).toHaveLength(1);
    });
  });

  describe("deliverWebhooks", () => {
    test("sends to all webhooks in parallel", async () => {
      const webhooks: WebhookConfig[] = [
        { url: 'https://example.com/hook1' },
        { url: 'https://example.com/hook2' },
        { url: 'https://example.com/hook3' },
      ];
      const payload = makePayload();

      await deliverWebhooks(webhooks, payload, 5000);

      expect(fetchCalls).toHaveLength(3);
      const urls = fetchCalls.map(c => c.url);
      expect(urls).toContain('https://example.com/hook1');
      expect(urls).toContain('https://example.com/hook2');
      expect(urls).toContain('https://example.com/hook3');
    });

    test("empty array is a no-op", async () => {
      const payload = makePayload();

      await deliverWebhooks([], payload, 5000);

      expect(fetchCalls).toHaveLength(0);
    });

    test("failed delivery does not throw", async () => {
      global.fetch = mock(async () => {
        throw new Error('Network error');
      }) as any;

      const webhooks: WebhookConfig[] = [
        { url: 'https://example.com/hook1' },
      ];
      const payload = makePayload();

      // Should not throw
      await deliverWebhooks(webhooks, payload, 5000);
    });

    test("partial failures do not prevent other deliveries", async () => {
      let callIndex = 0;
      global.fetch = mock(async (url: string | URL | Request, options?: any) => {
        callIndex++;
        if (callIndex === 1) {
          throw new Error('First fails');
        }
        const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url.url;
        fetchCalls.push({ url: urlStr, options });
        return new Response('OK', { status: 200 });
      }) as any;

      const webhooks: WebhookConfig[] = [
        { url: 'https://example.com/fail' },
        { url: 'https://example.com/success' },
      ];
      const payload = makePayload();

      await deliverWebhooks(webhooks, payload, 5000);

      // Second webhook should still have been called
      expect(fetchCalls).toHaveLength(1);
      expect(fetchCalls[0].url).toBe('https://example.com/success');
    });
  });
});
