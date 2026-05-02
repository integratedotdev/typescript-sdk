import type { MCPIntegration } from "./types.js";
import type { ToolMetadata } from "./server-client.js";
import { integrationLibraryPresentationFields } from "./library-metadata.js";

export type ConfiguredIntegrationSummaryBase = {
  id: string;
  name: string;
  logoUrl?: string;
  tools: readonly string[];
  hasOAuth: boolean;
  scopes?: readonly string[];
  provider?: string;
  description?: string;
  category?: string;
};

/**
 * Shape returned by listConfiguredIntegrations / GET integrations (without toolMetadata).
 */
export function toConfiguredIntegrationSummary(
  integration: MCPIntegration
): ConfiguredIntegrationSummaryBase {
  const row = integration as MCPIntegration & Record<string, unknown>;
  const pres = integrationLibraryPresentationFields(row);

  return {
    id: integration.id,
    name: (row.name as string | undefined) || integration.id,
    logoUrl: row.logoUrl as string | undefined,
    tools: integration.tools,
    hasOAuth: !!integration.oauth,
    scopes: integration.oauth?.scopes,
    provider: integration.oauth?.provider,
    ...pres,
  };
}

/**
 * Same as {@link toConfiguredIntegrationSummary} plus optional toolMetadata array.
 */
export function toConfiguredIntegrationWithToolMetadata(
  integration: MCPIntegration,
  toolMetadata: ToolMetadata[]
): ConfiguredIntegrationSummaryBase & { toolMetadata: ToolMetadata[] } {
  return {
    ...toConfiguredIntegrationSummary(integration),
    toolMetadata,
  };
}
