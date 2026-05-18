import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface OneloginIntegrationClient {
  listUsers(params: { "limit"?: number; "page"?: number; region: string }): Promise<MCPToolCallResponse>;
  getUser(params: { user_id: string; region: string }): Promise<MCPToolCallResponse>;
  createUser(params: { user_json: string; region: string }): Promise<MCPToolCallResponse>;
  listRoles(params: { region: string }): Promise<MCPToolCallResponse>;
  listApps(params: { "limit"?: number; "page"?: number; region: string }): Promise<MCPToolCallResponse>;
  listEvents(params: { "limit"?: number; "page"?: number; region: string }): Promise<MCPToolCallResponse>;
}
