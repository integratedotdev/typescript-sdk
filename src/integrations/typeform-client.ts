import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface TypeformIntegrationClient {
  getMe(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listWorkspaces(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getWorkspace(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listForms(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getForm(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  createForm(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  updateForm(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  deleteForm(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listResponses(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
