import { NextResponse } from 'next/server';
import { serverClient } from '@/lib/integrate';

/**
 * Tool with its full schema from the MCP server
 */
interface ToolWithSchema {
  name: string;
  description?: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, {
      type: string;
      description?: string;
      default?: unknown;
      enum?: unknown[];
    }>;
    required?: string[];
  };
}

/**
 * Integration with full tool metadata
 */
interface IntegrationWithTools {
  id: string;
  name: string;
  logoUrl?: string;
  hasOAuth: boolean;
  tools: ToolWithSchema[];
}

/**
 * Raw integration from SDK listConfiguredIntegrations
 */
interface RawIntegration {
  id: string;
  name: string;
  logoUrl?: string;
  hasOAuth: boolean;
  tools: readonly string[];
  toolMetadata?: Array<{
    name: string;
    description?: string;
    inputSchema?: ToolWithSchema['inputSchema'];
  }>;
}

/**
 * GET /api/integrations/configured
 * 
 * Returns configured integrations with full tool schemas
 * Fetches tool metadata from the MCP server for each integration
 */
export async function GET() {
  let enabledTools: Awaited<ReturnType<typeof serverClient.getEnabledToolsAsync>> = [];
  let configuredIntegrations: RawIntegration[] = [];

  try {
    // Ensure client is connected to MCP server before fetching tools
    if (!serverClient.isConnected()) {
      console.log('[Configured Integrations API] Connecting to MCP server...');
      await serverClient.connect();
      console.log('[Configured Integrations API] Connected to MCP server');
    }

    // Get the list of enabled tools with their full schemas (async fetches from MCP server)
    enabledTools = await serverClient.getEnabledToolsAsync();
  } catch (error: unknown) {
    console.error('[Configured Integrations API] MCP connection failed:', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    const result = await serverClient.server.listConfiguredIntegrations({
      includeToolMetadata: true,
    });
    configuredIntegrations = (result.integrations || []) as RawIntegration[];
  } catch (error: unknown) {
    console.error('[Configured Integrations API] listConfiguredIntegrations failed:', {
      error: error instanceof Error ? error.message : String(error),
    });

    try {
      const result = await serverClient.server.listConfiguredIntegrations();
      configuredIntegrations = (result.integrations || []) as RawIntegration[];
    } catch (fallbackError: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[Configured Integrations API] Static listConfiguredIntegrations also failed:', {
        error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
      });

      return NextResponse.json(
        {
          error: 'Failed to fetch integrations',
          details: errorMessage,
        },
        { status: 500 }
      );
    }
  }

  try {
    // Build integrations with full tool schemas
    const integrationsWithTools: IntegrationWithTools[] = configuredIntegrations.map((integration) => {
      const toolNames: string[] = [...(integration.tools || [])];

      const toolsWithSchemas: ToolWithSchema[] = toolNames.map((toolName: string) => {
        const metaTool = integration.toolMetadata?.find((t) => t.name === toolName);
        if (metaTool?.inputSchema) {
          return {
            name: metaTool.name,
            description: metaTool.description,
            inputSchema: metaTool.inputSchema,
          };
        }

        const fullTool = enabledTools.find((t) => t.name === toolName);
        if (fullTool) {
          return {
            name: fullTool.name,
            description: fullTool.description,
            inputSchema: fullTool.inputSchema as ToolWithSchema['inputSchema'],
          };
        }

        return { name: toolName };
      });

      return {
        id: integration.id,
        name: integration.name,
        logoUrl: integration.logoUrl,
        hasOAuth: integration.hasOAuth,
        tools: toolsWithSchemas,
      };
    });

    // Debug: Log what we got from getEnabledToolsAsync
    console.log('[Configured Integrations API] Enabled tools from SDK:', {
      count: enabledTools.length,
      toolsWithSchemas: enabledTools.filter((t) => t.inputSchema).length,
      sampleTool: enabledTools[0] ? {
        name: enabledTools[0].name,
        hasDescription: !!enabledTools[0].description,
        hasInputSchema: !!enabledTools[0].inputSchema,
        inputSchemaKeys: enabledTools[0].inputSchema ? Object.keys(enabledTools[0].inputSchema) : [],
      } : null,
    });

    console.log('[Configured Integrations API] Successfully fetched integrations with schemas:', {
      count: integrationsWithTools.length,
      integrations: integrationsWithTools.map((i) => ({
        id: i.id,
        name: i.name,
        toolCount: i.tools.length,
        toolsWithSchemas: i.tools.filter((t) => t.inputSchema).length,
      })),
    });

    return NextResponse.json({
      integrations: integrationsWithTools,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('[Configured Integrations API] Error fetching configured integrations:', {
      error: errorMessage,
      errorStack,
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch configured integrations',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
