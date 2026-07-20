"use client";

import { createMCPClient, githubIntegration, gmailIntegration, notionIntegration } from 'integrate-sdk';

/**
 * Client-side MCP client with OAuth integrations configured
 * Used for OAuth authorization flows from the browser
 */
export const client = createMCPClient({
  integrations: [
    githubIntegration({
      scopes: ['repo', 'user'],
    }),
    gmailIntegration({
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
    }),
    notionIntegration()
  ],
  // OAuth API routes are handled by the server-side handler at /api/integrate/[...all]
  oauthApiBase: '/dashboard/api/integrate/oauth',
  apiRouteBase: '/dashboard/api/integrate',
});

