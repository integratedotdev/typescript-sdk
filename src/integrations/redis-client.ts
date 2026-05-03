/**
 * Redis Cloud Integration Client Types
 * Fully typed interface for Redis Cloud REST API tools (managed control plane, not Redis wire protocol).
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface RedisIntegrationClient {
  listSubscriptions(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getSubscription(params: { subscription_id: string }): Promise<MCPToolCallResponse>;
  listFixedSubscriptions(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getFixedSubscription(params: { subscription_id: string }): Promise<MCPToolCallResponse>;
  listDatabases(params: { subscription_id: string }): Promise<MCPToolCallResponse>;
  getDatabase(params: { subscription_id: string; database_id: string }): Promise<MCPToolCallResponse>;
  createDatabase(params: {
    subscription_id: string;
    name: string;
    dataset_size_gb?: number;
    protocol?: string;
    extra_json?: string;
  }): Promise<MCPToolCallResponse>;
  updateDatabase(params: {
    subscription_id: string;
    database_id: string;
    extra_json: string;
  }): Promise<MCPToolCallResponse>;
  deleteDatabase(params: { subscription_id: string; database_id: string }): Promise<MCPToolCallResponse>;
  listEssentialsDatabases(params: { subscription_id: string }): Promise<MCPToolCallResponse>;
  getEssentialsDatabase(params: { subscription_id: string; database_id: string }): Promise<MCPToolCallResponse>;
  createEssentialsDatabase(params: {
    subscription_id: string;
    name: string;
    extra_json?: string;
  }): Promise<MCPToolCallResponse>;
  updateEssentialsDatabase(params: {
    subscription_id: string;
    database_id: string;
    extra_json: string;
  }): Promise<MCPToolCallResponse>;
  deleteEssentialsDatabase(params: { subscription_id: string; database_id: string }): Promise<MCPToolCallResponse>;
  getTask(params: { task_id: string }): Promise<MCPToolCallResponse>;
  listLogs(params?: { limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
}
