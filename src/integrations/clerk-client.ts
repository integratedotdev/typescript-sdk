/**
 * Clerk Integration Client Types
 * Typed interface for Clerk Backend API tools
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface ClerkIntegrationClient {
  listUsers(params?: {
    limit?: number;
    offset?: number;
    query?: string;
    order_by?: string;
    organization_id?: string;
  }): Promise<MCPToolCallResponse>;
  getUser(params: { user_id: string }): Promise<MCPToolCallResponse>;
  createUser(params: {
    payload?: string;
    email_addresses?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    password?: string;
    skip_password_requirement?: boolean;
  }): Promise<MCPToolCallResponse>;
  updateUser(params: { user_id: string; payload: string }): Promise<MCPToolCallResponse>;
  deleteUser(params: { user_id: string }): Promise<MCPToolCallResponse>;
  listOrganizations(params?: {
    limit?: number;
    offset?: number;
    query?: string;
  }): Promise<MCPToolCallResponse>;
  getOrganization(params: { organization_id: string }): Promise<MCPToolCallResponse>;
  createOrganization(params: {
    name: string;
    created_by?: string;
    slug?: string;
  }): Promise<MCPToolCallResponse>;
  updateOrganization(params: {
    organization_id: string;
    payload: string;
  }): Promise<MCPToolCallResponse>;
  deleteOrganization(params: { organization_id: string }): Promise<MCPToolCallResponse>;
  listSessions(params?: {
    limit?: number;
    offset?: number;
    user_id?: string;
    status?: string;
  }): Promise<MCPToolCallResponse>;
  getSession(params: { session_id: string }): Promise<MCPToolCallResponse>;
  revokeSession(params: { session_id: string }): Promise<MCPToolCallResponse>;
}
