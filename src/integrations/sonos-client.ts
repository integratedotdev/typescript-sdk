import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SonosIntegrationClient {
  listHouseholds(params: Record<string, never>): Promise<MCPToolCallResponse>;
  listGroups(params: { household_id: string }): Promise<MCPToolCallResponse>;
  getPlaybackStatus(params: { group_id: string }): Promise<MCPToolCallResponse>;
  controlPlayback(params: { group_id: string; command: string; command_json: string }): Promise<MCPToolCallResponse>;
  getGroupVolume(params: { group_id: string }): Promise<MCPToolCallResponse>;
  setGroupVolume(params: { group_id: string; volume_json: string }): Promise<MCPToolCallResponse>;
}
