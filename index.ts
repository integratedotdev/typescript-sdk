/**
 * Integrate SDK - Main Entry Point
 * 
 * Client-side SDK for MCP with integration-based configuration
 * 
 * @example
 * ```typescript
 * // Create a client with explicitly configured integrations
 * import { createMCPClient, githubIntegration } from 'integrate-sdk';
 * 
 * // Example 1: Different API path (same origin)
 * const client = createMCPClient({
 *   apiRouteBase: '/custom/api/path', // Calls /custom/api/path/mcp
 *   integrations: [githubIntegration()],
 * });
 * 
 * await client.github.listOwnRepos({});
 * ```
 * 
 * @example
 * ```typescript
 * // Example 2: Different API domain (cross-origin)
 * import { createMCPClient, githubIntegration } from 'integrate-sdk';
 * 
 * const client = createMCPClient({
 *   apiBaseUrl: 'https://api.example.com', // API on different domain
 *   apiRouteBase: '/api/integrate', // Calls https://api.example.com/api/integrate/mcp
 *   integrations: [githubIntegration()],
 * });
 * ```
 * 
 * @example
 * ```typescript
 * // Example 3: Multiple integrations
 * import { createMCPClient, githubIntegration, gmailIntegration } from 'integrate-sdk';
 * 
 * const client = createMCPClient({
 *   integrations: [
 *     githubIntegration(),
 *     gmailIntegration(),
 *   ],
 * });
 * ```
 */

export * from './src/index.js';

