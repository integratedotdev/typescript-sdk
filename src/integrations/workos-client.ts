/**
 * WorkOS Integration Client Types
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface WorkOSIntegrationClient {
  listOrganizations(params?: {
    before?: string;
    after?: string;
    limit?: number;
    order?: string;
    search?: string;
    domains?: string;
  }): Promise<MCPToolCallResponse>;
  getOrganization(params: { organization_id: string }): Promise<MCPToolCallResponse>;
  createOrganization(params: {
    name: string;
    external_id?: string;
    allow_profiles_outside_organization?: boolean;
    metadata_json?: string;
    domain_data_json?: string;
  }): Promise<MCPToolCallResponse>;
  updateOrganization(params: {
    organization_id: string;
    name?: string;
    external_id?: string;
    allow_profiles_outside_organization?: boolean;
    metadata_json?: string;
  }): Promise<MCPToolCallResponse>;
  listUsers(params?: {
    before?: string;
    after?: string;
    limit?: number;
    order?: string;
    organization_id?: string;
    email?: string;
  }): Promise<MCPToolCallResponse>;
  getUser(params: { user_id: string }): Promise<MCPToolCallResponse>;
  listOrganizationMemberships(params: {
    organization_id?: string;
    user_id?: string;
    before?: string;
    after?: string;
    limit?: number;
    order?: string;
    statuses?: string;
  }): Promise<MCPToolCallResponse>;
  listDirectories(params?: {
    before?: string;
    after?: string;
    limit?: number;
    order?: string;
    organization_id?: string;
    search?: string;
    domain?: string;
  }): Promise<MCPToolCallResponse>;
  getDirectory(params: { directory_id: string }): Promise<MCPToolCallResponse>;
  listDirectoryUsers(params?: {
    directory?: string;
    group?: string;
    before?: string;
    after?: string;
    limit?: number;
    order?: string;
  }): Promise<MCPToolCallResponse>;
  getDirectoryUser(params: { directory_user_id: string }): Promise<MCPToolCallResponse>;
}
