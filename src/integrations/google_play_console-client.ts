import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface GooglePlayConsoleIntegrationClient {
  insertEdit(params: {
    "package_name": string;
    "edit_json": string;
  }): Promise<MCPToolCallResponse>;
  getEdit(params: {
    "package_name": string;
    "edit_id": string;
  }): Promise<MCPToolCallResponse>;
  listTracks(params: {
    "package_name": string;
    "edit_id": string;
  }): Promise<MCPToolCallResponse>;
  updateTrack(params: {
    "package_name": string;
    "edit_id": string;
    "track": string;
    "track_json": string;
  }): Promise<MCPToolCallResponse>;
  commitEdit(params: {
    "package_name": string;
    "edit_id": string;
    "commit_json": string;
  }): Promise<MCPToolCallResponse>;
  listInAppProducts(params: {
    "package_name": string;
  }): Promise<MCPToolCallResponse>;
}
