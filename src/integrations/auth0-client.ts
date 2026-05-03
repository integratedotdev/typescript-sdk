/**
 * Auth0 Integration Client Types
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

export interface Auth0IntegrationClient {
  listUsers(params?: {
    q?: string;
    page?: number;
    per_page?: number;
    include_totals?: boolean;
  }): Promise<MCPToolCallResponse>;
  getUser(params: { user_id: string }): Promise<MCPToolCallResponse>;
  createUser(params: {
    connection: string;
    email: string;
    password: string;
    name?: string;
  }): Promise<MCPToolCallResponse>;
  patchUser(params: { user_id: string; patch_json: string }): Promise<MCPToolCallResponse>;
  deleteUser(params: { user_id: string }): Promise<MCPToolCallResponse>;
  listConnections(params?: {
    strategy?: string;
    fields?: string;
    include_fields?: boolean;
  }): Promise<MCPToolCallResponse>;
  getConnection(params: { connection_id: string; fields?: string }): Promise<MCPToolCallResponse>;
  listClients(params?: {
    page?: number;
    per_page?: number;
    is_global?: boolean;
    is_first_party?: boolean;
  }): Promise<MCPToolCallResponse>;
  getClient(params: { client_id: string; fields?: string }): Promise<MCPToolCallResponse>;
  createClient(params: { client_json: string }): Promise<MCPToolCallResponse>;
  patchClient(params: { client_id: string; patch_json: string }): Promise<MCPToolCallResponse>;
}
