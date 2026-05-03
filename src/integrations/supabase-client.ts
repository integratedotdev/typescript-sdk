/**
 * Supabase Integration Client Types
 * Fully typed interface for Supabase Management API tools
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface SupabaseIntegrationClient {
  getProfile(params?: Record<string, never>): Promise<MCPToolCallResponse>;

  listOrganizations(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getOrganization(params: { slug: string }): Promise<MCPToolCallResponse>;
  listOrganizationProjects(params: { slug: string }): Promise<MCPToolCallResponse>;

  listProjects(params?: Record<string, never>): Promise<MCPToolCallResponse>;
  getProject(params: { ref: string }): Promise<MCPToolCallResponse>;
  createProject(params: {
    name: string;
    organization_slug: string;
    db_pass: string;
    region?: string;
    desired_instance_size?: string;
    template_url?: string;
  }): Promise<MCPToolCallResponse>;
  updateProject(params: { ref: string; name: string }): Promise<MCPToolCallResponse>;
  deleteProject(params: { ref: string }): Promise<MCPToolCallResponse>;

  listProjectApiKeys(params: { ref: string; reveal?: boolean }): Promise<MCPToolCallResponse>;
  createProjectApiKey(params: {
    ref: string;
    key_type: string;
    name: string;
    description?: string;
    reveal?: boolean;
  }): Promise<MCPToolCallResponse>;
  deleteProjectApiKey(params: { ref: string; key_id: string }): Promise<MCPToolCallResponse>;

  listProjectSecrets(params: { ref: string }): Promise<MCPToolCallResponse>;
  listProjectBranches(params: { ref: string }): Promise<MCPToolCallResponse>;
  getProjectHealth(params: { ref: string }): Promise<MCPToolCallResponse>;
  getDatabasePostgresConfig(params: { ref: string }): Promise<MCPToolCallResponse>;
  listAvailableRegions(params?: Record<string, never>): Promise<MCPToolCallResponse>;
}
