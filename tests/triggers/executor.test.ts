/**
 * Trigger Executor Tests
 */

import { describe, test, expect, mock } from "bun:test";
import { executeTrigger } from "../../src/triggers/executor.js";
import type { Trigger, TriggerCallbacks } from "../../src/triggers/types.js";
import type { ExecuteTriggerConfig } from "../../src/triggers/executor.js";

function makeTrigger(overrides?: Partial<Trigger>): Trigger {
  return {
    id: 'trig_test123',
    toolName: 'github_create_issue',
    toolArguments: { title: 'Test Issue', body: 'Test body' },
    schedule: { type: 'once', runAt: '2025-01-01T00:00:00Z' },
    status: 'active',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    provider: 'github',
    userId: 'user_123',
    runCount: 0,
    ...overrides,
  };
}

function makeCallbacks(overrides?: Partial<TriggerCallbacks>): TriggerCallbacks {
  return {
    create: mock(async (trigger) => trigger),
    get: mock(async () => null),
    list: mock(async () => ({ triggers: [], total: 0 })),
    update: mock(async (id, updates) => ({ ...makeTrigger(), ...updates })),
    delete: mock(async () => {}),
    ...overrides,
  };
}

function makeConfig(overrides?: Partial<ExecuteTriggerConfig>): ExecuteTriggerConfig {
  return {
    triggers: makeCallbacks(),
    getProviderToken: mock(async () => ({ accessToken: 'test-token', tokenType: 'Bearer' })),
    handleToolCall: mock(async () => ({ issueNumber: 42 })),
    ...overrides,
  };
}

describe("executeTrigger", () => {
  test("executes a single-step trigger successfully", async () => {
    const trigger = makeTrigger();
    const config = makeConfig();

    const result = await executeTrigger(trigger, config, { userId: 'user_123' });

    expect(result.success).toBe(true);
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].toolName).toBe('github_create_issue');
    expect(result.steps[0].success).toBe(true);
    expect(result.steps[0].result).toEqual({ issueNumber: 42 });
    expect(result.steps[0].stepIndex).toBe(0);

    // Should have called update to persist result
    expect(config.triggers.update).toHaveBeenCalledTimes(1);
  });

  test("marks one-time trigger as completed after success", async () => {
    const trigger = makeTrigger({ schedule: { type: 'once', runAt: '2025-01-01T00:00:00Z' } });
    const config = makeConfig();

    await executeTrigger(trigger, config);

    const updateCall = (config.triggers.update as any).mock.calls[0];
    expect(updateCall[1].status).toBe('completed');
  });

  test("does NOT mark cron trigger as completed after success", async () => {
    const trigger = makeTrigger({ schedule: { type: 'cron', expression: '0 * * * *' } });
    const config = makeConfig();

    await executeTrigger(trigger, config);

    const updateCall = (config.triggers.update as any).mock.calls[0];
    expect(updateCall[1].status).toBeUndefined();
  });

  test("handles missing provider token", async () => {
    const trigger = makeTrigger();
    const config = makeConfig({
      getProviderToken: mock(async () => undefined),
    });

    const result = await executeTrigger(trigger, config);

    expect(result.success).toBe(false);
    expect(result.error).toContain("No OAuth token available");
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].success).toBe(false);

    // Should update trigger as failed
    const updateCall = (config.triggers.update as any).mock.calls[0];
    expect(updateCall[1].status).toBe('failed');
  });

  test("handles tool execution failure", async () => {
    const trigger = makeTrigger();
    const config = makeConfig({
      handleToolCall: mock(async () => { throw new Error('API rate limited'); }),
    });

    const result = await executeTrigger(trigger, config);

    expect(result.success).toBe(false);
    expect(result.error).toBe('API rate limited');
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0].success).toBe(false);
    expect(result.steps[0].error).toBe('API rate limited');

    const updateCall = (config.triggers.update as any).mock.calls[0];
    expect(updateCall[1].status).toBe('failed');
    expect(updateCall[1].lastError).toBe('API rate limited');
  });

  test("executes multi-step trigger via onComplete", async () => {
    const trigger = makeTrigger();
    let stepCount = 0;

    const callbacks = makeCallbacks({
      onComplete: mock(async ({ request }) => {
        if (request.stepIndex === 0) {
          return {
            hasMore: true,
            nextStep: {
              toolName: 'slack_send_message',
              toolArguments: { channel: '#general', text: 'Issue created' },
              provider: 'slack',
            },
          };
        }
        return { hasMore: false, webhooks: [] };
      }),
    });

    const config = makeConfig({
      triggers: callbacks,
      handleToolCall: mock(async (body) => {
        stepCount++;
        if (body.name === 'github_create_issue') return { issueNumber: 42 };
        if (body.name === 'slack_send_message') return { messageId: 'msg_1' };
        return {};
      }),
    });

    const result = await executeTrigger(trigger, config);

    expect(result.success).toBe(true);
    expect(result.steps).toHaveLength(2);
    expect(result.steps[0].toolName).toBe('github_create_issue');
    expect(result.steps[1].toolName).toBe('slack_send_message');
    expect(stepCount).toBe(2);

    // getProviderToken should be called for each step's provider
    expect(config.getProviderToken).toHaveBeenCalledTimes(2);
  });

  test("fires webhooks on final step", async () => {
    const trigger = makeTrigger();
    let fetchCalled = false;
    const originalFetch = global.fetch;
    global.fetch = mock(async () => {
      fetchCalled = true;
      return new Response('OK', { status: 200 });
    }) as any;

    try {
      const callbacks = makeCallbacks({
        onComplete: mock(async () => ({
          hasMore: false,
          webhooks: [{ url: 'https://example.com/webhook' }],
        })),
      });

      const config = makeConfig({ triggers: callbacks });
      await executeTrigger(trigger, config);

      // Give fire-and-forget time to complete
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(fetchCalled).toBe(true);
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("respects MAX_TRIGGER_STEPS limit", async () => {
    const trigger = makeTrigger();

    const callbacks = makeCallbacks({
      onComplete: mock(async () => ({
        hasMore: true,
        nextStep: {
          toolName: 'github_create_issue',
          toolArguments: { title: 'Loop' },
          provider: 'github',
        },
      })),
    });

    const config = makeConfig({ triggers: callbacks });
    const result = await executeTrigger(trigger, config);

    expect(result.success).toBe(false);
    expect(result.error).toContain('maximum of 20 steps');
    expect(result.steps).toHaveLength(20);
  });

  test("passes correct context from trigger userId", async () => {
    const trigger = makeTrigger({ userId: 'user_456' });
    const config = makeConfig();
    const ctx = { userId: 'user_456' };

    await executeTrigger(trigger, config, ctx);

    // getProviderToken should receive the context
    const tokenCall = (config.getProviderToken as any).mock.calls[0];
    expect(tokenCall[2]).toEqual({ userId: 'user_456' });
  });
});
