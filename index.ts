/**
 * Integrate SDK - Main Entry Point
 * 
 * Client-side SDK for MCP with integration-based configuration
 * 
 * @example
 * ```typescript
 * // Use the default client with all integrations
 * import { client } from 'integrate-sdk';
 * 
 * await client.github.listOwnRepos({});
 * 
 * // Or create a custom client with different API configuration
 * import { createMCPClient, githubIntegration } from 'integrate-sdk';
 * 
 * // Example 1: Different API path (same origin)
 * const customClient = createMCPClient({
 *   apiRouteBase: '/custom/api/path', // Calls /custom/api/path/mcp
 *   integrations: [githubIntegration()],
 * });
 * 
 * // Example 2: Different API domain (cross-origin)
 * const crossOriginClient = createMCPClient({
 *   apiBaseUrl: 'https://api.example.com', // API on different domain
 *   apiRouteBase: '/api/integrate', // Calls https://api.example.com/api/integrate/mcp
 *   integrations: [githubIntegration()],
 * });
 * ```
 */

export * from './src/index.js';

// Export default client with all integrations pre-configured
import { createMCPClient } from './src/client.js';
import { githubIntegration } from './src/integrations/github.js';
import { gmailIntegration } from './src/integrations/gmail.js';
import { notionIntegration } from './src/integrations/notion.js';
import { slackIntegration } from './src/integrations/slack.js';
import { discordIntegration } from './src/integrations/discord.js';
import { linearIntegration } from './src/integrations/linear.js';
import { vercelIntegration } from './src/integrations/vercel.js';
import { zendeskIntegration } from './src/integrations/zendesk.js';
import { stripeIntegration } from './src/integrations/stripe.js';
import { gcalIntegration } from './src/integrations/gcal.js';
import { gmeetIntegration } from './src/integrations/gmeet.js';
import { gtasksIntegration } from './src/integrations/gtasks.js';
import { gcontactsIntegration } from './src/integrations/gcontacts.js';
import { outlookIntegration } from './src/integrations/outlook.js';
import { teamsIntegration } from './src/integrations/teams.js';
import { airtableIntegration } from './src/integrations/airtable.js';
import { attioIntegration } from './src/integrations/attio.js';
import { todoistIntegration } from './src/integrations/todoist.js';
import { whatsappIntegration } from './src/integrations/whatsapp.js';
import { calcomIntegration } from './src/integrations/calcom.js';
import { canvaIntegration } from './src/integrations/canva.js';
import { cloudflareIntegration } from './src/integrations/cloudflare.js';
import { rampIntegration } from './src/integrations/ramp.js';
import { onedriveIntegration } from './src/integrations/onedrive.js';
import { plannerIntegration } from './src/integrations/planner.js';
import { sharepointIntegration } from './src/integrations/sharepoint.js';
import { wordIntegration } from './src/integrations/word.js';
import { excelIntegration } from './src/integrations/excel.js';
import { powerpointIntegration } from './src/integrations/powerpoint.js';
import { gdocsIntegration } from './src/integrations/gdocs.js';
import { gdriveIntegration } from './src/integrations/gdrive.js';
import { gsheetsIntegration } from './src/integrations/gsheets.js';
import { gslidesIntegration } from './src/integrations/gslides.js';
import { polarIntegration } from './src/integrations/polar.js';
import { facebookIntegration } from './src/integrations/facebook.js';
import { figmaIntegration } from './src/integrations/figma.js';
import { intercomIntegration } from './src/integrations/intercom.js';
import { hubspotIntegration } from './src/integrations/hubspot.js';
import { instagramIntegration } from './src/integrations/instagram.js';
import { linkedinIntegration } from './src/integrations/linkedin.js';
import { threadsIntegration } from './src/integrations/threads.js';
import { tiktokIntegration } from './src/integrations/tiktok.js';
import { typeformIntegration } from './src/integrations/typeform.js';
import { xeroIntegration } from './src/integrations/xero.js';
import { gchatIntegration } from './src/integrations/gchat.js';
import { shopifyIntegration } from './src/integrations/shopify.js';
import { youtubeIntegration } from './src/integrations/youtube.js';
import { zoomIntegration } from './src/integrations/zoom.js';
import { redditIntegration } from './src/integrations/reddit.js';
import { cursorIntegration } from './src/integrations/cursor.js';
import { posthogIntegration } from './src/integrations/posthog.js';
import { sentryIntegration } from './src/integrations/sentry.js';
import { datadogIntegration } from './src/integrations/datadog.js';
import { netlifyIntegration } from './src/integrations/netlify.js';
import { mondayIntegration } from './src/integrations/monday.js';
import { webflowIntegration } from './src/integrations/webflow.js';
import { jiraIntegration } from './src/integrations/jira.js';
import { salesforceIntegration } from './src/integrations/salesforce.js';
import { workdayIntegration } from './src/integrations/workday.js';

/**
 * Default MCP Client with all integrations pre-configured
 * 
 * This is a singleton client instance that includes GitHub and Gmail integrations.
 * You can use it directly without having to configure integrations.
 * 
 * Default configuration:
 * - Calls API routes at: {window.location.origin}/api/integrate/mcp
 * - OAuth routes at: {window.location.origin}/api/integrate/oauth/*
 * - Automatically detects if server uses database storage and skips localStorage accordingly
 * 
 * For custom configuration (different apiBaseUrl, apiRouteBase, etc.),
 * use `createMCPClient()` instead.
 * 
 * @example
 * ```typescript
 * import { client } from 'integrate-sdk';
 * 
 * // Use GitHub integration
 * const repos = await client.github.listOwnRepos({});
 * 
 * // Use Gmail integration
 * const messages = await client.gmail.listMessages({});
 * ```
 * 
 * @example
 * ```typescript
 * // If you need server-side token management or custom config, create your own client:
 * import { createMCPClient, githubIntegration } from 'integrate-sdk';
 * 
 * const customClient = createMCPClient({
 *   integrations: [githubIntegration()],
 * });
 * ```
 */
export const client = createMCPClient({
  integrations: [
    githubIntegration(),
    gmailIntegration(),
    notionIntegration(),
    slackIntegration(),
    discordIntegration(),
    linearIntegration(),
    vercelIntegration(),
    zendeskIntegration(),
    stripeIntegration(),
    gcalIntegration(),
    gmeetIntegration(),
    gtasksIntegration(),
    gcontactsIntegration(),
    outlookIntegration(),
    teamsIntegration(),
    airtableIntegration(),
    attioIntegration(),
    todoistIntegration(),
    whatsappIntegration(),
    calcomIntegration(),
    canvaIntegration(),
    cloudflareIntegration(),
    rampIntegration(),
    onedriveIntegration(),
    plannerIntegration(),
    sharepointIntegration(),
    wordIntegration(),
    excelIntegration(),
    powerpointIntegration(),
    gdocsIntegration(),
    gdriveIntegration(),
    gsheetsIntegration(),
    gslidesIntegration(),
    polarIntegration(),
    facebookIntegration(),
    figmaIntegration(),
    intercomIntegration(),
    hubspotIntegration(),
    instagramIntegration(),
    linkedinIntegration(),
    threadsIntegration(),
    tiktokIntegration(),
    typeformIntegration(),
    xeroIntegration(),
    gchatIntegration(),
    shopifyIntegration(),
    youtubeIntegration(),
    zoomIntegration(),
    redditIntegration(),
    cursorIntegration(),
    posthogIntegration(),
    sentryIntegration(),
    datadogIntegration(),
    netlifyIntegration(),
    mondayIntegration(),
    webflowIntegration(),
    jiraIntegration(),
    salesforceIntegration(),
    workdayIntegration(),
  ],
  // Fetch configured integrations from server since default client has all integrations
  // but only some may be configured on the server with OAuth credentials
  useServerConfig: true,
});
