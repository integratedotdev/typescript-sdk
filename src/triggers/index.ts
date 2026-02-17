/**
 * Triggers Module
 * Exports for scheduled tool execution functionality
 */

// Export all types
export type {
  Trigger,
  TriggerSchedule,
  TriggerStatus,
  CreateTriggerParams,
  CreateTriggerInput,
  UpdateTriggerParams,
  ListTriggersParams,
  ListTriggersResponse,
  ListTriggersCallbackResponse,
  TriggerExecutionResult,
  TriggerCallbacks,
  StepResult,
  CompleteRequest,
  CompleteResponse,
  WebhookConfig,
  WebhookPayload,
  CompleteCallbackContext,
} from './types.js';

// Export constants
export { MAX_TRIGGER_STEPS, WEBHOOK_DELIVERY_TIMEOUT_MS } from './types.js';

// Export utility functions
export {
  generateTriggerId,
  extractProviderFromToolName,
  validateStatusTransition,
  validateStepLimit,
  calculateHasMore,
} from './utils.js';
export type { StatusTransitionResult } from './utils.js';

// Export webhook delivery
export { deliverWebhooks } from './webhooks.js';

// Export client
export { TriggerClient } from './client.js';
export type { TriggerClientConfig } from './client.js';
