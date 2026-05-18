import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PhilipsHueIntegrationClient {
  listBridges(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listLights(params: Record<string, never>): Promise<MCPToolCallResponse>;
  getLight(params: { light_id: string }): Promise<MCPToolCallResponse>;
  updateLight(params: { light_id: string; light_json: string }): Promise<MCPToolCallResponse>;
  listRooms(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listScenes(params: Record<string, never>): Promise<MCPToolCallResponse>;
}
