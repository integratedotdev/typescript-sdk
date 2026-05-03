import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface AttioIntegrationClient {
  getSelf(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  queryPeople(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getPerson(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  createPerson(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  updatePerson(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  assertPerson(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  queryCompanies(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getCompany(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  createCompany(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  updateCompany(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  assertCompany(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
  listTasks(params?: Record<string, unknown>): Promise<MCPToolCallResponse>;
  getTask(params: Record<string, unknown>): Promise<MCPToolCallResponse>;
}
