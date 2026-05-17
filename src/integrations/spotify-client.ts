import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SpotifyIntegrationClient {
  getCurrentUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  search(params: { q: string; type: string; market?: string; limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  getTrack(params: { track_id: string; market?: string }): Promise<MCPToolCallResponse>;
  getAlbum(params: { album_id: string; market?: string }): Promise<MCPToolCallResponse>;
  listUserPlaylists(params?: { limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  getPlaylist(params: { playlist_id: string; market?: string; fields?: string }): Promise<MCPToolCallResponse>;
  createPlaylist(params: { user_id: string; playlist_json: string }): Promise<MCPToolCallResponse>;
  addPlaylistItems(params: { playlist_id: string; items_json: string }): Promise<MCPToolCallResponse>;
  removePlaylistItems(params: { playlist_id: string; items_json: string }): Promise<MCPToolCallResponse>;
  getSavedTracks(params?: { market?: string; limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  saveTracks(params: { tracks_json: string }): Promise<MCPToolCallResponse>;
  removeSavedTracks(params: { tracks_json: string }): Promise<MCPToolCallResponse>;
  getPlaybackState(params?: { market?: string }): Promise<MCPToolCallResponse>;
  startPlayback(params: { device_id?: string; playback_json: string }): Promise<MCPToolCallResponse>;
  pausePlayback(params?: { device_id?: string }): Promise<MCPToolCallResponse>;
}

