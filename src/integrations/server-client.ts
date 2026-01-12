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
   * Returns local configuration only (no server call)
   */
  listConfiguredIntegrations(): Promise<{
    integrations: ConfiguredIntegration[];
  }>;
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
}

