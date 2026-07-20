/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface StravaUpdateLoggedInAthleteParams { athlete_json: string }

export interface StravaGetAthleteStatsParams { athlete_id: string }

export interface StravaListAthleteActivitiesParams { before?: number; after?: number; page?: number; per_page?: number }

export interface StravaGetActivityParams { activity_id: string; include_all_efforts?: boolean }

export interface StravaCreateActivityParams { name: string; type?: string; sport_type: string; start_date_local: string; elapsed_time: number; description?: string; distance?: number; trainer?: boolean; commute?: boolean }

export interface StravaUpdateActivityParams { activity_id: string; activity_json: string }

export interface StravaDeleteActivityParams { activity_id: string }

export interface StravaGetActivityStreamsParams { activity_id: string; keys: string; key_by_type?: boolean }

export interface StravaListAthleteRoutesParams { athlete_id: string; page?: number; per_page?: number }

export interface StravaGetRouteParams { route_id: string }

export interface StravaExportRouteGpxParams { route_id: string }

export interface StravaListAthleteClubsParams { page?: number; per_page?: number }

export interface StravaGetClubParams { club_id: string }

export interface StravaListClubActivitiesParams { club_id: string; page?: number; per_page?: number }

export interface StravaListClubMembersParams { club_id: string; page?: number; per_page?: number }

export interface StravaGetSegmentParams { segment_id: string }

export interface StravaExploreSegmentsParams { bounds: string; activity_type?: string; min_cat?: number; max_cat?: number }

export interface StravaGetSegmentLeaderboardParams { segment_id: string; gender?: string; age_group?: string; weight_class?: string; following?: boolean; club_id?: string; date_range?: string; context_entries?: number; page?: number; per_page?: number }

export interface StravaListStarredSegmentsParams { page?: number; per_page?: number }

export interface StravaStarSegmentParams { segment_id: string; starred: boolean }

export interface StravaGetGearParams { gear_id: string }

export interface StravaGetUploadParams { upload_id: string }

export interface StravaCreateUploadParams { file_name: string; file_base64: string; data_type: string; name?: string; description?: string; trainer?: boolean; commute?: boolean; external_id?: string }

