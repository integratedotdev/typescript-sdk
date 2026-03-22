/**
 * Trigger Types
 * Type definitions for scheduled tool executions
 */

import type { MCPContext } from "../config/types.js";

/**
 * Trigger schedule configuration
 * Supports one-time and recurring (cron) schedules
 */
export type TriggerSchedule = 
  | { type: 'once'; runAt: string | Date }      // ISO datetime string or Date object
  | { type: 'cron'; expression: string };       // Standard cron expression

/**
 * Trigger execution status
 */
export type TriggerStatus = 'active' | 'paused' | 'completed' | 'failed';

/**
 * Trigger definition
 * Represents a scheduled tool execution
 */
export interface Trigger {
  /** Unique trigger identifier */
  id: string;
  /** Optional human-readable name */
  name?: string;
  /** Optional description */
  description?: string;
  
  // Execution configuration
  /** MCP tool name to execute (e.g., "gmail_send_email") */
  toolName: string;
  /** Arguments to pass to the tool */
  toolArguments: Record<string, unknown>;
  
  // Schedule configuration
  /** When to execute the trigger */
  schedule: TriggerSchedule;
  
  // Status and metadata
  /** Current status of the trigger */
  status: TriggerStatus;
  /** ISO datetime when trigger was created */
  createdAt: string;
  /** ISO datetime when trigger was last updated */
  updatedAt: string;
  /** ISO datetime of last execution */
  lastRunAt?: string;
  /** ISO datetime of next scheduled execution */
  nextRunAt?: string;
  /** Number of times this trigger has been executed */
  runCount?: number;
  /** Last error message if execution failed */
  lastError?: string;
  /** Last execution result if successful */
  lastResult?: Record<string, unknown>;
  
  // Context for multi-tenant support
  /** User identifier for multi-tenant apps */
  userId?: string;
  /** OAuth provider inferred from toolName prefix */
  provider?: string;
}

/**
 * Input parameters for creating a new trigger (from client)
 * This is what the SDK receives from the client before pre-processing
 */
export interface CreateTriggerInput {
  /** Optional human-readable name */
  name?: string;
  /** Optional description */
  description?: string;
  /** MCP tool name to execute */
  toolName: string;
  /** Arguments to pass to the tool */
  toolArguments: Record<string, unknown>;
  /** When to execute the trigger */
  schedule: TriggerSchedule;
  /** Optional status override (defaults to 'active' if not provided) */
  status?: TriggerStatus;
}

/**
 * Parameters for creating a new trigger
 * @deprecated Use CreateTriggerInput instead
 */
export interface CreateTriggerParams {
  /** Optional human-readable name */
  name?: string;
  /** Optional description */
  description?: string;
  /** MCP tool name to execute */
  toolName: string;
  /** Arguments to pass to the tool */
  toolArguments: Record<string, unknown>;
  /** When to execute the trigger */
  schedule: TriggerSchedule;
}

/**
 * Parameters for updating an existing trigger
 */
export interface UpdateTriggerParams {
  /** Update trigger name */
  name?: string;
  /** Update trigger description */
  description?: string;
  /** Update tool arguments */
  toolArguments?: Record<string, unknown>;
  /** Update schedule */
  schedule?: TriggerSchedule;
}

/**
 * Parameters for listing triggers
 */
export interface ListTriggersParams {
  /** Filter by status */
  status?: TriggerStatus;
  /** Filter by tool name */
  toolName?: string;
  /** Maximum number of results */
  limit?: number;
  /** Number of results to skip (pagination) */
  offset?: number;
}

/**
 * Response from listing triggers
 * This is what the SDK returns to the client (includes hasMore calculated by SDK)
 */
export interface ListTriggersResponse {
  /** Array of triggers */
  triggers: Trigger[];
  /** Total number of triggers matching filters */
  total: number;
  /** Whether more results are available */
  hasMore: boolean;
}

/**
 * Response from list callback (what database returns)
 * SDK calculates hasMore from this data
 */
export interface ListTriggersCallbackResponse {
  /** Array of triggers */
  triggers: Trigger[];
  /** Total number of triggers matching filters */
  total: number;
}

/**
 * Result from executing a trigger
 */
export interface TriggerExecutionResult {
  /** Whether execution succeeded */
  success: boolean;
  /** Tool execution result if successful */
  result?: Record<string, unknown>;
  /** Error message if execution failed */
  error?: string;
  /** ISO datetime when execution completed */
  executedAt: string;
  /** Execution duration in milliseconds */
  duration?: number;
}

// Multi-step trigger constants

/** Maximum number of steps allowed in a multi-step trigger execution */
export const MAX_TRIGGER_STEPS = 20;

/** Default timeout for webhook delivery in milliseconds */
export const WEBHOOK_DELIVERY_TIMEOUT_MS = 10_000;

/**
 * Result from a single step in a multi-step trigger execution
 */
export interface StepResult {
  /** Zero-based index of this step */
  stepIndex: number;
  /** Tool that was executed */
  toolName: string;
  /** Whether this step succeeded */
  success: boolean;
  /** Step result data if successful */
  result?: Record<string, unknown>;
  /** Error message if step failed */
  error?: string;
  /** Execution duration in milliseconds */
  duration: number;
  /** ISO datetime when this step was executed */
  executedAt: string;
}

/**
 * Enhanced request body for the complete endpoint
 * Backward-compatible: existing fields preserved, new fields optional
 */
export interface CompleteRequest {
  /** Whether execution succeeded */
  success: boolean;
  /** Tool execution result if successful */
  result?: Record<string, unknown>;
  /** Error message if execution failed */
  error?: string;
  /** ISO datetime when execution completed */
  executedAt: string;
  /** Execution duration in milliseconds */
  duration?: number;
  /** Current step index (zero-based) for multi-step triggers */
  stepIndex?: number;
  /** Results from all previous steps (includes current step) */
  previousResults?: StepResult[];
  /** Whether this is the final step */
  final?: boolean;
}

/**
 * Response from the complete endpoint for multi-step triggers
 */
export interface CompleteResponse {
  /** Whether there are more steps to execute */
  hasMore?: boolean;
  /** Next step to execute if hasMore is true */
  nextStep?: {
    toolName: string;
    toolArguments: Record<string, unknown>;
    provider: string;
  };
  /** Webhooks to deliver results to after all steps complete */
  webhooks?: WebhookConfig[];
}

/**
 * Webhook endpoint configuration
 */
export interface WebhookConfig {
  /** URL to deliver the webhook payload to */
  url: string;
  /** Secret for HMAC-SHA256 signature (optional) */
  secret?: string;
  /** Additional headers to include in the request */
  headers?: Record<string, string>;
}

/**
 * Payload delivered to webhook endpoints
 */
export interface WebhookPayload {
  /** Trigger ID that was executed */
  triggerId: string;
  /** Whether the overall execution succeeded */
  success: boolean;
  /** Results from all steps */
  steps: StepResult[];
  /** Total number of steps executed */
  totalSteps: number;
  /** Total execution duration in milliseconds */
  totalDuration: number;
  /** ISO datetime when execution completed */
  executedAt: string;
}

/**
 * Context passed to the onComplete callback
 */
export interface CompleteCallbackContext {
  /** The trigger being completed */
  trigger: Trigger;
  /** The complete request body */
  request: CompleteRequest;
  /** Optional MCP context for multi-tenant support */
  context?: MCPContext;
}

/**
 * Callbacks for trigger storage (required for createMCPServer)
 * Implement these to store triggers in your database
 */
export interface TriggerCallbacks {
  /**
   * Store a new trigger in your database
   * @param trigger - Trigger to create (includes generated ID)
   * @param context - Optional user context for multi-tenant support
   * @returns Created trigger with all fields populated
   */
  create: (trigger: Trigger, context?: MCPContext) => Promise<Trigger>;
  
  /**
   * Get a trigger by ID
   * @param triggerId - Trigger ID to retrieve
   * @param context - Optional user context for multi-tenant support
   * @returns Trigger if found, null otherwise
   */
  get: (triggerId: string, context?: MCPContext) => Promise<Trigger | null>;
  
  /**
   * List triggers with optional filters
   * @param params - Filter and pagination parameters
   * @param context - Optional user context for multi-tenant support
   * @returns List of triggers matching filters (SDK calculates hasMore)
   */
  list: (params: ListTriggersParams, context?: MCPContext) => Promise<ListTriggersCallbackResponse>;
  
  /**
   * Update a trigger
   * @param triggerId - Trigger ID to update
   * @param updates - Partial trigger updates
   * @param context - Optional user context for multi-tenant support
   * @returns Updated trigger
   */
  update: (triggerId: string, updates: Partial<Trigger>, context?: MCPContext) => Promise<Trigger>;
  
  /**
   * Delete a trigger
   * @param triggerId - Trigger ID to delete
   * @param context - Optional user context for multi-tenant support
   */
  delete: (triggerId: string, context?: MCPContext) => Promise<void>;

  /**
   * Optional callback for multi-step trigger completion
   * Called after each step completes during local trigger execution.
   * Return a CompleteResponse to control whether more steps should execute
   * and which webhooks to fire.
   * @param context - Trigger, request body, and optional MCP context
   * @returns CompleteResponse indicating next step or final state
   */
  onComplete?: (context: CompleteCallbackContext) => Promise<CompleteResponse>;

  /**
   * Optional callback to resolve the callback URL for scheduler registration.
   * When provided, this is used instead of the default INTEGRATE_URL-based URL.
   * Useful when the app URL varies per tenant or environment.
   * @param context - Optional MCP context for multi-tenant support
   * @returns The base URL for trigger notification callbacks
   */
  getCallbackUrl?: (context?: MCPContext) => Promise<string> | string;
}
