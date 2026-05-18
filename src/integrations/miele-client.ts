import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface MieleIntegrationClient {
  listDevices(params: { "language"?: string }): Promise<MCPToolCallResponse>;
  getDevice(params: { device_id: string; "language"?: string }): Promise<MCPToolCallResponse>;
  getActions(params: { device_id: string; "language"?: string }): Promise<MCPToolCallResponse>;
  executeAction(params: { device_id: string; action_json: string }): Promise<MCPToolCallResponse>;
  getPrograms(params: { device_id: string; "language"?: string }): Promise<MCPToolCallResponse>;
}
