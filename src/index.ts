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
export { toSolidStartHandler } from "./adapters/solid-start.js";
export { toSvelteKitHandler, svelteKitHandler } from "./adapters/svelte-kit.js";
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

// Built-in integrations
export { githubIntegration } from "./integrations/github.js";
export type { GitHubIntegrationConfig, GitHubTools, GitHubIntegrationClient } from "./integrations/github.js";

export { gmailIntegration } from "./integrations/gmail.js";
export type { GmailIntegrationConfig, GmailTools, GmailIntegrationClient } from "./integrations/gmail.js";

export { notionIntegration } from "./integrations/notion.js";
export type { NotionIntegrationConfig, NotionTools, NotionIntegrationClient } from "./integrations/notion.js";

export { slackIntegration } from "./integrations/slack.js";
export type { SlackIntegrationConfig, SlackTools, SlackIntegrationClient } from "./integrations/slack.js";

export { linearIntegration } from "./integrations/linear.js";
export type { LinearIntegrationConfig, LinearTools, LinearIntegrationClient } from "./integrations/linear.js";

export { vercelIntegration } from "./integrations/vercel.js";
export type { VercelIntegrationConfig, VercelTools, VercelIntegrationClient } from "./integrations/vercel.js";

export { zendeskIntegration } from "./integrations/zendesk.js";
export type { ZendeskIntegrationConfig, ZendeskTools, ZendeskIntegrationClient } from "./integrations/zendesk.js";

export { stripeIntegration } from "./integrations/stripe.js";
export type { StripeIntegrationConfig, StripeTools, StripeIntegrationClient } from "./integrations/stripe.js";

export { gcalIntegration } from "./integrations/gcal.js";
export type { GcalIntegrationConfig, GcalTools, GcalIntegrationClient } from "./integrations/gcal.js";

export { outlookIntegration } from "./integrations/outlook.js";
export type { OutlookIntegrationConfig, OutlookTools, OutlookIntegrationClient } from "./integrations/outlook.js";

export { airtableIntegration } from "./integrations/airtable.js";
export type { AirtableIntegrationConfig, AirtableTools, AirtableIntegrationClient } from "./integrations/airtable.js";

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

export { gworkspaceIntegration } from "./integrations/gworkspace.js";
export type { GWorkspaceIntegrationConfig, GWorkspaceTools, GWorkspaceIntegrationClient } from "./integrations/gworkspace.js";

export { polarIntegration } from "./integrations/polar.js";
export type { PolarIntegrationConfig, PolarTools, PolarIntegrationClient } from "./integrations/polar.js";

export { figmaIntegration } from "./integrations/figma.js";
export type { FigmaIntegrationConfig, FigmaTools, FigmaIntegrationClient } from "./integrations/figma.js";

export { intercomIntegration } from "./integrations/intercom.js";
export type { IntercomIntegrationConfig, IntercomTools, IntercomIntegrationClient } from "./integrations/intercom.js";

export { hubspotIntegration } from "./integrations/hubspot.js";
export type { HubSpotIntegrationConfig, HubSpotTools, HubSpotIntegrationClient } from "./integrations/hubspot.js";

export { youtubeIntegration } from "./integrations/youtube.js";
export type { YouTubeIntegrationConfig, YouTubeTools, YouTubeIntegrationClient } from "./integrations/youtube.js";

// Server client
export type { ServerIntegrationClient } from "./integrations/server-client.js";

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

