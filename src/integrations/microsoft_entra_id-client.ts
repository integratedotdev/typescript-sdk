import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MicrosoftEntraIdIntegrationClient {
  listUsers(params: { "$top"?: number; "$skiptoken"?: string }): Promise<MCPToolCallResponse>;
  getUser(params: { user_id: string }): Promise<MCPToolCallResponse>;
  createUser(params: { user_json: string }): Promise<MCPToolCallResponse>;
  listGroups(params: { "$top"?: number; "$skiptoken"?: string }): Promise<MCPToolCallResponse>;
  listApplications(params: { "$top"?: number; "$skiptoken"?: string }): Promise<MCPToolCallResponse>;
  listAuditLogs(params: { "$top"?: number; "$filter"?: string }): Promise<MCPToolCallResponse>;
}
