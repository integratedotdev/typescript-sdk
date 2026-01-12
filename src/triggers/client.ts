/**
 * Trigger Client
 * Client-side class for managing scheduled tool executions
 */

import type {
  Trigger,
  CreateTriggerParams,
  UpdateTriggerParams,
  ListTriggersParams,
  ListTriggersResponse,
  TriggerExecutionResult,
} from "./types.js";

/**
 * Configuration for TriggerClient
 */
export interface TriggerClientConfig {
  /** Base path for API routes (e.g., '/api/integrate') */
  apiRouteBase: string;
  /** Optional base URL for cross-origin requests */
  apiBaseUrl?: string;
  /** Function to get headers for authentication */
  getHeaders: () => Record<string, string>;
}

/**
 * Client for managing triggers via API routes
 * Provides type-safe methods for CRUD operations on scheduled tool executions
 * 
 * @example
 * ```typescript
 * const trigger = await client.trigger.create({
 *   toolName: 'gmail_send_email',
 *   toolArguments: { to: 'user@example.com', subject: 'Hello', body: 'World' },
 *   schedule: { type: 'once', runAt: new Date('2024-12-13T22:00:00Z') }
 * });
 * ```
 */
export class TriggerClient {
  constructor(private config: TriggerClientConfig) {}

  /**
   * Create a new trigger
   * Stores the trigger in your database and registers it with the scheduler
   * 
   * @param params - Trigger configuration
   * @returns Created trigger with generated ID
   * 
   * @example
   * ```typescript
   * const trigger = await client.trigger.create({
   *   name: 'Daily Report',
   *   toolName: 'gmail_send_email',
   *   toolArguments: { to: 'team@example.com', subject: 'Daily Report' },
   *   schedule: { type: 'cron', expression: '0 9 * * *' }
   * });
   * ```
   */
  async create(params: CreateTriggerParams): Promise<Trigger> {
    return this.request<Trigger>('POST', '/triggers', params);
  }

  /**
   * List triggers with optional filters
   * 
   * @param params - Optional filter and pagination parameters
   * @returns List of triggers matching filters
   * 
   * @example
   * ```typescript
   * const { triggers, total } = await client.trigger.list({
   *   status: 'active',
   *   limit: 10
   * });
   * ```
   */
  async list(params?: ListTriggersParams): Promise<ListTriggersResponse> {
    let path = '/triggers';
    
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.set('status', params.status);
      if (params.toolName) searchParams.set('toolName', params.toolName);
      if (params.limit !== undefined) searchParams.set('limit', params.limit.toString());
      if (params.offset !== undefined) searchParams.set('offset', params.offset.toString());
      
      const query = searchParams.toString();
      if (query) path += `?${query}`;
    }
    
    return this.request<ListTriggersResponse>('GET', path);
  }

  /**
   * Get a specific trigger by ID
   * 
   * @param triggerId - Trigger ID to retrieve
   * @returns Trigger details
   * 
   * @example
   * ```typescript
   * const trigger = await client.trigger.get('trig_abc123');
   * console.log(trigger.status); // 'active'
   * ```
   */
  async get(triggerId: string): Promise<Trigger> {
    return this.request<Trigger>('GET', `/triggers/${triggerId}`);
  }

  /**
   * Update an existing trigger
   * Can update name, description, toolArguments, and schedule
   * 
   * @param triggerId - Trigger ID to update
   * @param params - Partial trigger updates
   * @returns Updated trigger
   * 
   * @example
   * ```typescript
   * const updated = await client.trigger.update('trig_abc123', {
   *   schedule: { type: 'cron', expression: '0 10 * * *' }
   * });
   * ```
   */
  async update(triggerId: string, params: UpdateTriggerParams): Promise<Trigger> {
    return this.request<Trigger>('PATCH', `/triggers/${triggerId}`, params);
  }

  /**
   * Delete a trigger
   * Removes from database and unregisters from scheduler
   * 
   * @param triggerId - Trigger ID to delete
   * 
   * @example
   * ```typescript
   * await client.trigger.delete('trig_abc123');
   * ```
   */
  async delete(triggerId: string): Promise<void> {
    await this.request<void>('DELETE', `/triggers/${triggerId}`);
  }

  /**
   * Pause a trigger
   * Stops future executions without deleting the trigger
   * 
   * @param triggerId - Trigger ID to pause
   * @returns Updated trigger with status 'paused'
   * 
   * @example
   * ```typescript
   * const paused = await client.trigger.pause('trig_abc123');
   * console.log(paused.status); // 'paused'
   * ```
   */
  async pause(triggerId: string): Promise<Trigger> {
    return this.request<Trigger>('POST', `/triggers/${triggerId}/pause`);
  }

  /**
   * Resume a paused trigger
   * Resumes scheduled executions
   * 
   * @param triggerId - Trigger ID to resume
   * @returns Updated trigger with status 'active'
   * 
   * @example
   * ```typescript
   * const resumed = await client.trigger.resume('trig_abc123');
   * console.log(resumed.status); // 'active'
   * ```
   */
  async resume(triggerId: string): Promise<Trigger> {
    return this.request<Trigger>('POST', `/triggers/${triggerId}/resume`);
  }

  /**
   * Execute a trigger immediately
   * Runs the trigger now, bypassing the schedule
   * 
   * @param triggerId - Trigger ID to execute
   * @returns Execution result
   * 
   * @example
   * ```typescript
   * const result = await client.trigger.run('trig_abc123');
   * if (result.success) {
   *   console.log('Execution successful:', result.result);
   * }
   * ```
   */
  async run(triggerId: string): Promise<TriggerExecutionResult> {
    return this.request<TriggerExecutionResult>('POST', `/triggers/${triggerId}/run`);
  }

  /**
   * Internal method to make HTTP requests
   * @private
   */
  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    // Construct full URL
    const url = this.config.apiBaseUrl
      ? `${this.config.apiBaseUrl}${this.config.apiRouteBase}${path}`
      : `${this.config.apiRouteBase}${path}`;

    // Prepare request options
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.getHeaders(),
      },
    };

    // Add body for POST/PATCH/PUT requests
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    // Make request
    const response = await fetch(url, options);

    // Handle errors
    if (!response.ok) {
      let errorMessage = `Request failed: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = typeof errorData.error === 'string' 
            ? errorData.error 
            : errorData.error.message || errorMessage;
        }
      } catch {
        // If JSON parsing fails, use default error message
      }

      throw new Error(errorMessage);
    }

    // For DELETE requests with no content, return undefined
    if (method === 'DELETE' && response.status === 204) {
      return undefined as T;
    }

    // Parse and return response
    return response.json();
  }
}
