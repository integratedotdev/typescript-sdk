/**
 * Cursor Integration Client Types
 * Fully typed interface for Cursor integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Cursor Agent
 */
export interface CursorAgent {
  id: string;
  status: "running" | "completed" | "failed" | "stopped";
  created_at: string;
  updated_at: string;
  task?: string;
  model?: string;
  conversation_id?: string;
  metadata?: Record<string, any>;
}

/**
 * Cursor Conversation
 */
export interface CursorConversation {
  id: string;
  created_at: string;
  updated_at: string;
  messages: Array<{
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    created_at: string;
    metadata?: Record<string, any>;
  }>;
  agent_id?: string;
  metadata?: Record<string, any>;
}

/**
 * Cursor Model
 */
export interface CursorModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
  capabilities?: string[];
  context_window?: number;
  max_tokens?: number;
  pricing?: {
    prompt: number;
    completion: number;
  };
}

/**
 * Cursor Repository
 */
export interface CursorRepository {
  id: string;
  name: string;
  full_name: string;
  owner: string;
  url: string;
  description?: string;
  private: boolean;
  default_branch: string;
  created_at: string;
  updated_at: string;
  language?: string;
  stars?: number;
  forks?: number;
}

/**
 * Cursor API Key Info
 */
export interface CursorAPIKeyInfo {
  id: string;
  name?: string;
  created_at: string;
  last_used_at?: string;
  scopes?: string[];
  rate_limit?: {
    limit: number;
    remaining: number;
    reset_at: string;
  };
}

/**
 * Cursor Integration Client Interface
 * Provides type-safe methods for all Cursor operations
 */
export interface CursorIntegrationClient {
  /**
   * List all cloud agents
   * 
   * @example
   * ```typescript
   * const agents = await client.cursor.listAgents({
   *   status: "running",
   *   limit: 20
   * });
   * ```
   */
  listAgents(params?: {
    /** Filter by status */
    status?: "running" | "completed" | "failed" | "stopped";
    /** Maximum number of results */
    limit?: number;
    /** Pagination offset */
    offset?: number;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get agent status
   * 
   * @example
   * ```typescript
   * const agent = await client.cursor.getAgent({
   *   agent_id: "agent_123"
   * });
   * ```
   */
  getAgent(params: {
    /** Agent ID */
    agent_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get conversation history
   * 
   * @example
   * ```typescript
   * const conversation = await client.cursor.getConversation({
   *   conversation_id: "conv_123"
   * });
   * ```
   */
  getConversation(params: {
    /** Conversation ID */
    conversation_id: string;
    /** Include messages */
    include_messages?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * Launch a new agent
   * 
   * @example
   * ```typescript
   * const agent = await client.cursor.launchAgent({
   *   task: "Implement user authentication",
   *   model: "claude-sonnet-4",
   *   context: { repo: "my-app" }
   * });
   * ```
   */
  launchAgent(params: {
    /** Task description */
    task: string;
    /** Model to use */
    model?: string;
    /** Repository context */
    repository?: string;
    /** Additional context */
    context?: Record<string, any>;
    /** Conversation ID to continue */
    conversation_id?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Add follow-up instruction
   * 
   * @example
   * ```typescript
   * await client.cursor.followupAgent({
   *   agent_id: "agent_123",
   *   instruction: "Also add password reset functionality"
   * });
   * ```
   */
  followupAgent(params: {
    /** Agent ID */
    agent_id: string;
    /** Follow-up instruction */
    instruction: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Stop a running agent
   * 
   * @example
   * ```typescript
   * await client.cursor.stopAgent({
   *   agent_id: "agent_123"
   * });
   * ```
   */
  stopAgent(params: {
    /** Agent ID */
    agent_id: string;
    /** Reason for stopping */
    reason?: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Delete an agent
   * 
   * @example
   * ```typescript
   * await client.cursor.deleteAgent({
   *   agent_id: "agent_123"
   * });
   * ```
   */
  deleteAgent(params: {
    /** Agent ID */
    agent_id: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * Get API key info
   * 
   * @example
   * ```typescript
   * const info = await client.cursor.getMe();
   * ```
   */
  getMe(): Promise<MCPToolCallResponse>;

  /**
   * List available models
   * 
   * @example
   * ```typescript
   * const models = await client.cursor.listModels({
   *   provider: "anthropic"
   * });
   * ```
   */
  listModels(params?: {
    /** Filter by provider */
    provider?: string;
    /** Include capabilities */
    include_capabilities?: boolean;
  }): Promise<MCPToolCallResponse>;

  /**
   * List GitHub repositories
   * 
   * @example
   * ```typescript
   * const repos = await client.cursor.listRepositories({
   *   limit: 50,
   *   sort: "updated"
   * });
   * ```
   */
  listRepositories(params?: {
    /** Maximum number of results */
    limit?: number;
    /** Pagination offset */
    offset?: number;
    /** Sort by */
    sort?: "created" | "updated" | "name" | "stars";
    /** Sort order */
    order?: "asc" | "desc";
    /** Filter by visibility */
    visibility?: "public" | "private" | "all";
  }): Promise<MCPToolCallResponse>;
}
