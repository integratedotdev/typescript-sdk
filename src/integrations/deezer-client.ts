import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface DeezerIntegrationClient {
  getUser(params: Record<string, never>): Promise<MCPToolCallResponse>;
  search(params: { "q"?: string; "index"?: string; "limit"?: number }): Promise<MCPToolCallResponse>;
  getAlbum(params: { album_id: string }): Promise<MCPToolCallResponse>;
  getTrack(params: { track_id: string }): Promise<MCPToolCallResponse>;
  listPlaylists(params: { "index"?: string; "limit"?: number }): Promise<MCPToolCallResponse>;
  addTrackToPlaylist(params: { playlist_id: string; "songs"?: string }): Promise<MCPToolCallResponse>;
}
