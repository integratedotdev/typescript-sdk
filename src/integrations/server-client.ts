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
   * Returns local configuration only by default (no server call)
   * 
   * @param options - Optional configuration
   * @param options.includeToolMetadata - If true, fetches full tool metadata from server for all configured integrations
   */
  listConfiguredIntegrations(options?: {
    includeToolMetadata?: boolean;
  }): Promise<{
    integrations: ConfiguredIntegration[];
  }>;
}

/**
 * Tool metadata with description and input schema
 */
export interface ToolMetadata {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

/**
 * Local integration metadata returned by listConfiguredIntegrations
 */
export interface ConfiguredIntegration {
  id: string;
  name: string;
  /** URL to the integration's logo image */
  logoUrl?: string;
  tools: readonly string[];
  hasOAuth: boolean;
  scopes?: readonly string[];
  provider?: string;
  /**
   * Full tool metadata (descriptions, schemas) when includeToolMetadata option is true
   * Only populated if includeToolMetadata: true is passed to listConfiguredIntegrations()
   */
  toolMetadata?: ToolMetadata[];
}

