import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface StravaIntegrationClient {
  getLoggedInAthlete(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  updateLoggedInAthlete(params: { athlete_json: string }): Promise<MCPToolCallResponse>;
  getAthleteStats(params: { athlete_id: string }): Promise<MCPToolCallResponse>;
  listAthleteActivities(params?: { before?: number; after?: number; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  getActivity(params: { activity_id: string; include_all_efforts?: boolean }): Promise<MCPToolCallResponse>;
  createActivity(params: { name: string; type?: string; sport_type: string; start_date_local: string; elapsed_time: number; description?: string; distance?: number; trainer?: boolean; commute?: boolean }): Promise<MCPToolCallResponse>;
  updateActivity(params: { activity_id: string; activity_json: string }): Promise<MCPToolCallResponse>;
  deleteActivity(params: { activity_id: string }): Promise<MCPToolCallResponse>;
  getActivityStreams(params: { activity_id: string; keys: string; key_by_type?: boolean }): Promise<MCPToolCallResponse>;
  listAthleteRoutes(params: { athlete_id: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  getRoute(params: { route_id: string }): Promise<MCPToolCallResponse>;
  exportRouteGpx(params: { route_id: string }): Promise<MCPToolCallResponse>;
  listAthleteClubs(params?: { page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  getClub(params: { club_id: string }): Promise<MCPToolCallResponse>;
  listClubActivities(params: { club_id: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  listClubMembers(params: { club_id: string; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  getSegment(params: { segment_id: string }): Promise<MCPToolCallResponse>;
  exploreSegments(params: { bounds: string; activity_type?: string; min_cat?: number; max_cat?: number }): Promise<MCPToolCallResponse>;
  getSegmentLeaderboard(params: { segment_id: string; gender?: string; age_group?: string; weight_class?: string; following?: boolean; club_id?: string; date_range?: string; context_entries?: number; page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  listStarredSegments(params?: { page?: number; per_page?: number }): Promise<MCPToolCallResponse>;
  starSegment(params: { segment_id: string; starred: boolean }): Promise<MCPToolCallResponse>;
  getGear(params: { gear_id: string }): Promise<MCPToolCallResponse>;
  getUpload(params: { upload_id: string }): Promise<MCPToolCallResponse>;
  createUpload(params: { file_name: string; file_base64: string; data_type: string; name?: string; description?: string; trainer?: boolean; commute?: boolean; external_id?: string }): Promise<MCPToolCallResponse>;
}

