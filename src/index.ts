/**
 * Integrate SDK
 * Type-safe TypeScript SDK for MCP Client
 */

// Core client
export type { MCPClient } from "./client.js";
export { MCPClientBase, createMCPClient, clearClientCache } from "./client.js";
export type { ToolInvocationOptions } from "./client.js";

// OAuth utilities
export { OAuthManager } from "./oauth/manager.js";
export { OAuthWindowManager, sendCallbackToOpener } from "./oauth/window-manager.js";
export { generateCodeVerifier, generateCodeChallenge, generateState, generateStateWithReturnUrl, parseState } from "./oauth/pkce.js";
export {
  resolveAccessToken,
  refreshViaMcp,
  shouldRefreshToken,
  RefreshRejectedError,
  RefreshTransientError,
  DEFAULT_REFRESH_WINDOW_MS,
} from "./oauth/refresh.js";
export type {
  RefreshResult,
  RefreshViaMcpOptions,
  ResolveAccessTokenOptions,
} from "./oauth/refresh.js";
export type {
  OAuthFlowConfig,
  PopupOptions,
  AuthStatus,
  PendingAuth,
  AuthorizationUrlResponse,
  OAuthCallbackResponse,
  OAuthCallbackParams,
  ProviderTokenData,
  AccountInfo,
  OAuthEventType,
  OAuthEventHandler,
  AuthStartedEvent,
  AuthCompleteEvent,
  AuthErrorEvent,
  AuthDisconnectEvent,
  AuthLogoutEvent,
} from "./oauth/types.js";

// OAuth route adapters
export { OAuthHandler } from "./adapters/base-handler.js";
export type {
  OAuthHandlerConfig,
  AuthorizeRequest,
  AuthorizeResponse,
  CallbackRequest,
  CallbackResponse,
  StatusResponse,
  DisconnectRequest,
  DisconnectResponse,
} from "./adapters/base-handler.js";

// Framework adapters
export { createNextOAuthHandler } from "./adapters/nextjs.js";
export { createOAuthRedirectHandler } from "./adapters/nextjs-oauth-redirect.js";
export type { OAuthRedirectConfig } from "./adapters/nextjs-oauth-redirect.js";

export { fromNodeHeaders, toWebRequest } from "./adapters/node.js";
// Note: toSolidStartHandler, toSvelteKitHandler — import from 'integrate-sdk/server'
// (those adapter shims re-export from server.ts which is Node-only)
export { toTanStackStartHandler, createTanStackOAuthHandler } from "./adapters/tanstack-start.js";

// Configuration
export type { MCPClientConfig, ReauthContext, ReauthHandler, MCPContext, ToolCallOptions } from "./config/types.js";

// Errors
export {
  IntegrateSDKError,
  AuthenticationError,
  AuthorizationError,
  TokenExpiredError,
  ConnectionError,
  ToolCallError,
  isAuthError,
  isTokenExpiredError,
  isAuthorizationError,
  parseServerError,
} from "./errors.js";

// Integration system
export type {
  MCPIntegration,
  OAuthConfig,
  ExtractIntegrationIds,
  ExtractIntegrationTools,
} from "./integrations/types.js";

export { INTEGRATION_CATEGORY_ORDER } from "./integrations/library-metadata.js";
export type { IntegrationCategory } from "./integrations/library-metadata.js";

// Built-in integrations
export { githubIntegration } from "./integrations/github.js";
export type { GitHubIntegrationConfig, GitHubTools, GitHubIntegrationClient } from "./integrations/github.js";

export { gmailIntegration } from "./integrations/gmail.js";
export type { GmailIntegrationConfig, GmailTools, GmailIntegrationClient } from "./integrations/gmail.js";

export { notionIntegration } from "./integrations/notion.js";
export type { NotionIntegrationConfig, NotionTools, NotionIntegrationClient } from "./integrations/notion.js";

export { slackIntegration } from "./integrations/slack.js";
export type { SlackIntegrationConfig, SlackTools, SlackIntegrationClient } from "./integrations/slack.js";

export { discordIntegration } from "./integrations/discord.js";
export type { DiscordIntegrationConfig, DiscordTools, DiscordIntegrationClient } from "./integrations/discord.js";

export { linearIntegration } from "./integrations/linear.js";
export type { LinearIntegrationConfig, LinearTools, LinearIntegrationClient } from "./integrations/linear.js";

export { railwayIntegration } from "./integrations/railway.js";
export type { RailwayIntegrationConfig, RailwayTools, RailwayScopes, RailwayIntegrationClient } from "./integrations/railway.js";

export { vercelIntegration } from "./integrations/vercel.js";
export type { VercelIntegrationConfig, VercelTools, VercelIntegrationClient } from "./integrations/vercel.js";

export { zendeskIntegration } from "./integrations/zendesk.js";
export type { ZendeskIntegrationConfig, ZendeskTools, ZendeskIntegrationClient } from "./integrations/zendesk.js";

export { stripeIntegration } from "./integrations/stripe.js";
export type { StripeIntegrationConfig, StripeTools, StripeIntegrationClient } from "./integrations/stripe.js";

export { gcalIntegration } from "./integrations/gcal.js";
export type { GcalIntegrationConfig, GcalTools, GcalIntegrationClient } from "./integrations/gcal.js";

export { gtasksIntegration } from "./integrations/gtasks.js";
export type { GtasksIntegrationConfig, GtasksTools, GtasksIntegrationClient } from "./integrations/gtasks.js";

export { gcontactsIntegration } from "./integrations/gcontacts.js";
export type {
  GcontactsIntegrationConfig,
  GcontactsTools,
  GcontactsIntegrationClient,
} from "./integrations/gcontacts.js";

export { outlookIntegration } from "./integrations/outlook.js";
export type { OutlookIntegrationConfig, OutlookTools, OutlookIntegrationClient } from "./integrations/outlook.js";

export { teamsIntegration } from "./integrations/teams.js";
export type { TeamsIntegrationConfig, TeamsTools, TeamsScopes, TeamsIntegrationClient } from "./integrations/teams.js";

export { airtableIntegration } from "./integrations/airtable.js";
export type { AirtableIntegrationConfig, AirtableTools, AirtableIntegrationClient } from "./integrations/airtable.js";

export { astronomerIntegration } from "./integrations/astronomer.js";
export type { AstronomerIntegrationOptions, AstronomerTools, AstronomerIntegrationClient } from "./integrations/astronomer.js";

export { betterstackIntegration } from "./integrations/betterstack.js";
export type {
  BetterStackIntegrationOptions,
  BetterStackTools,
  BetterStackIntegrationClient,
} from "./integrations/betterstack.js";

export { todoistIntegration } from "./integrations/todoist.js";
export type { TodoistIntegrationConfig, TodoistTools, TodoistIntegrationClient } from "./integrations/todoist.js";

export { whatsappIntegration } from "./integrations/whatsapp.js";
export type { WhatsAppIntegrationConfig, WhatsAppTools, WhatsAppIntegrationClient } from "./integrations/whatsapp.js";

export { calcomIntegration } from "./integrations/calcom.js";
export type { CalcomIntegrationConfig, CalcomTools, CalcomIntegrationClient } from "./integrations/calcom.js";

export { rampIntegration } from "./integrations/ramp.js";
export type { RampIntegrationConfig, RampTools, RampIntegrationClient } from "./integrations/ramp.js";

export { onedriveIntegration } from "./integrations/onedrive.js";
export type { OneDriveIntegrationConfig, OneDriveTools, OneDriveIntegrationClient } from "./integrations/onedrive.js";

export { plannerIntegration } from "./integrations/planner.js";
export type {
  PlannerIntegrationConfig,
  PlannerTools,
  PlannerIntegrationClient,
} from "./integrations/planner.js";

export { dropboxIntegration } from "./integrations/dropbox.js";
export type { DropboxIntegrationOptions, DropboxTools } from "./integrations/dropbox.js";

export { paperIntegration } from "./integrations/paper.js";
export type {
  PaperIntegrationConfig,
  PaperTools,
  PaperScopes,
  PaperIntegrationClient,
} from "./integrations/paper.js";

export { gdocsIntegration } from "./integrations/gdocs.js";
export type { GDocsIntegrationConfig, GDocsTools, GDocsIntegrationClient } from "./integrations/gdocs.js";

export { gsheetsIntegration } from "./integrations/gsheets.js";
export type { GSheetsIntegrationConfig, GSheetsTools, GSheetsIntegrationClient } from "./integrations/gsheets.js";

export { gslidesIntegration } from "./integrations/gslides.js";
export type { GSlidesIntegrationConfig, GSlidesTools, GSlidesIntegrationClient } from "./integrations/gslides.js";

export { polarIntegration } from "./integrations/polar.js";
export type { PolarIntegrationConfig, PolarTools, PolarIntegrationClient } from "./integrations/polar.js";

export { supabaseIntegration } from "./integrations/supabase.js";
export type { SupabaseIntegrationConfig, SupabaseTools, SupabaseIntegrationClient } from "./integrations/supabase.js";

export { phantomIntegration, buildPhantomBrowseDeeplink } from "./integrations/phantom.js";
export type { PhantomTools, PhantomIntegrationClient } from "./integrations/phantom.js";

export { facebookIntegration } from "./integrations/facebook.js";
export type {
  FacebookIntegrationConfig,
  FacebookTools,
  FacebookScopes,
  FacebookIntegrationClient,
} from "./integrations/facebook.js";

export { figmaIntegration } from "./integrations/figma.js";
export type { FigmaIntegrationConfig, FigmaTools, FigmaIntegrationClient } from "./integrations/figma.js";

export { intercomIntegration } from "./integrations/intercom.js";
export type { IntercomIntegrationConfig, IntercomTools, IntercomIntegrationClient } from "./integrations/intercom.js";

export { hubspotIntegration } from "./integrations/hubspot.js";
export type { HubSpotIntegrationConfig, HubSpotTools, HubSpotIntegrationClient } from "./integrations/hubspot.js";

export { instagramIntegration } from "./integrations/instagram.js";
export type {
  InstagramIntegrationConfig,
  InstagramTools,
  InstagramScopes,
  InstagramIntegrationClient,
} from "./integrations/instagram.js";

export { youtubeIntegration } from "./integrations/youtube.js";
export type { YouTubeIntegrationConfig, YouTubeTools, YouTubeIntegrationClient } from "./integrations/youtube.js";

export { cursorIntegration } from "./integrations/cursor.js";
export type { CursorIntegrationConfig, CursorTools, CursorIntegrationClient } from "./integrations/cursor.js";

export { databricksIntegration } from "./integrations/databricks.js";
export type {
  DatabricksIntegrationConfig,
  DatabricksTools,
  DatabricksScopes,
  DatabricksIntegrationClient,
} from "./integrations/databricks.js";

export { posthogIntegration } from "./integrations/posthog.js";
export type { PostHogIntegrationConfig, PostHogTools, PostHogScopes, PostHogIntegrationClient } from "./integrations/posthog.js";

export { postmanIntegration } from "./integrations/postman.js";
export type { PostmanTools, PostmanIntegrationClient } from "./integrations/postman.js";

export { sentryIntegration } from "./integrations/sentry.js";
export type { SentryIntegrationConfig, SentryTools, SentryScopes, SentryIntegrationClient } from "./integrations/sentry.js";

export { datadogIntegration } from "./integrations/datadog.js";
export type { DatadogIntegrationConfig, DatadogTools, DatadogScopes, DatadogIntegrationClient } from "./integrations/datadog.js";

export { netlifyIntegration } from "./integrations/netlify.js";
export type { NetlifyIntegrationConfig, NetlifyTools, NetlifyIntegrationClient } from "./integrations/netlify.js";

export { redisIntegration, encodeRedisCloudBearerToken } from "./integrations/redis.js";
export type { RedisIntegrationOptions, RedisTools, RedisIntegrationClient } from "./integrations/redis.js";

export { webflowIntegration } from "./integrations/webflow.js";
export type { WebflowIntegrationConfig, WebflowTools, WebflowIntegrationClient } from "./integrations/webflow.js";

export { jiraIntegration } from "./integrations/jira.js";
export type { JiraIntegrationConfig, JiraTools, JiraScopes, JiraIntegrationClient } from "./integrations/jira.js";

export { linkedinIntegration } from "./integrations/linkedin.js";
export type {
  LinkedInIntegrationConfig,
  LinkedInTools,
  LinkedInScopes,
  LinkedInIntegrationClient,
} from "./integrations/linkedin.js";

export { threadsIntegration } from "./integrations/threads.js";
export type {
  ThreadsIntegrationConfig,
  ThreadsTools,
  ThreadsScopes,
  ThreadsIntegrationClient,
} from "./integrations/threads.js";

export { tiktokIntegration } from "./integrations/tiktok.js";
export type { TikTokIntegrationConfig, TikTokTools, TikTokScopes, TikTokIntegrationClient } from "./integrations/tiktok.js";

export { trelloIntegration } from "./integrations/trello.js";
export type { TrelloIntegrationOptions, TrelloTools, TrelloIntegrationClient } from "./integrations/trello.js";

export { typeformIntegration } from "./integrations/typeform.js";
export type {
  TypeformIntegrationConfig,
  TypeformTools,
  TypeformScopes,
  TypeformIntegrationClient,
} from "./integrations/typeform.js";

export { sharepointIntegration } from "./integrations/sharepoint.js";
export type {
  SharePointIntegrationConfig,
  SharePointTools,
  SharePointScopes,
  SharePointIntegrationClient,
} from "./integrations/sharepoint.js";

export { xeroIntegration } from "./integrations/xero.js";
export type { XeroIntegrationConfig, XeroTools, XeroScopes, XeroIntegrationClient } from "./integrations/xero.js";

export { salesforceIntegration } from "./integrations/salesforce.js";
export type {
  SalesforceIntegrationConfig,
  SalesforceTools,
  SalesforceIntegrationClient,
} from "./integrations/salesforce.js";

export { attioIntegration } from "./integrations/attio.js";
export type { AttioIntegrationConfig, AttioTools, AttioScopes, AttioIntegrationClient } from "./integrations/attio.js";

export { gchatIntegration } from "./integrations/gchat.js";
export type { GchatIntegrationConfig, GchatTools, GchatScopes, GchatIntegrationClient } from "./integrations/gchat.js";

export { shopifyIntegration } from "./integrations/shopify.js";
export type { ShopifyIntegrationConfig, ShopifyTools, ShopifyScopes, ShopifyIntegrationClient } from "./integrations/shopify.js";

export { convexIntegration } from "./integrations/convex.js";
export type { ConvexIntegrationOptions, ConvexTools, ConvexIntegrationClient } from "./integrations/convex.js";

export { etoroIntegration } from "./integrations/etoro.js";
export type { EtoroIntegrationOptions, EtoroTools, EtoroIntegrationClient } from "./integrations/etoro.js";

export { alpacaIntegration } from "./integrations/alpaca.js";
export type { AlpacaIntegrationOptions, AlpacaTools, AlpacaIntegrationClient } from "./integrations/alpaca.js";

export { neonIntegration } from "./integrations/neon.js";
export type { NeonIntegrationOptions, NeonTools, NeonIntegrationClient } from "./integrations/neon.js";

export { workosIntegration } from "./integrations/workos.js";
export type { WorkOSIntegrationOptions, WorkOSTools, WorkOSIntegrationClient } from "./integrations/workos.js";

export { workdayIntegration } from "./integrations/workday.js";
export type { WorkdayIntegrationConfig, WorkdayTools, WorkdayIntegrationClient } from "./integrations/workday.js";

export { tldrawIntegration } from "./integrations/tldraw.js";
export type { TldrawIntegrationOptions, TldrawTools, TldrawIntegrationClient } from "./integrations/tldraw.js";

export { upstashIntegration } from "./integrations/upstash.js";
export type {
  UpstashIntegrationOptions,
  UpstashTools,
  UpstashIntegrationClient,
} from "./integrations/upstash.js";

export { granolaIntegration } from "./integrations/granola.js";
export type { GranolaIntegrationOptions, GranolaTools } from "./integrations/granola.js";

export { mercuryIntegration } from "./integrations/mercury.js";
export type { MercuryIntegrationOptions, MercuryTools } from "./integrations/mercury.js";

export { mailchimpIntegration } from "./integrations/mailchimp.js";
export type {
  MailchimpIntegrationConfig,
  MailchimpTools,
  MailchimpIntegrationClient,
} from "./integrations/mailchimp.js";

export { awsIntegration } from "./integrations/aws.js";
export type {
  AwsIntegrationOptions,
  AwsIntegrationCredentials,
  AwsTools,
  AwsIntegrationClient,
} from "./integrations/aws.js";

export { wixIntegration } from "./integrations/wix.js";
export type { WixIntegrationOptions, WixTools, WixIntegrationClient } from "./integrations/wix.js";

export { auth0Integration } from "./integrations/auth0.js";
export type { Auth0IntegrationOptions, Auth0Tools, Auth0IntegrationClient } from "./integrations/auth0.js";

export { binanceIntegration } from "./integrations/binance.js";
export type { BinanceIntegrationOptions, BinanceTools, BinanceIntegrationClient } from "./integrations/binance.js";

export { canvaIntegration } from "./integrations/canva.js";
export type { CanvaIntegrationConfig, CanvaTools, CanvaIntegrationClient } from "./integrations/canva.js";

export { clerkIntegration } from "./integrations/clerk.js";
export type { ClerkIntegrationOptions, ClerkTools, ClerkIntegrationClient } from "./integrations/clerk.js";

export { cloudflareIntegration } from "./integrations/cloudflare.js";
export type { CloudflareIntegrationConfig, CloudflareTools, CloudflareIntegrationClient } from "./integrations/cloudflare.js";

export { clickupIntegration } from "./integrations/clickup.js";
export type { ClickUpIntegrationConfig, ClickUpTools, ClickUpIntegrationClient } from "./integrations/clickup.js";

export { excelIntegration } from "./integrations/excel.js";
export type { ExcelIntegrationConfig, ExcelTools, ExcelIntegrationClient } from "./integrations/excel.js";

export { ga4Integration } from "./integrations/ga4.js";
export type { Ga4IntegrationConfig, Ga4Tools, Ga4IntegrationClient } from "./integrations/ga4.js";

export { gdriveIntegration } from "./integrations/gdrive.js";
export type { GDriveIntegrationConfig, GDriveTools, GDriveIntegrationClient } from "./integrations/gdrive.js";

export { gitlabIntegration } from "./integrations/gitlab.js";
export type { GitLabIntegrationConfig, GitLabTools, GitLabIntegrationClient } from "./integrations/gitlab.js";

export { gmeetIntegration } from "./integrations/gmeet.js";
export type { GmeetIntegrationConfig, GmeetTools, GmeetIntegrationClient } from "./integrations/gmeet.js";

export { mondayIntegration } from "./integrations/monday.js";
export type { MondayIntegrationConfig, MondayTools, MondayIntegrationClient } from "./integrations/monday.js";

export { planetscaleIntegration } from "./integrations/planetscale.js";
export type { PlanetScaleIntegrationConfig, PlanetScaleTools, PlanetScaleIntegrationClient } from "./integrations/planetscale.js";

export { powerpointIntegration } from "./integrations/powerpoint.js";
export type { PowerPointIntegrationConfig, PowerPointTools, PowerPointIntegrationClient } from "./integrations/powerpoint.js";

export { redditIntegration } from "./integrations/reddit.js";
export type { RedditIntegrationConfig, RedditTools, RedditIntegrationClient } from "./integrations/reddit.js";

export { resendIntegration } from "./integrations/resend.js";
export type { ResendIntegrationOptions, ResendTools, ResendIntegrationClient } from "./integrations/resend.js";

export { wordIntegration } from "./integrations/word.js";
export type { WordIntegrationConfig, WordTools, WordIntegrationClient } from "./integrations/word.js";

export { zapierIntegration } from "./integrations/zapier.js";
export type { ZapierIntegrationConfig, ZapierTools, ZapierIntegrationClient } from "./integrations/zapier.js";

export { zoomIntegration } from "./integrations/zoom.js";
export type { ZoomIntegrationConfig, ZoomTools, ZoomIntegrationClient } from "./integrations/zoom.js";

// Server client
export type { ServerIntegrationClient } from "./integrations/server-client.js";

// Triggers
export { TriggerClient } from "./triggers/client.js";
export type { TriggerClientConfig } from "./triggers/client.js";
export type {
  Trigger,
  TriggerSchedule,
  TriggerStatus,
  CreateTriggerParams,
  UpdateTriggerParams,
  ListTriggersParams,
  ListTriggersResponse,
  TriggerExecutionResult,
  TriggerCallbacks,
  StepResult,
  CompleteRequest,
  CompleteResponse,
  WebhookConfig,
  WebhookPayload,
  CompleteCallbackContext,
} from "./triggers/types.js";
export { MAX_TRIGGER_STEPS, WEBHOOK_DELIVERY_TIMEOUT_MS } from "./triggers/types.js";
export { validateStepLimit } from "./triggers/utils.js";
export { deliverWebhooks } from "./triggers/webhooks.js";

export {
  genericOAuthIntegration,
  createSimpleIntegration,
} from "./integrations/generic.js";
export type { GenericOAuthIntegrationConfig } from "./integrations/generic.js";

// Note: AI tools (getVercelAITools, etc.) are only available from 'integrate-sdk/server'
// They are server-side only and should not be imported in client code

// Protocol types
export type {
  JSONRPCRequest,
  JSONRPCResponse,
  JSONRPCSuccessResponse,
  JSONRPCErrorResponse,
  JSONRPCNotification,
  MCPTool,
  MCPToolsListResponse,
  MCPToolCallParams,
  MCPToolCallResponse,
  MCPInitializeParams,
  MCPInitializeResponse,
} from "./protocol/messages.js";

export { MCPMethod } from "./protocol/messages.js";

// Transport
export { HttpSessionTransport } from "./transport/http-session.js";
export type {
  MessageHandler,
  HttpSessionTransportOptions,
} from "./transport/http-session.js";
