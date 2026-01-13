/**
 * Server Integration Client Types
 * Fully typed interface for server-level tools that don't belong to a specific integration
 */

import type { MCPToolCallResponse } from "../protocol/messages.js";

/**
 * Server Integration Client Interface
 * Provides type-safe methods for server-level operations
 */
export interface ServerIntegrationClient {
  /**
   * List all tools available for a specific integration
   */
  listToolsByIntegration(params: {
    integration: string;
  }): Promise<MCPToolCallResponse>;

  /**
   * List all tools available on the MCP server
   */
  listAllProviders(): Promise<MCPToolCallResponse>;

  /**
   * List integrations configured on this SDK client
   * Merges local configuration with server-provided metadata (name, description, logo, etc.)
   */
  listConfiguredIntegrations(): Promise<{
    integrations: ConfiguredIntegration[];
  }>;
}

/**
 * Server-provided integration metadata from list_all_providers
 */
export interface IntegrationMetadata {
  name: string;
  logo_url?: string;
  description?: string;
  owner?: string;
  example_usage?: string;
}

/**
 * Local integration metadata returned by listConfiguredIntegrations
 */
export interface ConfiguredIntegration {
  id: string;
  name: string;
  tools: readonly string[];
  hasOAuth: boolean;
  scopes?: readonly string[];
  provider?: string;
  // Server metadata (from list_all_providers)
  logoUrl?: string;
  description?: string;
  owner?: string;
  exampleUsage?: string;
}

