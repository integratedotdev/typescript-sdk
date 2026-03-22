/**
 * Webhook Delivery
 * HMAC-SHA256 signed webhook delivery for multi-step trigger results
 */

import { createLogger } from '../utils/logger.js';
import type { WebhookConfig, WebhookPayload } from './types.js';

const logger = createLogger('Webhooks', 'server');

/**
 * Sign a payload with HMAC-SHA256 using the Web Crypto API
 * @param payload - The webhook payload to sign
 * @param secret - The secret key for HMAC signing
 * @returns Hex-encoded HMAC-SHA256 signature
 */
export async function signPayload(payload: WebhookPayload, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, data);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Deliver a webhook payload to a single endpoint
 * @param webhook - Webhook configuration (url, secret, headers)
 * @param payload - The webhook payload to deliver
 * @param timeoutMs - Request timeout in milliseconds
 */
export async function deliverWebhook(
  webhook: WebhookConfig,
  payload: WebhookPayload,
  timeoutMs: number,
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...webhook.headers,
  };

  if (webhook.secret) {
    headers['X-Webhook-Signature'] = await signPayload(payload, webhook.secret);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      logger.warn(`Webhook delivery to ${webhook.url} returned ${response.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Deliver a webhook payload to multiple endpoints in parallel (fire-and-forget)
 * Errors are logged but never thrown — delivery failures do not affect trigger completion.
 * @param webhooks - Array of webhook configurations
 * @param payload - The webhook payload to deliver
 * @param timeoutMs - Request timeout in milliseconds per webhook
 */
export async function deliverWebhooks(
  webhooks: WebhookConfig[],
  payload: WebhookPayload,
  timeoutMs: number,
): Promise<void> {
  if (webhooks.length === 0) return;

  const results = await Promise.allSettled(
    webhooks.map((webhook) => deliverWebhook(webhook, payload, timeoutMs)),
  );

  for (let i = 0; i < results.length; i++) {
    const result = results[i]!;
    if (result.status === 'rejected') {
      logger.warn(`Webhook delivery to ${webhooks[i]!.url} failed:`, (result as PromiseRejectedResult).reason);
    }
  }
}
