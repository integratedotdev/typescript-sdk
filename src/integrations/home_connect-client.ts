import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface HomeConnectIntegrationClient {
  listAppliances(params: Record<string, never>): Promise<MCPToolCallResponse>;
  getAppliance(params: { ha_id: string }): Promise<MCPToolCallResponse>;
  getStatus(params: { ha_id: string }): Promise<MCPToolCallResponse>;
  getPrograms(params: { ha_id: string }): Promise<MCPToolCallResponse>;
  startProgram(params: { ha_id: string; program_json: string }): Promise<MCPToolCallResponse>;
  setSetting(params: { ha_id: string; setting_key: string; setting_json: string }): Promise<MCPToolCallResponse>;
}
