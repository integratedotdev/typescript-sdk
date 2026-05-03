/**
 * Postman Integration Client Types
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PostmanIntegrationClient {
  getMe(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listWorkspaces(params?: { type?: string; created_by?: string }): Promise<MCPToolCallResponse>;
  getWorkspace(params: { workspace_id: string }): Promise<MCPToolCallResponse>;
  listCollections(params?: { workspace?: string }): Promise<MCPToolCallResponse>;
  getCollection(params: { collection_uid: string }): Promise<MCPToolCallResponse>;
  deleteCollection(params: { collection_uid: string }): Promise<MCPToolCallResponse>;
  listEnvironments(params?: { workspace?: string }): Promise<MCPToolCallResponse>;
  getEnvironment(params: { environment_uid: string }): Promise<MCPToolCallResponse>;
  createCollection(params: { workspace: string; collection: string }): Promise<MCPToolCallResponse>;
}
