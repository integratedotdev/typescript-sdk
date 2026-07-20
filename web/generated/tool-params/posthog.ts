/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface PosthogListOrganizationsParams { limit?: number; offset?: number }

export interface PosthogGetOrganizationParams { organization_id: string }

export interface PosthogListProjectsParams { organization_id: string; limit?: number; offset?: number; search?: string }

export interface PosthogGetProjectParams { organization_id: string; project_id: string | number }

export interface PosthogRunHogqlQueryParams { project_id: string | number; query: string; name?: string; kind?: string }

export interface PosthogListInsightsParams { project_id: string | number; limit?: number; offset?: number; search?: string; refresh?: boolean; insight?: string; basic?: boolean }

export interface PosthogGetInsightParams { project_id: string | number; insight_id: string | number; refresh?: boolean; from_dashboard?: string | number }

export interface PosthogListDashboardsParams { project_id: string | number; limit?: number; offset?: number; search?: string }

export interface PosthogGetDashboardParams { project_id: string | number; dashboard_id: string | number }

export interface PosthogListFeatureFlagsParams { project_id: string | number; limit?: number; offset?: number; search?: string }

export interface PosthogGetFeatureFlagParams { project_id: string | number; flag_id: string | number }

export interface PosthogListExperimentsParams { project_id: string | number; limit?: number; offset?: number }

export interface PosthogGetExperimentParams { project_id: string | number; experiment_id: string | number }

export interface PosthogListAnnotationsParams { project_id: string | number; limit?: number; offset?: number }

export interface PosthogGetAnnotationParams { project_id: string | number; annotation_id: string | number }

export interface PosthogListCohortsParams { project_id: string | number; limit?: number; offset?: number }

export interface PosthogGetCohortParams { project_id: string | number; cohort_id: string | number }

export interface PosthogListEventDefinitionsParams { project_id: string | number; limit?: number; offset?: number; search?: string }

export interface PosthogGetEventDefinitionParams { project_id: string | number; event_definition_id: string | number }

export interface PosthogListPropertyDefinitionsParams { project_id: string | number; limit?: number; offset?: number; search?: string }

export interface PosthogGetPropertyDefinitionParams { project_id: string | number; property_definition_id: string | number }

export interface PosthogListPersonsParams { project_id: string | number; limit?: number; offset?: number; search?: string; email?: string; distinct_id?: string }

export interface PosthogGetPersonParams { project_id: string | number; person_id: string }

export interface PosthogListSessionRecordingsParams { project_id: string | number; limit?: number; offset?: number }

export interface PosthogGetSessionRecordingParams { project_id: string | number; recording_id: string }

