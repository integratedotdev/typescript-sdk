import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface OktaIntegrationClient {
  listUsers(params?: { q?: string; filter?: string; search?: string; limit?: number; after?: string }): Promise<MCPToolCallResponse>;
  getUser(params: { user_id: string }): Promise<MCPToolCallResponse>;
  createUser(params: { activate?: boolean; user_json: string }): Promise<MCPToolCallResponse>;
  updateUser(params: { user_id: string; user_json: string }): Promise<MCPToolCallResponse>;
  deactivateUser(params: { user_id: string; sendEmail?: boolean }): Promise<MCPToolCallResponse>;
  listGroups(params?: { q?: string; filter?: string; search?: string; limit?: number; after?: string }): Promise<MCPToolCallResponse>;
  getGroup(params: { group_id: string }): Promise<MCPToolCallResponse>;
  createGroup(params: { group_json: string }): Promise<MCPToolCallResponse>;
  addUserToGroup(params: { group_id: string; user_id: string }): Promise<MCPToolCallResponse>;
  removeUserFromGroup(params: { group_id: string; user_id: string }): Promise<MCPToolCallResponse>;
  listApps(params?: { q?: string; filter?: string; limit?: number; after?: string }): Promise<MCPToolCallResponse>;
  getApp(params: { app_id: string }): Promise<MCPToolCallResponse>;
  listAuthorizationServers(params?: { q?: string; limit?: number; after?: string }): Promise<MCPToolCallResponse>;
  listPolicies(params?: { type?: string; status?: string; limit?: number; after?: string }): Promise<MCPToolCallResponse>;
  listSystemLogs(params?: { since?: string; until?: string; filter?: string; q?: string; limit?: number; after?: string }): Promise<MCPToolCallResponse>;
}

