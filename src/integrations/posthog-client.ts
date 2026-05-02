/**
 * PostHog Integration Client Types
 * Fully typed interface for PostHog integration methods
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface PostHogCurrentUser {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  [key: string]: any;
}

export interface PostHogOrganization {
  id: string;
  name: string;
  slug?: string;
  membership_level?: string;
  [key: string]: any;
}

export interface PostHogProject {
  id: number | string;
  name: string;
  uuid?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface PostHogInsight {
  id: number | string;
  name?: string;
  short_id?: string;
  description?: string;
  [key: string]: any;
}

export interface PostHogDashboard {
  id: number | string;
  name: string;
  description?: string;
  [key: string]: any;
}

export interface PostHogFeatureFlag {
  id: number | string;
  key: string;
  name?: string;
  active?: boolean;
  [key: string]: any;
}

export interface PostHogExperiment {
  id: number | string;
  name?: string;
  feature_flag_key?: string;
  [key: string]: any;
}

export interface PostHogAnnotation {
  id: number | string;
  content?: string;
  date_marker?: string;
  [key: string]: any;
}

export interface PostHogCohort {
  id: number | string;
  name: string;
  count?: number;
  [key: string]: any;
}

export interface PostHogEventDefinition {
  id: number | string;
  name: string;
  description?: string;
  [key: string]: any;
}

export interface PostHogPropertyDefinition {
  id: number | string;
  name: string;
  property_type?: string;
  [key: string]: any;
}

export interface PostHogPerson {
  id: string;
  name?: string;
  distinct_ids?: string[];
  properties?: Record<string, any>;
  [key: string]: any;
}

export interface PostHogSessionRecording {
  id: string;
  start_time?: string;
  end_time?: string;
  distinct_id?: string;
  [key: string]: any;
}

export interface PostHogIntegrationClient {
  getCurrentUser(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  listOrganizations(params?: { limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  getOrganization(params: { organization_id: string }): Promise<MCPToolCallResponse>;
  listProjects(params: { organization_id: string; limit?: number; offset?: number; search?: string }): Promise<MCPToolCallResponse>;
  getProject(params: { organization_id: string; project_id: string | number }): Promise<MCPToolCallResponse>;
  runHogqlQuery(params: { project_id: string | number; query: string; name?: string; kind?: string }): Promise<MCPToolCallResponse>;
  listInsights(params: { project_id: string | number; limit?: number; offset?: number; search?: string; refresh?: boolean; insight?: string; basic?: boolean }): Promise<MCPToolCallResponse>;
  getInsight(params: { project_id: string | number; insight_id: string | number; refresh?: boolean; from_dashboard?: string | number }): Promise<MCPToolCallResponse>;
  listDashboards(params: { project_id: string | number; limit?: number; offset?: number; search?: string }): Promise<MCPToolCallResponse>;
  getDashboard(params: { project_id: string | number; dashboard_id: string | number }): Promise<MCPToolCallResponse>;
  listFeatureFlags(params: { project_id: string | number; limit?: number; offset?: number; search?: string }): Promise<MCPToolCallResponse>;
  getFeatureFlag(params: { project_id: string | number; flag_id: string | number }): Promise<MCPToolCallResponse>;
  listExperiments(params: { project_id: string | number; limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  getExperiment(params: { project_id: string | number; experiment_id: string | number }): Promise<MCPToolCallResponse>;
  listAnnotations(params: { project_id: string | number; limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  getAnnotation(params: { project_id: string | number; annotation_id: string | number }): Promise<MCPToolCallResponse>;
  listCohorts(params: { project_id: string | number; limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  getCohort(params: { project_id: string | number; cohort_id: string | number }): Promise<MCPToolCallResponse>;
  listEventDefinitions(params: { project_id: string | number; limit?: number; offset?: number; search?: string }): Promise<MCPToolCallResponse>;
  getEventDefinition(params: { project_id: string | number; event_definition_id: string | number }): Promise<MCPToolCallResponse>;
  listPropertyDefinitions(params: { project_id: string | number; limit?: number; offset?: number; search?: string }): Promise<MCPToolCallResponse>;
  getPropertyDefinition(params: { project_id: string | number; property_definition_id: string | number }): Promise<MCPToolCallResponse>;
  listPersons(params: { project_id: string | number; limit?: number; offset?: number; search?: string; email?: string; distinct_id?: string }): Promise<MCPToolCallResponse>;
  getPerson(params: { project_id: string | number; person_id: string }): Promise<MCPToolCallResponse>;
  listSessionRecordings(params: { project_id: string | number; limit?: number; offset?: number }): Promise<MCPToolCallResponse>;
  getSessionRecording(params: { project_id: string | number; recording_id: string }): Promise<MCPToolCallResponse>;
}
