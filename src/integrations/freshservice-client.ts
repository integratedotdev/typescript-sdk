import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface FreshserviceIntegrationClient {
  listTickets(params: { page?: number; per_page?: number; domain: string }): Promise<MCPToolCallResponse>;
  listRequesters(params: { page?: number; per_page?: number; domain: string }): Promise<MCPToolCallResponse>;
  listAgents(params: { page?: number; per_page?: number; domain: string }): Promise<MCPToolCallResponse>;
  listAssets(params: { page?: number; per_page?: number; domain: string }): Promise<MCPToolCallResponse>;
  listChanges(params: { page?: number; per_page?: number; domain: string }): Promise<MCPToolCallResponse>;
  listProblems(params: { page?: number; per_page?: number; domain: string }): Promise<MCPToolCallResponse>;
  listReleases(params: { page?: number; per_page?: number; domain: string }): Promise<MCPToolCallResponse>;
  createTicket(params: { ticket_json: string; domain: string }): Promise<MCPToolCallResponse>;
  listSolutions(params: { page?: number; per_page?: number; domain: string }): Promise<MCPToolCallResponse>;
}
