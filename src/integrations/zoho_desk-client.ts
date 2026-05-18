import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ZohoDeskIntegrationClient {
  listTickets(params: { from?: number; limit?: number; departmentId?: string }): Promise<MCPToolCallResponse>;
  getTicket(params: { ticket_id: string }): Promise<MCPToolCallResponse>;
  createTicket(params: { ticket_json: string }): Promise<MCPToolCallResponse>;
  listContacts(params: { from?: number; limit?: number }): Promise<MCPToolCallResponse>;
  listAccounts(params: { from?: number; limit?: number }): Promise<MCPToolCallResponse>;
  listAgents(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listDepartments(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  searchArticles(params: { searchStr?: string; departmentId?: string; from?: number; limit?: number }): Promise<MCPToolCallResponse>;
}
