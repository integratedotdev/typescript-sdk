import { serverClient } from '@/lib/integrate';
import { toNextJsHandler } from 'integrate-sdk/server';

/**
 * Unified handlers for OAuth flows and MCP tool calls
 * 
 * OAuth flows (handled by SDK):
 * - /api/integrate/oauth/authorize/:provider
 * - /api/integrate/oauth/callback/:provider
 * - Stores tokens in database via setProviderToken
 * 
 * MCP tool calls (from client SDK):
 * - /api/integrate/mcp
 * - Forwards tool calls to MCP server with user context
 */
export const { POST, GET } = toNextJsHandler(serverClient, {
  redirectUrl: '/dashboard/test',
  errorRedirectUrl: '/dashboard/test?error=oauth_failed',
});