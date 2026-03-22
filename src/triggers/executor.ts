/**
 * Trigger Executor
 * Handles local trigger execution (single and multi-step) without sending tokens externally.
 * The scheduler sends a notification; the user's app retrieves the trigger,
 * gets the token locally, and executes the tool directly.
 */

import { createLogger } from '../utils/logger.js';
import { validateStepLimit } from './utils.js';
import { deliverWebhooks } from './webhooks.js';
import {
  MAX_TRIGGER_STEPS,
  WEBHOOK_DELIVERY_TIMEOUT_MS,
} from './types.js';
import type {
  Trigger,
  TriggerCallbacks,
  StepResult,
  CompleteRequest,
  WebhookPayload,
} from './types.js';
import type { MCPContext } from '../config/types.js';

const logger = createLogger('TriggerExecutor', 'server');

/**
 * Configuration for the trigger executor
 */
export interface ExecuteTriggerConfig {
  /** Trigger callbacks for DB operations */
  triggers: TriggerCallbacks;
  /** Retrieve provider OAuth token locally */
  getProviderToken: (provider: string, email?: string, context?: MCPContext) => Promise<{ accessToken: string; tokenType?: string } | undefined>;
  /** Execute a tool call via the OAuthHandler */
  handleToolCall: (
    body: { name: string; arguments: Record<string, unknown> },
    authHeader: string | null,
    integrationsHeader: string | null,
  ) => Promise<any>;
}

/**
 * Result from executeTrigger
 */
export interface ExecuteTriggerResult {
  success: boolean;
  steps: StepResult[];
  error?: string;
}

/**
 * Execute a trigger locally, including multi-step execution.
 *
 * Flow:
 * 1. Execute initial tool call
 * 2. If onComplete callback exists, call it with result
 * 3. If onComplete returns hasMore + nextStep, get token for next step's provider, execute, repeat
 * 4. Respect MAX_TRIGGER_STEPS limit
 * 5. On final step: update trigger DB state, fire webhooks
 *
 * @param trigger - The trigger to execute
 * @param config - Executor configuration (DB callbacks, token retrieval, tool execution)
 * @param context - Optional MCP context for multi-tenant support
 * @returns Execution result with all step results
 */
export async function executeTrigger(
  trigger: Trigger,
  config: ExecuteTriggerConfig,
  context?: MCPContext,
): Promise<ExecuteTriggerResult> {
  const steps: StepResult[] = [];
  let currentToolName = trigger.toolName;
  let currentToolArguments = trigger.toolArguments;
  let currentProvider = trigger.provider!;
  let stepIndex = 0;

  while (stepIndex < MAX_TRIGGER_STEPS) {
    // Validate step limit
    const stepValidation = validateStepLimit(stepIndex, MAX_TRIGGER_STEPS);
    if (!stepValidation.valid) {
      logger.error(`[Trigger ${trigger.id}] ${stepValidation.error}`);
      break;
    }

    // Get OAuth token for the current provider
    const providerToken = await config.getProviderToken(currentProvider, undefined, context);
    if (!providerToken) {
      const error = `No OAuth token available for provider '${currentProvider}'`;
      logger.error(`[Trigger ${trigger.id}] ${error}`);

      steps.push({
        stepIndex,
        toolName: currentToolName,
        success: false,
        error,
        duration: 0,
        executedAt: new Date().toISOString(),
      });

      // Update trigger as failed
      await config.triggers.update(
        trigger.id,
        {
          lastRunAt: new Date().toISOString(),
          runCount: (trigger.runCount || 0) + 1,
          lastError: error,
          status: 'failed',
        },
        context,
      );

      return { success: false, steps, error };
    }

    // Execute the tool
    const startTime = Date.now();
    let toolResult: any;
    let stepSuccess = true;
    let stepError: string | undefined;

    try {
      toolResult = await config.handleToolCall(
        { name: currentToolName, arguments: currentToolArguments },
        `${providerToken.tokenType || 'Bearer'} ${providerToken.accessToken}`,
        null,
      );
    } catch (err: any) {
      stepSuccess = false;
      stepError = err.message || 'Tool execution failed';
      logger.error(`[Trigger ${trigger.id}] Step ${stepIndex} failed:`, err);
    }

    // Treat MCP-level error responses as failures even when no exception was thrown
    if (stepSuccess && toolResult) {
      if (toolResult.isError === true) {
        stepSuccess = false;
        const errText = toolResult.content?.find((c: any) => c.type === 'text')?.text;
        stepError = errText || 'Tool returned an error response';
      } else if (toolResult.structuredContent?.success === false) {
        stepSuccess = false;
        stepError = toolResult.structuredContent?.error as string | undefined || 'Tool returned success: false';
      }
    }

    const duration = Date.now() - startTime;
    const executedAt = new Date().toISOString();

    steps.push({
      stepIndex,
      toolName: currentToolName,
      success: stepSuccess,
      result: stepSuccess ? toolResult : undefined,
      error: stepError,
      duration,
      executedAt,
    });

    // If there's no onComplete callback or step failed, this is a single-step execution
    if (!config.triggers.onComplete || !stepSuccess) {
      const updates: Partial<Trigger> = {
        lastRunAt: executedAt,
        runCount: (trigger.runCount || 0) + 1,
      };

      if (stepSuccess) {
        updates.lastResult = toolResult as Record<string, unknown>;
        updates.lastError = undefined;
        if (trigger.schedule.type === 'once') {
          updates.status = 'completed';
        }
      } else {
        updates.lastError = stepError;
        updates.status = 'failed';
      }

      await config.triggers.update(trigger.id, updates, context);
      return { success: steps.every((s) => s.success), steps, error: stepError };
    }

    // Build CompleteRequest for the onComplete callback
    const completeRequest: CompleteRequest = {
      success: stepSuccess,
      result: stepSuccess ? toolResult : undefined,
      error: stepError,
      executedAt,
      duration,
      stepIndex,
      previousResults: steps,
      final: false,
    };

    // Call onComplete to determine next step
    const completeResponse = await config.triggers.onComplete({
      trigger,
      request: completeRequest,
      context,
    });

    // If there are more steps, continue the loop
    if (completeResponse.hasMore && completeResponse.nextStep) {
      currentToolName = completeResponse.nextStep.toolName;
      currentToolArguments = completeResponse.nextStep.toolArguments;
      currentProvider = completeResponse.nextStep.provider;
      stepIndex++;
      continue;
    }

    // Final step: update trigger state
    const finalUpdates: Partial<Trigger> = {
      lastRunAt: executedAt,
      runCount: (trigger.runCount || 0) + 1,
    };

    if (stepSuccess) {
      finalUpdates.lastResult = toolResult as Record<string, unknown>;
      finalUpdates.lastError = undefined;
      if (trigger.schedule.type === 'once') {
        finalUpdates.status = 'completed';
      }
    } else {
      finalUpdates.lastError = stepError;
      finalUpdates.status = 'failed';
    }

    await config.triggers.update(trigger.id, finalUpdates, context);

    // Fire webhooks if configured (fire-and-forget)
    if (completeResponse.webhooks && completeResponse.webhooks.length > 0) {
      const totalDuration = steps.reduce((sum, s) => sum + (s.duration || 0), 0);
      const payload: WebhookPayload = {
        triggerId: trigger.id,
        success: steps.every((s) => s.success),
        steps,
        totalSteps: steps.length,
        totalDuration,
        executedAt,
      };
      deliverWebhooks(completeResponse.webhooks, payload, WEBHOOK_DELIVERY_TIMEOUT_MS).catch(() => {});
    }

    return { success: steps.every((s) => s.success), steps, error: stepError };
  }

  // Reached MAX_TRIGGER_STEPS limit
  const limitError = `Trigger execution exceeded maximum of ${MAX_TRIGGER_STEPS} steps`;
  logger.error(`[Trigger ${trigger.id}] ${limitError}`);

  await config.triggers.update(
    trigger.id,
    {
      lastRunAt: new Date().toISOString(),
      runCount: (trigger.runCount || 0) + 1,
      lastError: limitError,
      status: 'failed',
    },
    context,
  );

  return { success: false, steps, error: limitError };
}
