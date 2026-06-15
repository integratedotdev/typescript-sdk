/**
 * MCP Client
 * Main client class that orchestrates transport, protocol, and integrations
 */

import { HttpSessionTransport } from "./transport/http-session.js";
import type {
  MCPTool,
  MCPToolsListResponse,
  MCPToolCallResponse,
  MCPInitializeParams,
  MCPInitializeResponse,
} from "./protocol/messages.js";
import { MCPMethod } from "./protocol/messages.js";
import type { MCPIntegration, OAuthConfig } from "./integrations/types.js";
import { toConfiguredIntegrationSummary, toConfiguredIntegrationWithToolMetadata } from "./integrations/integration-summary.js";
import { parseToolsFromListByIntegrationText } from "./integrations/list-tools-by-integration.js";
import { integrationLibraryPresentationFields } from "./integrations/library-metadata.js";
import type { MCPClientConfig, ReauthHandler, ToolCallOptions, MCPContext, EnabledToolsAsyncOptions } from "./config/types.js";
import { listConnectedProviders } from "./database/token-store.js";
import {
  parseServerError,
  isAuthError,
  type AuthenticationError,
} from "./errors.js";
import { methodToToolName } from "./utils/naming.js";
import { setLogLevel, createLogger, type LogContext } from "./utils/logger.js";

/**
 * Logger context for client-side logging
 */
const CLIENT_LOG_CONTEXT: LogContext = 'client';
import type { GitHubIntegrationClient } from "./integrations/github-client.js";
import type { GmailIntegrationClient } from "./integrations/gmail-client.js";
import type { NotionIntegrationClient } from "./integrations/notion-client.js";
import type { SlackIntegrationClient } from "./integrations/slack-client.js";
import type { LinearIntegrationClient } from "./integrations/linear-client.js";
import type { RailwayIntegrationClient } from "./integrations/railway-client.js";
import type { VercelIntegrationClient } from "./integrations/vercel-client.js";
import type { ZendeskIntegrationClient } from "./integrations/zendesk-client.js";
import type { StripeIntegrationClient } from "./integrations/stripe-client.js";
import type { GoogleCalendarIntegrationClient } from "./integrations/google_calendar-client.js";
import type { GoogleContactsIntegrationClient } from "./integrations/google_contacts-client.js";
import type { GoogleTasksIntegrationClient } from "./integrations/google_tasks-client.js";
import type { GoogleKeepIntegrationClient } from "./integrations/google_keep-client.js";
import type { GoogleAnalyticsIntegrationClient } from "./integrations/google_analytics-client.js";
import type { GoogleMeetIntegrationClient } from "./integrations/google_meet-client.js";
import type { OutlookIntegrationClient } from "./integrations/outlook-client.js";
import type { AirtableIntegrationClient } from "./integrations/airtable-client.js";
import type { TodoistIntegrationClient } from "./integrations/todoist-client.js";
import type { WhatsAppIntegrationClient } from "./integrations/whatsapp-client.js";
import type { CalcomIntegrationClient } from "./integrations/calcom-client.js";
import type { RampIntegrationClient } from "./integrations/ramp-client.js";
import type { OneDriveIntegrationClient } from "./integrations/onedrive-client.js";
import type { PlannerIntegrationClient } from "./integrations/planner-client.js";
import type { SharePointIntegrationClient } from "./integrations/sharepoint-client.js";
import type { GDocsIntegrationClient } from "./integrations/google_docs-client.js";
import type { GSheetsIntegrationClient } from "./integrations/google_sheets-client.js";
import type { GSlidesIntegrationClient } from "./integrations/google_slides-client.js";
import type { PolarIntegrationClient } from "./integrations/polar-client.js";
import type { FacebookIntegrationClient } from "./integrations/facebook-client.js";
import type { PlanetScaleIntegrationClient } from "./integrations/planetscale-client.js";
import type { FigmaIntegrationClient } from "./integrations/figma-client.js";
import type { IntercomIntegrationClient } from "./integrations/intercom-client.js";
import type { HubSpotIntegrationClient } from "./integrations/hubspot-client.js";
import type { InstagramIntegrationClient } from "./integrations/instagram-client.js";
import type { YouTubeIntegrationClient } from "./integrations/youtube-client.js";
import type { TikTokIntegrationClient } from "./integrations/tiktok-client.js";
import type { ThreadsIntegrationClient } from "./integrations/threads-client.js";
import type { LinkedInIntegrationClient } from "./integrations/linkedin-client.js";
import type { CursorIntegrationClient } from "./integrations/cursor-client.js";
import type { DatabricksIntegrationClient } from "./integrations/databricks-client.js";
import type { PostHogIntegrationClient } from "./integrations/posthog-client.js";
import type { PostmanIntegrationClient } from "./integrations/postman-client.js";
import type { PaperIntegrationClient } from "./integrations/paper-client.js";
import type { SentryIntegrationClient } from "./integrations/sentry-client.js";
import type { NetlifyIntegrationClient } from "./integrations/netlify-client.js";
import type { SupabaseIntegrationClient } from "./integrations/supabase-client.js";
import type { WebflowIntegrationClient } from "./integrations/webflow-client.js";
import type { MondayIntegrationClient } from "./integrations/monday-client.js";
import type { JiraIntegrationClient } from "./integrations/jira-client.js";
import type { TrelloIntegrationClient } from "./integrations/trello-client.js";
import type { ClickUpIntegrationClient } from "./integrations/clickup-client.js";
import type { WorkdayIntegrationClient } from "./integrations/workday-client.js";
import type { AlpacaIntegrationClient } from "./integrations/alpaca-client.js";
import type { Auth0IntegrationClient } from "./integrations/auth0-client.js";
import type { ResendIntegrationClient } from "./integrations/resend-client.js";
import type { ZapierIntegrationClient } from "./integrations/zapier-client.js";
import type { MailchimpIntegrationClient } from "./integrations/mailchimp-client.js";
import type { RedisIntegrationClient } from "./integrations/redis-client.js";
import type { ClerkIntegrationClient } from "./integrations/clerk-client.js";
import type { CloudflareIntegrationClient } from "./integrations/cloudflare-client.js";
import type { TypeformIntegrationClient } from "./integrations/typeform-client.js";
import type { ZoomIntegrationClient } from "./integrations/zoom-client.js";
import type { EtoroIntegrationClient } from "./integrations/etoro-client.js";
import type { XeroIntegrationClient } from "./integrations/xero-client.js";
import type { AttioIntegrationClient } from "./integrations/attio-client.js";
import type { GoogleChatIntegrationClient } from "./integrations/google_chat-client.js";
import type { ShopifyIntegrationClient } from "./integrations/shopify-client.js";
import type { ConvexIntegrationClient } from "./integrations/convex-client.js";
import type { NeonIntegrationClient } from "./integrations/neon-client.js";
import type { BinanceIntegrationClient } from "./integrations/binance-client.js";
import type { BetterStackIntegrationClient } from "./integrations/betterstack-client.js";
import type { AwsIntegrationClient } from "./integrations/aws-client.js";
import type { AstronomerIntegrationClient } from "./integrations/astronomer-client.js";
import type { PhantomIntegrationClient } from "./integrations/phantom-client.js";
import type { TldrawIntegrationClient } from "./integrations/tldraw-client.js";
import type { RedditIntegrationClient } from "./integrations/reddit-client.js";
import type { UpstashIntegrationClient } from "./integrations/upstash-client.js";
import type { WorkOSIntegrationClient } from "./integrations/workos-client.js";
import type { CanvaIntegrationClient } from "./integrations/canva-client.js";
import type { DiscordIntegrationClient } from "./integrations/discord-client.js";
import type { TelegramIntegrationClient } from "./integrations/telegram-client.js";
import type { BoxIntegrationClient } from "./integrations/box-client.js";
import type { PayPalIntegrationClient } from "./integrations/paypal-client.js";
import type { SquareIntegrationClient } from "./integrations/square-client.js";
import type { SpotifyIntegrationClient } from "./integrations/spotify-client.js";
import type { StravaIntegrationClient } from "./integrations/strava-client.js";
import type { AsanaIntegrationClient } from "./integrations/asana-client.js";
import type { ConfluenceIntegrationClient } from "./integrations/confluence-client.js";
import type { OktaIntegrationClient } from "./integrations/okta-client.js";
import type { QuickBooksIntegrationClient } from "./integrations/quickbooks-client.js";
import type { BitbucketIntegrationClient } from "./integrations/bitbucket-client.js";
import type { SmartThingsIntegrationClient } from "./integrations/smartthings-client.js";
import type { ExcelIntegrationClient } from "./integrations/excel-client.js";
import type { GDriveIntegrationClient } from "./integrations/google_drive-client.js";
import type { GitLabIntegrationClient } from "./integrations/gitlab-client.js";
import type { PowerPointIntegrationClient } from "./integrations/powerpoint-client.js";
import type { WordIntegrationClient } from "./integrations/word-client.js";
import type { GoogleAdsIntegrationClient } from "./integrations/google_ads-client.js";
import type { PinterestIntegrationClient } from "./integrations/pinterest-client.js";
import type { TwitchIntegrationClient } from "./integrations/twitch-client.js";
import type { XIntegrationClient } from "./integrations/x-client.js";
import type { EbayIntegrationClient } from "./integrations/ebay-client.js";
import type { MiroIntegrationClient } from "./integrations/miro-client.js";
import type { SmartsheetIntegrationClient } from "./integrations/smartsheet-client.js";
import type { DocusignIntegrationClient } from "./integrations/docusign-client.js";
import type { PipedriveIntegrationClient } from "./integrations/pipedrive-client.js";
import type { FreshserviceIntegrationClient } from "./integrations/freshservice-client.js";
import type { ZohoCrmIntegrationClient } from "./integrations/zoho_crm-client.js";
import type { ZohoMailIntegrationClient } from "./integrations/zoho_mail-client.js";
import type { ZohoDeskIntegrationClient } from "./integrations/zoho_desk-client.js";
import type { ZohoBooksIntegrationClient } from "./integrations/zoho_books-client.js";
import type { ZohoProjectsIntegrationClient } from "./integrations/zoho_projects-client.js";
import type { ZohoCampaignsIntegrationClient } from "./integrations/zoho_campaigns-client.js";
import type { ZohoAnalyticsIntegrationClient } from "./integrations/zoho_analytics-client.js";
import type { ZohoInvoiceIntegrationClient } from "./integrations/zoho_invoice-client.js";
import type { OuraIntegrationClient } from "./integrations/oura-client.js";
import type { WhoopIntegrationClient } from "./integrations/whoop-client.js";
import type { GarminIntegrationClient } from "./integrations/garmin-client.js";
import type { FitbitIntegrationClient } from "./integrations/fitbit-client.js";
import type { WithingsIntegrationClient } from "./integrations/withings-client.js";
import type { MapmyfitnessIntegrationClient } from "./integrations/mapmyfitness-client.js";
import type { MieleIntegrationClient } from "./integrations/miele-client.js";
import type { TeslaIntegrationClient } from "./integrations/tesla-client.js";
import type { TuyaIntegrationClient } from "./integrations/tuya-client.js";
import type { HomeConnectIntegrationClient } from "./integrations/home_connect-client.js";
import type { NetatmoIntegrationClient } from "./integrations/netatmo-client.js";
import type { PhilipsHueIntegrationClient } from "./integrations/philips_hue-client.js";
import type { GoogleHomeIntegrationClient } from "./integrations/google_home-client.js";
import type { SonosIntegrationClient } from "./integrations/sonos-client.js";
import type { RingIntegrationClient } from "./integrations/ring-client.js";
import type { KickIntegrationClient } from "./integrations/kick-client.js";
import type { DeezerIntegrationClient } from "./integrations/deezer-client.js";
import type { UberIntegrationClient } from "./integrations/uber-client.js";
import type { AmadeusIntegrationClient } from "./integrations/amadeus-client.js";
import type { ExpediaIntegrationClient } from "./integrations/expedia-client.js";
import type { EventbriteIntegrationClient } from "./integrations/eventbrite-client.js";
import type { MeetupIntegrationClient } from "./integrations/meetup-client.js";
import type { UniverseIntegrationClient } from "./integrations/universe-client.js";
import type { EtsyIntegrationClient } from "./integrations/etsy-client.js";
import type { AmazonIntegrationClient } from "./integrations/amazon-client.js";
import type { BigcommerceIntegrationClient } from "./integrations/bigcommerce-client.js";
import type { FoursquareIntegrationClient } from "./integrations/foursquare-client.js";
import type { UberEatsIntegrationClient } from "./integrations/uber_eats-client.js";
import type { WordpressIntegrationClient } from "./integrations/wordpress-client.js";
import type { ContentfulIntegrationClient } from "./integrations/contentful-client.js";
import type { CanvasLmsIntegrationClient } from "./integrations/canvas_lms-client.js";
import type { GoogleClassroomIntegrationClient } from "./integrations/google_classroom-client.js";
import type { MicrosoftGraphEducationIntegrationClient } from "./integrations/microsoft_graph_education-client.js";
import type { LeverIntegrationClient } from "./integrations/lever-client.js";
import type { GreenhouseIntegrationClient } from "./integrations/greenhouse-client.js";
import type { BamboohrIntegrationClient } from "./integrations/bamboohr-client.js";
import type { SnowflakeIntegrationClient } from "./integrations/snowflake-client.js";
import type { BigqueryIntegrationClient } from "./integrations/bigquery-client.js";
import type { LookerIntegrationClient } from "./integrations/looker-client.js";
import type { TableauIntegrationClient } from "./integrations/tableau-client.js";
import type { DropboxSignIntegrationClient } from "./integrations/dropbox_sign-client.js";
import type { AdobeAcrobatSignIntegrationClient } from "./integrations/adobe_acrobat_sign-client.js";
import type { PandadocIntegrationClient } from "./integrations/pandadoc-client.js";
import type { MetaAdsIntegrationClient } from "./integrations/meta_ads-client.js";
import type { MicrosoftAdsIntegrationClient } from "./integrations/microsoft_ads-client.js";
import type { TiktokBusinessIntegrationClient } from "./integrations/tiktok_business-client.js";
import type { AmazonAdsIntegrationClient } from "./integrations/amazon_ads-client.js";
import type { MoneybirdIntegrationClient } from "./integrations/moneybird-client.js";
import type { ExactOnlineIntegrationClient } from "./integrations/exact_online-client.js";
import type { SageIntegrationClient } from "./integrations/sage-client.js";
import type { FreeagentIntegrationClient } from "./integrations/freeagent-client.js";
import type { OneloginIntegrationClient } from "./integrations/onelogin-client.js";
import type { MicrosoftEntraIdIntegrationClient } from "./integrations/microsoft_entra_id-client.js";
import type { DhlIntegrationClient } from "./integrations/dhl-client.js";
import type { UpsIntegrationClient } from "./integrations/ups-client.js";
import type { FedexIntegrationClient } from "./integrations/fedex-client.js";
import type { PlaidIntegrationClient } from "./integrations/plaid-client.js";
import type { TruelayerIntegrationClient } from "./integrations/truelayer-client.js";
import type { TinkIntegrationClient } from "./integrations/tink-client.js";
import type { GocardlessIntegrationClient } from "./integrations/gocardless-client.js";
import type { CalendlyIntegrationClient } from "./integrations/calendly-client.js";
import type { KlaviyoIntegrationClient } from "./integrations/klaviyo-client.js";
import type { GoogleFormsIntegrationClient } from "./integrations/google_forms-client.js";
import type { FirebaseIntegrationClient } from "./integrations/firebase-client.js";
import type { MicrosoftToDoIntegrationClient } from "./integrations/microsoft_to_do-client.js";
import type { OnenoteIntegrationClient } from "./integrations/onenote-client.js";
import type { MicrosoftBookingsIntegrationClient } from "./integrations/microsoft_bookings-client.js";
import type { AzureDevopsIntegrationClient } from "./integrations/azure_devops-client.js";
import type { GooglePlayConsoleIntegrationClient } from "./integrations/google_play_console-client.js";
import type { SquarespaceIntegrationClient } from "./integrations/squarespace-client.js";
import type { ZohoPeopleIntegrationClient } from "./integrations/zoho_people-client.js";
import type { ZohoRecruitIntegrationClient } from "./integrations/zoho_recruit-client.js";
import type { ZohoSignIntegrationClient } from "./integrations/zoho_sign-client.js";
import type { ZohoWorkdriveIntegrationClient } from "./integrations/zoho_workdrive-client.js";
import type { ZohoCreatorIntegrationClient } from "./integrations/zoho_creator-client.js";
import type { ZohoInventoryIntegrationClient } from "./integrations/zoho_inventory-client.js";
import type { ZohoBillingIntegrationClient } from "./integrations/zoho_billing-client.js";
import type { ZohoWriterIntegrationClient } from "./integrations/zoho_writer-client.js";
import type { ZohoSprintsIntegrationClient } from "./integrations/zoho_sprints-client.js";
import type { ServerIntegrationClient } from "./integrations/server-client.js";
import { TriggerClient } from "./triggers/client.js";
import { OAuthManager } from "./oauth/manager.js";
import type {
  AuthStatus,
  OAuthCallbackParams,
  OAuthEventHandler,
  AuthStartedEvent,
  AuthCompleteEvent,
  AuthErrorEvent,
  AuthLogoutEvent,
  AuthDisconnectEvent,
} from "./oauth/types.js";

// Promise assimilation and object inspection should not become MCP calls.
const NON_TOOL_PROXY_PROPERTIES = new Set<PropertyKey>([
  "then",
  "catch",
  "finally",
  "constructor",
  "prototype",
  "toString",
  "valueOf",
  "toJSON",
  "inspect",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "__proto__",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__",
  "__esModule",
  Symbol.toStringTag,
  Symbol.toPrimitive,
  Symbol.iterator,
  Symbol.asyncIterator,
  Symbol.for("nodejs.util.inspect.custom"),
]);

function isToolProxyProperty(property: string | symbol): property is string {
  return typeof property === "string" && !NON_TOOL_PROXY_PROPERTIES.has(property);
}

/**
 * Simple EventEmitter implementation for OAuth events
 */
class SimpleEventEmitter {
  private handlers: Map<string, Set<OAuthEventHandler>> = new Map();

  on(event: string, handler: OAuthEventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: OAuthEventHandler): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  emit(event: string, payload: any): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          logger.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }
}

/**
 * MCP server URL
 */
const MCP_SERVER_URL = "https://mcp.integrate.dev/api/v1/mcp";

/**
 * Logger instances
 */
const logger = createLogger('MCPClient', CLIENT_LOG_CONTEXT);

/**
 * Client instance cache for singleton pattern
 */
const clientCache = new Map<string, MCPClientBase<any>>();

/**
 * Set of clients to cleanup on exit
 */
const cleanupClients = new Set<MCPClientBase<any>>();

/**
 * Whether cleanup handlers have been registered
 */
let cleanupHandlersRegistered = false;

/**
 * Tool invocation options
 */
export interface ToolInvocationOptions {
  /** Tool name */
  name: string;
  /** Tool arguments */
  arguments?: Record<string, unknown>;
}

/**
 * Extract all integration IDs from a integrations array as a union
 */
type ExtractIntegrationId<T> = T extends { id: infer Id } ? Id : never;
type IntegrationIds<TIntegrations extends readonly MCPIntegration[]> = ExtractIntegrationId<TIntegrations[number]>;

/**
 * Integration namespace type mapping - only includes properties for configured integrations
 * Uses a single mapped type to avoid intersection issues with IDE autocomplete
 */
type IntegrationClientMap = {
  github: GitHubIntegrationClient;
  gmail: GmailIntegrationClient;
  notion: NotionIntegrationClient;
  slack: SlackIntegrationClient;
  linear: LinearIntegrationClient;
  railway: RailwayIntegrationClient;
  vercel: VercelIntegrationClient;
  zendesk: ZendeskIntegrationClient;
  stripe: StripeIntegrationClient;
  google_calendar: GoogleCalendarIntegrationClient;
  google_contacts: GoogleContactsIntegrationClient;
  google_tasks: GoogleTasksIntegrationClient;
  google_keep: GoogleKeepIntegrationClient;
  google_analytics: GoogleAnalyticsIntegrationClient;
  google_meet: GoogleMeetIntegrationClient;
  outlook: OutlookIntegrationClient;
  airtable: AirtableIntegrationClient;
  todoist: TodoistIntegrationClient;
  whatsapp: WhatsAppIntegrationClient;
  calcom: CalcomIntegrationClient;
  ramp: RampIntegrationClient;
  onedrive: OneDriveIntegrationClient;
  planner: PlannerIntegrationClient;
  sharepoint: SharePointIntegrationClient;
  google_docs: GDocsIntegrationClient;
  google_sheets: GSheetsIntegrationClient;
  google_slides: GSlidesIntegrationClient;
  polar: PolarIntegrationClient;
  planetscale: PlanetScaleIntegrationClient;
  supabase: SupabaseIntegrationClient;
  facebook: FacebookIntegrationClient;
  figma: FigmaIntegrationClient;
  intercom: IntercomIntegrationClient;
  hubspot: HubSpotIntegrationClient;
  instagram: InstagramIntegrationClient;
  youtube: YouTubeIntegrationClient;
  tiktok: TikTokIntegrationClient;
  cursor: CursorIntegrationClient;
  databricks: DatabricksIntegrationClient;
  posthog: PostHogIntegrationClient;
  postman: PostmanIntegrationClient;
  sentry: SentryIntegrationClient;
  netlify: NetlifyIntegrationClient;
  webflow: WebflowIntegrationClient;
  jira: JiraIntegrationClient;
  clickup: ClickUpIntegrationClient;
  zapier: ZapierIntegrationClient;
  threads: ThreadsIntegrationClient;
  alpaca: AlpacaIntegrationClient;
  linkedin: LinkedInIntegrationClient;
  trello: TrelloIntegrationClient;
  monday: MondayIntegrationClient;
  resend: ResendIntegrationClient;
  mailchimp: MailchimpIntegrationClient;
  neon: NeonIntegrationClient;
  typeform: TypeformIntegrationClient;
  xero: XeroIntegrationClient;
  attio: AttioIntegrationClient;
  google_chat: GoogleChatIntegrationClient;
  shopify: ShopifyIntegrationClient;
  convex: ConvexIntegrationClient;
  etoro: EtoroIntegrationClient;
  binance: BinanceIntegrationClient;
  betterstack: BetterStackIntegrationClient;
  aws: AwsIntegrationClient;
  phantom: PhantomIntegrationClient;
  reddit: RedditIntegrationClient;
  zoom: ZoomIntegrationClient;
  clerk: ClerkIntegrationClient;
  auth0: Auth0IntegrationClient;
  workday: WorkdayIntegrationClient;
  redis: RedisIntegrationClient;
  upstash: UpstashIntegrationClient;
  tldraw: TldrawIntegrationClient;
  cloudflare: CloudflareIntegrationClient;
  paper: PaperIntegrationClient;
  workos: WorkOSIntegrationClient;
  astronomer: AstronomerIntegrationClient;
  canva: CanvaIntegrationClient;
  discord: DiscordIntegrationClient;
  telegram: TelegramIntegrationClient;
  box: BoxIntegrationClient;
  paypal: PayPalIntegrationClient;
  square: SquareIntegrationClient;
  spotify: SpotifyIntegrationClient;
  strava: StravaIntegrationClient;
  asana: AsanaIntegrationClient;
  confluence: ConfluenceIntegrationClient;
  okta: OktaIntegrationClient;
  quickbooks: QuickBooksIntegrationClient;
  bitbucket: BitbucketIntegrationClient;
  smartthings: SmartThingsIntegrationClient;
  google_ads: GoogleAdsIntegrationClient;
  pinterest: PinterestIntegrationClient;
  twitch: TwitchIntegrationClient;
  x: XIntegrationClient;
  ebay: EbayIntegrationClient;
  miro: MiroIntegrationClient;
  smartsheet: SmartsheetIntegrationClient;
  docusign: DocusignIntegrationClient;
  pipedrive: PipedriveIntegrationClient;
  freshservice: FreshserviceIntegrationClient;
  zoho_crm: ZohoCrmIntegrationClient;
  zoho_mail: ZohoMailIntegrationClient;
  zoho_desk: ZohoDeskIntegrationClient;
  zoho_books: ZohoBooksIntegrationClient;
  zoho_projects: ZohoProjectsIntegrationClient;
  zoho_campaigns: ZohoCampaignsIntegrationClient;
  zoho_analytics: ZohoAnalyticsIntegrationClient;
  zoho_invoice: ZohoInvoiceIntegrationClient;
  oura: OuraIntegrationClient;
  whoop: WhoopIntegrationClient;
  garmin: GarminIntegrationClient;
  fitbit: FitbitIntegrationClient;
  withings: WithingsIntegrationClient;
  mapmyfitness: MapmyfitnessIntegrationClient;
  miele: MieleIntegrationClient;
  tesla: TeslaIntegrationClient;
  tuya: TuyaIntegrationClient;
  home_connect: HomeConnectIntegrationClient;
  netatmo: NetatmoIntegrationClient;
  philips_hue: PhilipsHueIntegrationClient;
  google_home: GoogleHomeIntegrationClient;
  sonos: SonosIntegrationClient;
  ring: RingIntegrationClient;
  kick: KickIntegrationClient;
  deezer: DeezerIntegrationClient;
  uber: UberIntegrationClient;
  amadeus: AmadeusIntegrationClient;
  expedia: ExpediaIntegrationClient;
  eventbrite: EventbriteIntegrationClient;
  meetup: MeetupIntegrationClient;
  universe: UniverseIntegrationClient;
  etsy: EtsyIntegrationClient;
  amazon: AmazonIntegrationClient;
  bigcommerce: BigcommerceIntegrationClient;
  foursquare: FoursquareIntegrationClient;
  uber_eats: UberEatsIntegrationClient;
  wordpress: WordpressIntegrationClient;
  contentful: ContentfulIntegrationClient;
  canvas_lms: CanvasLmsIntegrationClient;
  google_classroom: GoogleClassroomIntegrationClient;
  microsoft_graph_education: MicrosoftGraphEducationIntegrationClient;
  lever: LeverIntegrationClient;
  greenhouse: GreenhouseIntegrationClient;
  bamboohr: BamboohrIntegrationClient;
  snowflake: SnowflakeIntegrationClient;
  bigquery: BigqueryIntegrationClient;
  looker: LookerIntegrationClient;
  tableau: TableauIntegrationClient;
  dropbox_sign: DropboxSignIntegrationClient;
  adobe_acrobat_sign: AdobeAcrobatSignIntegrationClient;
  pandadoc: PandadocIntegrationClient;
  meta_ads: MetaAdsIntegrationClient;
  microsoft_ads: MicrosoftAdsIntegrationClient;
  tiktok_business: TiktokBusinessIntegrationClient;
  amazon_ads: AmazonAdsIntegrationClient;
  moneybird: MoneybirdIntegrationClient;
  exact_online: ExactOnlineIntegrationClient;
  sage: SageIntegrationClient;
  freeagent: FreeagentIntegrationClient;
  onelogin: OneloginIntegrationClient;
  microsoft_entra_id: MicrosoftEntraIdIntegrationClient;
  dhl: DhlIntegrationClient;
  ups: UpsIntegrationClient;
  fedex: FedexIntegrationClient;
  plaid: PlaidIntegrationClient;
  truelayer: TruelayerIntegrationClient;
  tink: TinkIntegrationClient;
  gocardless: GocardlessIntegrationClient;
  calendly: CalendlyIntegrationClient;
  klaviyo: KlaviyoIntegrationClient;
  google_forms: GoogleFormsIntegrationClient;
  firebase: FirebaseIntegrationClient;
  microsoft_to_do: MicrosoftToDoIntegrationClient;
  onenote: OnenoteIntegrationClient;
  microsoft_bookings: MicrosoftBookingsIntegrationClient;
  azure_devops: AzureDevopsIntegrationClient;
  google_play_console: GooglePlayConsoleIntegrationClient;
  squarespace: SquarespaceIntegrationClient;
  zoho_people: ZohoPeopleIntegrationClient;
  zoho_recruit: ZohoRecruitIntegrationClient;
  zoho_sign: ZohoSignIntegrationClient;
  zoho_workdrive: ZohoWorkdriveIntegrationClient;
  zoho_creator: ZohoCreatorIntegrationClient;
  zoho_inventory: ZohoInventoryIntegrationClient;
  zoho_billing: ZohoBillingIntegrationClient;
  zoho_writer: ZohoWriterIntegrationClient;
  zoho_sprints: ZohoSprintsIntegrationClient;
  excel: ExcelIntegrationClient;
  google_drive: GDriveIntegrationClient;
  gitlab: GitLabIntegrationClient;
  powerpoint: PowerPointIntegrationClient;
  word: WordIntegrationClient;
};

type IntegrationNamespaces<TIntegrations extends readonly MCPIntegration[]> = {
  [K in Extract<IntegrationIds<TIntegrations>, keyof IntegrationClientMap>]: IntegrationClientMap[K];
};

/**
 * MCP Client Class
 * 
 * Provides type-safe access to MCP server tools with integration-based configuration.
 * Integration namespaces (github, gmail, etc.) are only available when configured.
 */
export type MCPClient<TIntegrations extends readonly MCPIntegration[] = readonly MCPIntegration[]> =
  MCPClientBase<TIntegrations> & IntegrationNamespaces<TIntegrations>;

/**
 * Base MCP Client Class (without integration namespaces)
 * Integration namespaces are added dynamically at runtime and via type intersection
 * @internal
 */
export class MCPClientBase<TIntegrations extends readonly MCPIntegration[] = readonly MCPIntegration[]> {
  private transport: HttpSessionTransport;
  private integrations: TIntegrations;
  private availableTools: Map<string, MCPTool> = new Map();
  private enabledToolNames: Set<string> = new Set();
  private initialized = false;
  private clientInfo: { name: string; version: string };
  private onReauthRequired?: ReauthHandler;
  private maxReauthRetries: number;
  private authState: Map<string, { authenticated: boolean; lastError?: AuthenticationError }> = new Map();
  private oauthManager: OAuthManager;
  private eventEmitter: SimpleEventEmitter = new SimpleEventEmitter();
  private sessionToken?: string;
  private apiRouteBase: string;
  private apiBaseUrl?: string;
  private databaseDetected: boolean = false;
  private _connectingPromise: Promise<void> | null = null;

  /**
   * Explicitly configured integrations passed to createMCPClient
   * Used by listConfiguredIntegrations to return only configured integrations
   * @internal
   */
  private __configuredIntegrations: TIntegrations;

  /**
   * Whether to fetch configured integrations from server
   * When true, listConfiguredIntegrations() queries the server
   * @internal
   */
  private __useServerConfig: boolean;

  /**
   * Promise that resolves when OAuth callback processing is complete
   * @internal Used by createMCPClient to store callback promise
   */
  oauthCallbackPromise?: Promise<void> | null;

  // Server namespace - always available for server-level tools
  public readonly server!: ServerIntegrationClient;

  // Trigger namespace - always available for scheduled tool executions
  public readonly trigger!: TriggerClient;

  constructor(config: MCPClientConfig<TIntegrations>) {
    this.transport = new HttpSessionTransport({
      url: config.serverUrl || MCP_SERVER_URL,
      headers: config.headers,
      timeout: config.timeout,
    });

    // Note: API key is only set server-side via createMCPServer()
    // Client-side instances should never have access to the API key

    // Determine OAuth API base and default redirect URI
    const oauthApiBase = config.oauthApiBase || '/api/integrate/oauth';

    // Determine API route base for tool calls
    this.apiRouteBase = config.apiRouteBase || '/api/integrate';

    // Store apiBaseUrl for cross-origin API calls (optional)
    this.apiBaseUrl = config.apiBaseUrl;

    // Get default redirect URI (uses apiBaseUrl if set, otherwise frontend origin)
    const defaultRedirectUri = this.getDefaultRedirectUri(oauthApiBase, this.apiBaseUrl);

    // Clone integrations and inject default redirectUri if not set
    this.integrations = config.integrations.map(integration => {
      if (integration.oauth && !integration.oauth.redirectUri) {
        return {
          ...integration,
          oauth: {
            ...integration.oauth,
            redirectUri: defaultRedirectUri,
          },
        };
      }
      return integration;
    }) as unknown as TIntegrations;

    // Store configured integrations explicitly for listConfiguredIntegrations
    // This ensures only integrations passed to createMCPClient are returned
    this.__configuredIntegrations = this.integrations;

    // Store useServerConfig flag (default: false)
    // When true, listConfiguredIntegrations() fetches from server instead of local config
    this.__useServerConfig = config.useServerConfig ?? false;

    this.clientInfo = config.clientInfo || {
      name: "integrate-sdk",
      version: "0.1.0",
    };
    this.onReauthRequired = config.onReauthRequired;
    this.maxReauthRetries = config.maxReauthRetries ?? 1;

    // Initialize OAuth manager with token callbacks (server-side only).
    // When the consumer also passed integration-level OAuth credentials,
    // forward them so the manager can transparently refresh expiring tokens
    // against the MCP server's /oauth/refresh endpoint.
    const refreshProviders: Record<string, { clientId: string; clientSecret?: string; config?: Record<string, unknown> }> = {};
    for (const integration of this.integrations as readonly any[]) {
      const oauth = integration?.oauth;
      if (oauth?.clientId && oauth?.provider) {
        refreshProviders[oauth.provider] = {
          clientId: oauth.clientId,
          clientSecret: oauth.clientSecret,
          config: oauth.config,
        };
      }
    }
    const mcpServerUrl = (config as any).serverUrl as string | undefined;
    this.oauthManager = new OAuthManager(
      oauthApiBase,
      config.oauthFlow,
      this.apiBaseUrl,
      {
        getProviderToken: (config as any).getProviderToken,
        setProviderToken: (config as any).setProviderToken,
        removeProviderToken: (config as any).removeProviderToken,
      },
      {
        providers: refreshProviders,
        mcpServerUrl,
        apiKey: (config as any).apiKey,
      }
    );

    this.setSessionToken(config.sessionToken || this.loadSessionTokenFromStorage());

    // Collect all enabled tool names from integrations
    for (const integration of this.integrations) {
      for (const toolName of integration.tools) {
        this.enabledToolNames.add(toolName);
      }

      // Initialize auth state for integrations with OAuth
      // Set to false initially, will be updated after tokens are loaded
      if (integration.oauth) {
        const provider = integration.oauth.provider;
        this.authState.set(provider, { authenticated: false });
      }
    }

    // Propagate configured integration IDs to server via header
    const integrationHeaderValue = this.getIntegrationHeaderValue();
    if (integrationHeaderValue && this.transport.setHeader) {
      this.transport.setHeader('X-Integrations', integrationHeaderValue);
    }

    // Get list of OAuth providers
    const providers = this.integrations
      .filter(p => p.oauth)
      .map(p => p.oauth!.provider);

    // Determine if we're using database callbacks or localStorage
    const usingDatabaseCallbacks = !!(config as any).getProviderToken;

    if (usingDatabaseCallbacks) {
      // Database callbacks: Load tokens asynchronously
      // This ensures isAuthorized() returns the correct value after tokens are loaded
      // Only update state if it hasn't been changed by other methods (e.g., authorize, reauthenticate)
      this.oauthManager.loadAllProviderTokens(providers).then(async () => {
        // Update auth state based on loaded tokens
        for (const integration of this.integrations) {
          if (integration.oauth) {
            const provider = integration.oauth.provider;
            try {
              // getProviderToken returns from cache after loadAllProviderTokens
              const tokenData = await this.oauthManager.getProviderToken(provider);
              if (tokenData?.sessionToken && !this.sessionToken) {
                this.setSessionToken(tokenData.sessionToken);
              }
              // Only update if state is still at initial false value (not changed by other methods)
              const currentState = this.authState.get(provider);
              if (currentState && !currentState.authenticated && !currentState.lastError) {
                this.authState.set(provider, { authenticated: !!tokenData });
              }
            } catch (error) {
              logger.error(`Failed to check token for ${provider}:`, error);
              // Only set to false if state hasn't been modified
              const currentState = this.authState.get(provider);
              if (currentState && !currentState.authenticated && !currentState.lastError) {
                this.authState.set(provider, { authenticated: false });
              }
            }
          }
        }
      }).catch(error => {
        logger.error('Failed to load provider tokens:', error);
      });
    } else {
      // Auto-load tokens from PROVIDER_TOKENS env var for sandbox/code execution environments.
      // This enables user integrations to work when tokens are injected via environment variables
      // (e.g. when code runs in a Vercel sandbox for code mode). Must happen before
      // loadAllProviderTokensSync so the auth-state update below picks up env var tokens.
      // Only applies when no database callbacks are configured (callbacks take precedence).
      this.oauthManager.loadTokensFromEnvVar();

      // IndexedDB: Load tokens asynchronously (IndexedDB operations are async)
      // Always load existing tokens first, even if there's an OAuth callback pending
      // This ensures any previously saved tokens are available immediately
      this.oauthManager.loadAllProviderTokensSync(providers);

      // Update auth state immediately based on loaded tokens (synchronously)
      for (const integration of this.integrations) {
        if (integration.oauth) {
          const provider = integration.oauth.provider;
          // Get token from cache synchronously (cache was just populated above)
          const tokenData = this.oauthManager.getProviderTokenFromCache(provider);
          if (tokenData) {
            if (tokenData.sessionToken && !this.sessionToken) {
              this.setSessionToken(tokenData.sessionToken);
            }
            this.authState.set(provider, { authenticated: true });
          }
        }
      }
    }

    // Initialize integration namespaces dynamically based on configuration
    const integrationIds = this.integrations.map(i => i.id);
    for (const id of integrationIds) {
      (this as any)[id] = this.createIntegrationProxy(id);
    }

    // Server namespace is always available
    this.server = this.createServerProxy() as any;

    // Trigger namespace is always available
    this.trigger = new TriggerClient({
      apiRouteBase: this.apiRouteBase,
      apiBaseUrl: this.apiBaseUrl,
      getHeaders: () => ({
        'X-Integrations': this.getIntegrationHeaderValue(),
      }),
    });

    // Initialize integrations
    this.initializeIntegrations();
  }

  /**
   * Get default redirect URI for OAuth flows
   * Uses apiBaseUrl if set (for backend redirect), otherwise window.location.origin
   * 
   * When apiBaseUrl is set, OAuth providers redirect to the backend callback route.
   * The backend then handles token exchange and redirects back to the frontend.
   * 
   * @param oauthApiBase - The OAuth API base path (e.g., '/api/integrate/oauth')
   * @param apiBaseUrl - Optional base URL for API routes (e.g., 'http://localhost:8080')
   * @returns Default redirect URI
   */
  private getDefaultRedirectUri(oauthApiBase: string, apiBaseUrl?: string): string {
    // Normalize the API base path and append '/callback'
    const normalizedPath = oauthApiBase.replace(/\/$/, ''); // Remove trailing slash if present
    const callbackPath = `${normalizedPath}/callback`;

    // If apiBaseUrl is set, use it for backend redirect flow
    if (apiBaseUrl) {
      const normalizedApiBaseUrl = apiBaseUrl.replace(/\/$/, '');
      return `${normalizedApiBaseUrl}${callbackPath}`;
    }

    // Only works in browser environment
    if (typeof window === 'undefined' || !window.location) {
      // Server-side fallback (shouldn't happen for client SDK)
      return 'http://localhost:3000/api/integrate/oauth/callback';
    }

    // Construct redirect URI from window.location.origin + OAuth API base path
    // This points to the frontend callback route
    const origin = window.location.origin;
    return `${origin}${callbackPath}`;
  }

  /**
   * Create a proxy for a integration namespace that intercepts method calls
   * and routes them to the appropriate tool
   * Returns undefined if the integration is not configured
   */
  private createIntegrationProxy(integrationId: string): any {
    // Check if this integration exists in the configured integrations
    const hasIntegration = this.integrations.some(integration => integration.id === integrationId);

    if (!hasIntegration) {
      return undefined;
    }

    return new Proxy({}, {
      get: (_target, methodName: string | symbol) => {
        if (!isToolProxyProperty(methodName)) return undefined;

        // Return a function that calls the tool
        return async (args?: Record<string, unknown>, options?: ToolCallOptions) => {
          // When routing through API handlers, skip ensureConnected
          // The tool will be validated by the server-side handler
          const toolName = methodToToolName(methodName, integrationId);
          return await this.callToolWithRetry(toolName, args, 0, options);
        };
      },
    });
  }

  /**
   * Get comma-separated integration IDs for header propagation
   */
  private getIntegrationHeaderValue(): string {
    return this.integrations.map(integration => integration.id).join(',');
  }

  /**
   * Create a proxy for the server namespace that handles server-level tools
   */
  private createServerProxy(): any {
    return new Proxy({}, {
      get: (_target, methodName: string | symbol) => {
        if (!isToolProxyProperty(methodName)) return undefined;

        // List configured integrations
        // Behavior depends on useServerConfig flag:
        // - useServerConfig: true (default client) → fetch from server
        // - useServerConfig: false (custom client) → return local config
        // - Server client (has API key) → always return local config
        // Optionally fetches full tool metadata from server when includeToolMetadata is true
        if (methodName === 'listConfiguredIntegrations') {
          return async (options?: { includeToolMetadata?: boolean }) => {
            // Check if this is a server-side client (has API key in transport)
            const transportHeaders = (this.transport as any).headers || {};
            const hasApiKey = !!transportHeaders['X-API-KEY'];

            // Use __configuredIntegrations which stores only explicitly configured integrations
            // For serverClient, __oauthConfig.integrations takes precedence (set by createMCPServer)
            const serverConfig = (this as any).__oauthConfig;
            const localIntegrations = serverConfig?.integrations || this.__configuredIntegrations;

            // Helper to format local integrations
            const formatLocalIntegrations = (integrations: readonly MCPIntegration[]) => ({
              integrations: integrations.map((integration: MCPIntegration) =>
                toConfiguredIntegrationSummary(integration)
              ),
            });

            // Server clients always use local config (they ARE the server)
            // Custom clients (useServerConfig: false) also use local config
            if (hasApiKey || !this.__useServerConfig) {
              // If includeToolMetadata is true and this is a server client with an API key,
              // read tool schemas directly from availableTools (populated by discoverTools during connect)
              if (options?.includeToolMetadata && hasApiKey) {
                await this.ensureConnected();

                const integrationsWithMetadata = (localIntegrations as readonly MCPIntegration[]).map((integration: MCPIntegration) => {
                  const toolMetadata = integration.tools
                    .map(toolName => this.availableTools.get(toolName))
                    .filter((tool): tool is MCPTool => !!tool);

                  return toConfiguredIntegrationWithToolMetadata(integration, toolMetadata);
                });

                return { integrations: integrationsWithMetadata };
              }

              // For browser clients (!hasApiKey) with includeToolMetadata, fall through to
              // the server fetch path which uses list_tools_by_integration via API handler
              if (options?.includeToolMetadata && !hasApiKey) {
                const { parallelWithLimit } = await import('./utils/concurrency.js');

                const integrationsWithMetadata = await parallelWithLimit(
                  localIntegrations,
                  async (integration: MCPIntegration) => {
                    try {
                      const response = await this.callServerToolInternal('list_tools_by_integration', {
                        integration: integration.id,
                      });

                      const toolMetadata = this.parseListToolsByIntegrationContent(
                        response.content
                      );

                      return toConfiguredIntegrationWithToolMetadata(integration, toolMetadata);
                    } catch (error) {
                      logger.error(`Failed to fetch tool metadata for ${integration.id}:`, error);
                      return toConfiguredIntegrationWithToolMetadata(integration, []);
                    }
                  },
                  3
                );

                return { integrations: integrationsWithMetadata };
              }

              // Return local data only (no server call)
              return formatLocalIntegrations(localIntegrations);
            }

            // Default client (useServerConfig: true) - fetch from server
            // This allows the default client to know what's actually configured server-side
            const url = this.apiBaseUrl
              ? `${this.apiBaseUrl}${this.apiRouteBase}/integrations`
              : `${this.apiRouteBase}/integrations`;

            try {
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              if (!response.ok) {
                // If server request fails, fall back to local config
                logger.error('Failed to fetch integrations from server, falling back to local config');
                return formatLocalIntegrations(localIntegrations);
              }

              const result = await response.json();

              if (result.integrations && Array.isArray(result.integrations)) {
                result.integrations = result.integrations.map((row: Record<string, unknown>) => ({
                  ...row,
                  ...integrationLibraryPresentationFields(row),
                }));
              }

              // If includeToolMetadata is true, enrich with tool metadata
              if (options?.includeToolMetadata && result.integrations) {
                const { parallelWithLimit } = await import('./utils/concurrency.js');

                const integrationsWithMetadata = await parallelWithLimit(
                  result.integrations,
                  async (integration: any) => {
                    try {
                      const metadataResponse = await this.callServerToolInternal('list_tools_by_integration', {
                        integration: integration.id,
                      });

                      const toolMetadata = this.parseListToolsByIntegrationContent(
                        metadataResponse.content
                      );

                      return {
                        ...integration,
                        ...integrationLibraryPresentationFields(integration as Record<string, unknown>),
                        toolMetadata,
                      };
                    } catch (error) {
                      logger.error(`Failed to fetch tool metadata for ${integration.id}:`, error);
                      return {
                        ...integration,
                        ...integrationLibraryPresentationFields(integration as Record<string, unknown>),
                        toolMetadata: [],
                      };
                    }
                  },
                  3
                );

                return { integrations: integrationsWithMetadata };
              }

              return result;
            } catch (error) {
              // If fetch fails entirely, fall back to local config
              logger.error('Failed to fetch integrations from server, falling back to local config:', error);
              return formatLocalIntegrations(localIntegrations);
            }
          };
        }

        // Return a function that calls the server tool directly
        return async (args?: Record<string, unknown>, options?: ToolCallOptions) => {
          // When routing through API handlers, skip ensureConnected
          const toolName = methodToToolName(methodName, "");
          // Remove leading underscore if present
          const finalToolName = toolName.startsWith("_") ? toolName.substring(1) : toolName;
          return await this.callServerToolInternal(finalToolName, args, options);
        };
      },
    });
  }

  /**
   * Internal implementation for calling server tools
   */
  private async callServerToolInternal(
    name: string,
    args?: Record<string, unknown>,
    options?: ToolCallOptions
  ): Promise<MCPToolCallResponse> {
    // When routing through API handlers, server-side validates tools
    try {
      // Route through API handler (server tools don't have providers)
      const response = await this.callToolThroughHandler(name, args, undefined, options);
      return response;
    } catch (error) {
      // For server tools, we don't have provider info, so just parse the error
      const parsedError = parseServerError(error, { toolName: name });
      throw parsedError;
    }
  }

  /**
   * Ensure the client is connected before making transport requests.
   * Safe to call concurrently — deduplicates in-flight connect() calls.
   * Only needed for server-side clients that use transport.sendRequest() directly.
   */
  private async ensureConnected(): Promise<void> {
    if (this.isConnected()) {
      return;
    }
    if (!this._connectingPromise) {
      this._connectingPromise = this.connect().finally(() => {
        this._connectingPromise = null;
      });
    }
    return this._connectingPromise;
  }

  /**
   * Initialize all integrations
   */
  private async initializeIntegrations(): Promise<void> {
    for (const integration of this.integrations) {
      if (integration.onInit) {
        await integration.onInit(this);
      }
    }
  }

  /**
   * Connect to the MCP server
   */
  async connect(): Promise<void> {
    // Call onBeforeConnect hooks
    for (const integration of this.integrations) {
      if (integration.onBeforeConnect) {
        await integration.onBeforeConnect(this);
      }
    }

    // Connect transport
    await this.transport.connect();

    // Initialize protocol
    await this.initialize();

    // Discover available tools
    await this.discoverTools();

    // Call onAfterConnect hooks
    for (const integration of this.integrations) {
      if (integration.onAfterConnect) {
        await integration.onAfterConnect(this);
      }
    }
  }

  /**
   * Initialize the MCP protocol
   */
  private async initialize(): Promise<MCPInitializeResponse> {
    const params: MCPInitializeParams = {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {},
      },
      clientInfo: this.clientInfo,
    };

    const response = await this.transport.sendRequest<MCPInitializeResponse>(
      MCPMethod.INITIALIZE,
      params
    );

    this.initialized = true;
    return response;
  }

  /**
   * Discover available tools from the server
   */
  private async discoverTools(): Promise<void> {
    let cursor: string | undefined;
    let totalDiscovered = 0;

    do {
      const response = await this.transport.sendRequest<MCPToolsListResponse>(
        MCPMethod.TOOLS_LIST,
        cursor ? { cursor } : undefined
      );

      for (const tool of response.tools) {
        this.availableTools.set(tool.name, tool);
      }

      totalDiscovered += response.tools.length;
      cursor = response.nextCursor;
    } while (cursor);

    const enabledCount = Array.from(this.availableTools.keys()).filter(name =>
      this.enabledToolNames.has(name)
    ).length;

    logger.debug(
      `Discovered ${totalDiscovered} tools, ${enabledCount} enabled by integrations`
    );
  }

  /**
   * @deprecated Use {@link MCPClientBase.callTool} instead. Alias retained for compatibility.
   */
  async _callToolByName(
    name: string,
    args?: Record<string, unknown>,
    options?: ToolCallOptions
  ): Promise<MCPToolCallResponse> {
    return await this.callTool(name, args, options);
  }

  /**
   * Call an enabled tool by its MCP tool name.
   */
  async callTool(
    name: string,
    args?: Record<string, unknown>,
    options?: ToolCallOptions
  ): Promise<MCPToolCallResponse> {
    return await this.callToolWithRetry(name, args, 0, options);
  }

  /**
   * Call any available tool on the server by name, bypassing integration restrictions
   * Useful for server-level tools like 'list_tools_by_integration' that don't belong to a specific integration
   * 
   * @example
   * ```typescript
   * // Call a server-level tool
   * const tools = await client.callServerTool('list_tools_by_integration', { 
   *   integration: 'github' 
   * });
   * ```
   */
  async callServerTool(
    name: string,
    args?: Record<string, unknown>
  ): Promise<MCPToolCallResponse> {
    // When routing through API handlers, no initialization required
    // The server-side handler will validate tools
    try {
      // Route through API handler (server tools don't have providers)
      const response = await this.callToolThroughHandler(name, args);
      return response;
    } catch (error) {
      // For server tools, we don't have provider info, so just parse the error
      const parsedError = parseServerError(error, { toolName: name });
      throw parsedError;
    }
  }

  /**
   * Call a tool through the API handler (server-side route) for browser clients,
   * or directly through transport for server-side clients with API keys
   */
  private async callToolThroughHandler(
    name: string,
    args?: Record<string, unknown>,
    provider?: string,
    options?: ToolCallOptions
  ): Promise<MCPToolCallResponse> {
    const integrationHeaders = this.getHeadersForTool(name);

    // Check if this is a server-side client (has API key in transport headers)
    const transportHeaders = (this.transport as any).headers || {};
    const hasApiKey = !!transportHeaders['X-API-KEY'];

    // Server-side clients with API key should call MCP server directly through transport
    if (hasApiKey) {
      // Ensure transport is connected before any direct sendRequest() call
      await this.ensureConnected();

      const temporaryHeaders = { ...integrationHeaders };

      // Add provider token to transport if available
      if (provider) {
        const tokenData = await this.oauthManager.getProviderToken(provider, undefined, options?.context);
        if (tokenData) {
          if (tokenData.sessionToken) {
            temporaryHeaders["Authorization"] = `Bearer ${tokenData.sessionToken}`;
            temporaryHeaders["X-Session-Token"] = tokenData.sessionToken;
          } else {
            temporaryHeaders["Authorization"] = `Bearer ${tokenData.accessToken}`;
          }
        }
      }

      const previousHeaders = new Map<string, string | undefined>();
      for (const [key, value] of Object.entries(temporaryHeaders)) {
        previousHeaders.set(key, transportHeaders[key]);
        this.transport.setHeader(key, value);
      }

      try {
        const result = await this.transport.sendRequest('tools/call', {
          name,
          arguments: args || {},
        });
        return result as MCPToolCallResponse;
      } finally {
        for (const [key, previousValue] of previousHeaders.entries()) {
          if (previousValue !== undefined) {
            this.transport.setHeader(key, previousValue);
          } else {
            this.transport.removeHeader(key);
          }
        }
      }
    }

    // Browser clients (no API key) - route through API handler
    // Construct URL: {apiBaseUrl}{apiRouteBase}/mcp
    // If apiBaseUrl is not set, use relative URL (same origin)
    const url = this.apiBaseUrl
      ? `${this.apiBaseUrl}${this.apiRouteBase}/mcp`
      : `${this.apiRouteBase}/mcp`;

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.sessionToken) {
      headers['Authorization'] = `Bearer ${this.sessionToken}`;
      headers['X-Session-Token'] = this.sessionToken;
    }

    const integrationsHeader = this.getIntegrationHeaderValue();
    if (integrationsHeader) {
      headers['X-Integrations'] = integrationsHeader;
    }

    Object.assign(headers, integrationHeaders);

    // Make request to API handler
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name,
        arguments: args,
      }),
    });

    // Check for X-Integrate-Use-Database header to auto-detect database usage
    if (!this.databaseDetected && response.headers.get('X-Integrate-Use-Database') === 'true') {
      this.oauthManager.setSkipLocalStorage(true);
      this.databaseDetected = true;
    }

    if (!response.ok) {
      // Try to parse error response
      let errorMessage = `Request failed: ${response.statusText}`;
      const error = new Error(errorMessage) as Error & { statusCode?: number; code?: number; data?: unknown; jsonrpcError?: unknown };
      error.statusCode = response.status;

      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = typeof errorData.error === 'string' ? errorData.error : errorData.error.message || errorMessage;
          error.message = errorMessage;
        }
        if (errorData.code) {
          error.code = errorData.code;
        }
        if (errorData.data) {
          error.data = errorData.data;
        }
        // Preserve JSON-RPC error structure if present
        if (errorData.error && typeof errorData.error === 'object') {
          error.jsonrpcError = errorData.error;
        }
      } catch {
        // If JSON parsing fails, use status text (already set)
      }

      throw error;
    }

    const result = await response.json();
    return result as MCPToolCallResponse;
  }

  /**
   * Internal method to call a tool with retry logic
   */
  private async callToolWithRetry(
    name: string,
    args?: Record<string, unknown>,
    retryCount = 0,
    options?: ToolCallOptions
  ): Promise<MCPToolCallResponse> {
    // When routing through API handlers, we don't need to check initialization
    // The server-side handler will validate tools and permissions
    if (!this.enabledToolNames.has(name)) {
      throw new Error(
        `Tool "${name}" is not enabled. Enable it by adding the appropriate integration.`
      );
    }

    // Get provider for this tool
    const provider = this.getProviderForTool(name);

    try {
      // Route through API handler instead of direct MCP server call
      const response = await this.callToolThroughHandler(name, args, provider, options);

      // Check for MCP-level error responses (isError flag on successful JSON-RPC responses)
      if (response.isError === true) {
        const errorText =
          response.content?.find((c) => c.type === "text")?.text ||
          "Tool returned an error response";
        throw new Error(errorText);
      }

      // Mark provider as authenticated on success
      if (provider) {
        this.authState.set(provider, { authenticated: true });
      }

      return response;
    } catch (error) {
      // Parse the error to determine if it's an auth error
      const parsedError = parseServerError(error, { toolName: name, provider });

      // Handle authentication errors with retry logic
      if (isAuthError(parsedError) && retryCount < this.maxReauthRetries) {
        // Update auth state
        if (provider) {
          this.authState.set(provider, {
            authenticated: false,
            lastError: parsedError,
          });
        }

        // Trigger re-authentication if handler is provided
        if (this.onReauthRequired && provider) {
          const reauthSuccess = await this.onReauthRequired({
            provider,
            error: parsedError,
            toolName: name,
          });

          if (reauthSuccess) {
            // Retry the tool call after successful re-authentication
            return await this.callToolWithRetry(name, args, retryCount + 1);
          }
        }
      }

      // If no handler or re-auth failed, throw the parsed error
      throw parsedError;
    }
  }

  /**
   * Get the OAuth provider for a given tool
   */
  private getProviderForTool(toolName: string): string | undefined {
    for (const integration of this.integrations) {
      if (integration.tools.includes(toolName) && integration.oauth) {
        return integration.oauth.provider;
      }
    }
    return undefined;
  }

  /**
   * Get static integration headers for a given tool.
   */
  private getHeadersForTool(toolName: string): Record<string, string> {
    for (const integration of this.integrations) {
      if (integration.tools.includes(toolName) && integration.getHeaders) {
        return integration.getHeaders();
      }
    }
    return {};
  }

  private parseListToolsByIntegrationContent(
    content: MCPToolCallResponse["content"]
  ): MCPTool[] {
    const tools: MCPTool[] = [];
    if (!content || !Array.isArray(content)) {
      return tools;
    }

    for (const item of content) {
      if (item.type === "text" && item.text) {
        tools.push(
          ...parseToolsFromListByIntegrationText(item.text, this.availableTools)
        );
      }
    }

    return tools;
  }

  /**
   * Get a tool by name
   */
  getTool(name: string): MCPTool | undefined {
    return this.availableTools.get(name);
  }

  /**
   * Get all available tools
   */
  getAvailableTools(): MCPTool[] {
    return Array.from(this.availableTools.values());
  }

  /**
   * Seed the local tool metadata cache without connecting to the MCP server.
   *
   * Serverless applications can persist tool metadata from a previous discovery
   * pass, then hydrate it on cold start so AI adapters can build tool schemas
   * without fanning out to list_tools_by_integration.
   */
  hydrateToolCache(tools: readonly MCPTool[]): void {
    for (const tool of tools) {
      if (tool?.name && tool.inputSchema) {
        this.availableTools.set(tool.name, tool);
      }
    }
  }

  /**
   * Return enabled tools from the local cache only.
   *
   * This never performs network requests. Use getEnabledToolsAsync() when
   * missing schemas should be fetched from the server.
   */
  getCachedEnabledTools(): MCPTool[] {
    return this.getEnabledTools();
  }

  /**
   * Set a custom HTTP header for all requests to the MCP server
   * 
   * @internal Used by createMCPServer() to set the API key header
   */
  setRequestHeader(key: string, value: string): void {
    this.transport.setHeader(key, value);
  }

  /**
   * Get all enabled tools (filtered by integrations)
   * 
   * Note: This returns tools from the local cache, which is only populated
   * after calling connect(). For tools with schemas without requiring connection,
   * use getEnabledToolsAsync() instead.
   * 
   * @returns Array of enabled tools (may be empty if not connected)
   */
  getEnabledTools(): MCPTool[] {
    return Array.from(this.availableTools.values()).filter((tool) =>
      this.enabledToolNames.has(tool.name)
    );
  }

  /**
   * Get all enabled tools with full schemas (async version)
   * 
   * This method ensures tools always have their inputSchema populated:
   * - If connected and tools are cached, returns from cache
   * - If not connected, fetches tools from server via API route
   * 
   * Use this method for AI integrations that need tool schemas.
   * 
   * @returns Promise resolving to array of enabled tools with schemas
   * 
   * @example
   * ```typescript
   * // Get tools for AI SDK integration
   * const tools = await client.getEnabledToolsAsync();
   * // tools[0].inputSchema is guaranteed to be populated
   * ```
   */
  async getEnabledToolsAsync(
    options?: EnabledToolsAsyncOptions
  ): Promise<MCPTool[]> {
    const targetIntegrationIds = await this.resolveTargetIntegrationIds(options);

    if (targetIntegrationIds.size === 0) {
      return [];
    }

    const filterToTargets = (tools: MCPTool[]) =>
      this.filterToolsToIntegrations(tools, targetIntegrationIds);

    const hasCompleteCache = () => {
      for (const integration of this.integrations) {
        if (!targetIntegrationIds.has(integration.id)) continue;
        for (const toolName of integration.tools) {
          if (!this.enabledToolNames.has(toolName)) continue;
          if (!this.availableTools.has(toolName)) return false;
        }
      }
      return this.availableTools.size > 0;
    };

    if (this.availableTools.size > 0 && hasCompleteCache()) {
      return filterToTargets(this.getEnabledTools());
    }

    const transportHeaders = (this.transport as any).headers || {};
    const hasApiKey = !!transportHeaders['X-API-KEY'];
    if (hasApiKey) {
      await this.ensureConnected();
    }

    const tools: MCPTool[] = [];
    const { parallelWithLimit } = await import('./utils/concurrency.js');
    const concurrency = options?.fetchConcurrency ?? 8;

    const integrationToolsResults = await parallelWithLimit(
      Array.from(targetIntegrationIds),
      async (integrationId: string) => {
        try {
          const response = await this.callServerToolInternal('list_tools_by_integration', {
            integration: integrationId,
          });

          const integrationTools = this.parseListToolsByIntegrationContent(
            response.content
          ).filter((tool) => tool.inputSchema);
          return integrationTools;
        } catch (error) {
          logger.error(`Failed to fetch tools for integration ${integrationId}:`, error);
          return [];
        }
      },
      concurrency
    );

    for (const integrationTools of integrationToolsResults) {
      tools.push(...integrationTools);
    }

    for (const tool of tools) {
      this.availableTools.set(tool.name, tool);
    }

    return filterToTargets(
      tools.filter((tool) => this.enabledToolNames.has(tool.name))
    );
  }

  private async resolveTargetIntegrationIds(
    options?: EnabledToolsAsyncOptions
  ): Promise<Set<string>> {
    const configuredIds = this.integrations.map((integration) => integration.id);
    const configuredSet = new Set(configuredIds);

    if (options?.integrationIds && options.integrationIds.length > 0) {
      return new Set(
        options.integrationIds.filter((id) => configuredSet.has(id))
      );
    }

    if (options?.connectedOnly && options.context?.userId) {
      const connected = await listConnectedProviders(
        configuredIds,
        (provider, email, context) =>
          this.oauthManager.getProviderToken(provider, email, context),
        options.context
      );
      return new Set(connected);
    }

    return configuredSet;
  }

  private filterToolsToIntegrations(
    tools: MCPTool[],
    integrationIds: Set<string>
  ): MCPTool[] {
    if (integrationIds.size === 0) {
      return [];
    }

    const allowedNames = new Set<string>();
    for (const integration of this.integrations) {
      if (!integrationIds.has(integration.id)) continue;
      for (const toolName of integration.tools) {
        allowedNames.add(toolName);
      }
    }

    return tools.filter(
      (tool) =>
        this.enabledToolNames.has(tool.name) && allowedNames.has(tool.name)
    );
  }

  /**
   * Get OAuth configuration for a integration
   */
  getOAuthConfig(integrationId: string): OAuthConfig | undefined {
    const integration = this.integrations.find((p) => p.id === integrationId);
    return integration?.oauth;
  }

  /**
   * Get all OAuth configurations
   */
  getAllOAuthConfigs(): Map<string, OAuthConfig> {
    const configs = new Map<string, OAuthConfig>();
    for (const integration of this.integrations) {
      if (integration.oauth) {
        configs.set(integration.id, integration.oauth);
      }
    }
    return configs;
  }

  /**
   * Register a message handler
   */
  onMessage(
    handler: (message: unknown) => void
  ): () => void {
    return this.transport.onMessage(handler);
  }

  /**
   * Add event listener for OAuth events
   * 
   * @param event - Event type to listen for
   * @param handler - Handler function to call when event is emitted
   * 
   * @example
   * ```typescript
   * client.on('auth:complete', ({ provider, sessionToken }) => {
   *   console.log(`${provider} authorized!`);
   * });
   * 
   * client.on('auth:disconnect', ({ provider }) => {
   *   console.log(`${provider} disconnected`);
   * });
   * 
   * client.on('auth:logout', () => {
   *   console.log('User logged out from all services');
   * });
   * ```
   */
  on(event: 'auth:started', handler: OAuthEventHandler<AuthStartedEvent>): void;
  on(event: 'auth:complete', handler: OAuthEventHandler<AuthCompleteEvent>): void;
  on(event: 'auth:error', handler: OAuthEventHandler<AuthErrorEvent>): void;
  on(event: 'auth:disconnect', handler: OAuthEventHandler<AuthDisconnectEvent>): void;
  on(event: 'auth:logout', handler: OAuthEventHandler<AuthLogoutEvent>): void;
  on(event: string, handler: OAuthEventHandler): void {
    this.eventEmitter.on(event, handler);
  }

  /**
   * Remove event listener for OAuth events
   * 
   * @param event - Event type to stop listening for
   * @param handler - Handler function to remove
   */
  off(event: 'auth:started', handler: OAuthEventHandler<AuthStartedEvent>): void;
  off(event: 'auth:complete', handler: OAuthEventHandler<AuthCompleteEvent>): void;
  off(event: 'auth:error', handler: OAuthEventHandler<AuthErrorEvent>): void;
  off(event: 'auth:disconnect', handler: OAuthEventHandler<AuthDisconnectEvent>): void;
  off(event: 'auth:logout', handler: OAuthEventHandler<AuthLogoutEvent>): void;
  off(event: string, handler: OAuthEventHandler): void {
    this.eventEmitter.off(event, handler);
  }

  private loadSessionTokenFromStorage(): string | undefined {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return undefined;
    }

    try {
      return window.sessionStorage.getItem('integrate_session_token') || undefined;
    } catch {
      return undefined;
    }
  }

  private setSessionToken(sessionToken?: string): void {
    this.sessionToken = sessionToken;

    if (sessionToken) {
      this.transport.setHeader('X-Session-Token', sessionToken);
    } else {
      this.transport.removeHeader('X-Session-Token');
    }

    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        if (sessionToken) {
          window.sessionStorage.setItem('integrate_session_token', sessionToken);
        } else {
          window.sessionStorage.removeItem('integrate_session_token');
        }
      } catch {
        // Ignore storage errors and keep the in-memory token.
      }
    }
  }


  /**
   * Clear the persisted session token and all stored provider tokens
   * Also updates authState to reflect that all providers are disconnected
   */
  clearSessionToken(): void {
    this.setSessionToken(undefined);
    this.oauthManager.clearAllProviderTokens();

    // Update authState to reflect that tokens are cleared
    for (const integration of this.integrations) {
      if (integration.oauth) {
        const provider = integration.oauth.provider;
        this.authState.set(provider, { authenticated: false });
      }
    }
  }

  /**
   * Disconnect all accounts for a specific OAuth provider
   * Removes authorization for all accounts of a provider while keeping other providers connected
   * 
   * When using database callbacks (server-side), this will delete all tokens from the database for the provider.
   * When using client-side storage (no callbacks), this only clears tokens from IndexedDB
   * and does not make any server calls.
   * 
   * When using database callbacks (server-side), provide context to delete
   * the correct user's tokens from the database.
   * 
   * @param provider - Provider name to disconnect (e.g., 'github', 'gmail')
   * @param context - Optional user context (userId, organizationId, etc.) for multi-tenant apps
   * 
   * @example
   * ```typescript
   * // Client-side usage (no context needed, no server calls)
   * await client.disconnectProvider('github');
   * // All GitHub tokens are cleared from IndexedDB
   * 
   * // Check if still authorized
   * const isAuthorized = await client.isAuthorized('github'); // false
   * ```
   * 
   * @example
   * ```typescript
   * // Server-side usage with context (multi-tenant)
   * const context = await getSessionContext(request);
   * await client.disconnectProvider('github', context);
   * // All GitHub tokens are now deleted from database for the specific user
   * ```
   */
  async disconnectProvider(provider: string, context?: MCPContext): Promise<void> {
    // Verify the provider exists in integrations
    const integration = this.integrations.find(p => p.oauth?.provider === provider);

    if (!integration?.oauth) {
      throw new Error(`No OAuth configuration found for provider: ${provider}`);
    }

    try {
      // Disconnect all accounts for the provider (handles database callbacks if configured, otherwise client-side only)
      // Pass context so removeProviderToken callback can delete the correct user's tokens
      await this.oauthManager.disconnectProvider(provider, context);

      // Reset authentication state for this provider only
      this.authState.set(provider, { authenticated: false });

      // Emit disconnect event for this provider
      this.eventEmitter.emit('auth:disconnect', { provider });
    } catch (error) {
      // Emit error event
      this.eventEmitter.emit('auth:error', {
        provider,
        error: error as Error
      });
      throw error;
    }

    // Note: We don't clear the session token since other providers may still be using it
    // The session on the server side will still exist for other providers
  }

  /**
   * Disconnect a specific account for a provider
   * Removes authorization for a single account while keeping other accounts connected
   * 
   * When using database callbacks (server-side), this will delete the token from the database.
   * When using client-side storage (no callbacks), this only clears the token from IndexedDB
   * and does not make any server calls.
   * 
   * @param provider - Provider name (e.g., 'github', 'gmail')
   * @param email - Email of the account to disconnect
   * @param context - Optional user context (userId, organizationId, etc.) for multi-tenant apps
   * 
   * @example
   * ```typescript
   * // Disconnect specific account
   * await client.disconnectAccount('github', 'user@example.com');
   * 
   * // Check if account is still authorized
   * const isAuthorized = await client.isAuthorized('github', 'user@example.com'); // false
   * ```
   */
  async disconnectAccount(provider: string, email: string, context?: MCPContext): Promise<void> {
    // Verify the provider exists in integrations
    const integration = this.integrations.find(p => p.oauth?.provider === provider);

    if (!integration?.oauth) {
      throw new Error(`No OAuth configuration found for provider: ${provider}`);
    }

    try {
      // Disconnect the specific account
      await this.oauthManager.disconnectAccount(provider, email, context);

      // Check if there are any remaining accounts for this provider
      const accounts = await this.oauthManager.listAccounts(provider);
      if (accounts.length === 0) {
        // No more accounts, update auth state
        this.authState.set(provider, { authenticated: false });
      }

      // Emit disconnect event for this provider
      this.eventEmitter.emit('auth:disconnect', { provider });
    } catch (error) {
      // Emit error event
      this.eventEmitter.emit('auth:error', {
        provider,
        error: error as Error
      });
      throw error;
    }
  }

  /**
   * List all connected accounts for a provider
   * Returns information about all accounts that have been authorized for the provider
   * 
   * @param provider - Provider name (e.g., 'github', 'gmail')
   * @returns Array of account information including email, accountId, and token details
   * 
   * @example
   * ```typescript
   * // List all GitHub accounts
   * const accounts = await client.listAccounts('github');
   * console.log('Connected accounts:', accounts);
   * // [
   * //   { email: 'user1@example.com', accountId: 'github_abc123', ... },
   * //   { email: 'user2@example.com', accountId: 'github_def456', ... }
   * // ]
   * 
   * // Disconnect a specific account
   * if (accounts.length > 0) {
   *   await client.disconnectAccount('github', accounts[0].email);
   * }
   * ```
   */
  async listAccounts(provider: string): Promise<import('./oauth/types.js').AccountInfo[]> {
    return await this.oauthManager.listAccounts(provider);
  }

  /**
   * Logout and terminate all OAuth connections
   * Clears all session tokens, pending OAuth state, and resets authentication state for all providers
   * 
   * @example
   * ```typescript
   * // Logout from all providers
   * await client.logout();
   * 
   * // User needs to authorize again for all providers
   * await client.authorize('github');
   * await client.authorize('gmail');
   * ```
   */
  async logout(): Promise<void> {
    // Clear session token from storage and manager
    this.clearSessionToken();

    // Clear all pending OAuth flows
    this.oauthManager.clearAllPendingAuths();

    // Reset authentication state for all providers
    this.authState.clear();

    // Re-initialize auth state as unauthenticated
    for (const integration of this.integrations) {
      if (integration.oauth) {
        this.authState.set(integration.oauth.provider, { authenticated: false });
      }
    }

    // Emit logout event
    this.eventEmitter.emit('auth:logout', {});
  }

  /**
   * Disconnect from the server
   */
  async disconnect(): Promise<void> {
    // Call onDisconnect hooks
    for (const integration of this.integrations) {
      if (integration.onDisconnect) {
        await integration.onDisconnect(this);
      }
    }

    await this.transport.disconnect();
    this.initialized = false;
  }

  /**
   * Check if client is connected
   */
  isConnected(): boolean {
    return this.transport.isConnected();
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get authentication state for a specific provider
   */
  getAuthState(provider: string): { authenticated: boolean; lastError?: AuthenticationError } | undefined {
    return this.authState.get(provider);
  }

  /**
   * Check if a specific provider is authenticated
   */
  isProviderAuthenticated(provider: string): boolean {
    return this.authState.get(provider)?.authenticated ?? false;
  }

  /**
   * Check if a provider is authorized via OAuth
   * Checks the current token status and updates the cache accordingly.
   * Returns the authorization status that is automatically updated when
   * authorize() or disconnectProvider() are called
   * 
   * Automatically waits for any pending OAuth callback to complete, ensuring
   * the auth state is always up-to-date, even immediately after OAuth redirects
   * 
   * When using database callbacks (server-side), provide context to check
   * the correct user's token. Without context, it will check without user
   * identification (works for single-user scenarios).
   * 
   * @param provider - Provider name (github, gmail, etc.)
   * @param email - Optional email to check specific account authorization
   * @param context - Optional user context (userId, organizationId, etc.) for multi-tenant apps
   * @returns Promise that resolves to authorization status
   * 
   * @example
   * ```typescript
   * // Client-side usage (no context needed)
   * const isAuthorized = await client.isAuthorized('github');
   * if (!isAuthorized) {
   *   await client.authorize('github');
   *   // isAuthorized is now automatically true
   *   console.log(await client.isAuthorized('github')); // true
   * }
   * ```
   * 
   * @example
   * ```typescript
   * // Check specific account
   * const isAuthorized = await client.isAuthorized('github', 'user@example.com');
   * ```
   * 
   * @example
   * ```typescript
   * // Server-side usage with context
   * const context = await getSessionContext(request);
   * const isAuthorized = await client.isAuthorized('github', undefined, context);
   * ```
   */
  async isAuthorized(provider: string, email?: string, context?: MCPContext): Promise<boolean> {
    // Wait for any pending OAuth callback to complete first
    if (this.oauthCallbackPromise) {
      await this.oauthCallbackPromise;
      this.oauthCallbackPromise = null; // Clear it after first use
    }

    // Check current token status and update cache
    // Note: This method only checks token existence - it does NOT clear tokens from IndexedDB
    // or make any server calls. Token clearing should be done via disconnectProvider or disconnectAccount.
    // Pass context to getProviderToken so it can retrieve the correct user's token from database
    try {
      const tokenData = await this.oauthManager.getProviderToken(provider, email, context);
      const isAuthenticated = !!tokenData;

      // Update the cache with current value
      const currentState = this.authState.get(provider);
      if (currentState) {
        currentState.authenticated = isAuthenticated;
        // Clear lastError if we now have a valid token
        if (isAuthenticated) {
          currentState.lastError = undefined;
        }
      } else {
        // Initialize state if it doesn't exist
        this.authState.set(provider, { authenticated: isAuthenticated });
      }

      return isAuthenticated;
    } catch (error) {
      // If there's an error checking the token, update cache to false
      const currentState = this.authState.get(provider);
      if (currentState) {
        currentState.authenticated = false;
      } else {
        this.authState.set(provider, { authenticated: false });
      }
      return false;
    }
  }

  /**
   * Get list of all authorized providers
   * Returns cached authorization status for all configured OAuth providers
   * 
   * Automatically waits for any pending OAuth callback to complete
   * 
   * @returns Promise that resolves to array of authorized provider names
   * 
   * @example
   * ```typescript
   * const authorized = await client.authorizedProviders();
   * console.log('Authorized services:', authorized); // ['github', 'gmail']
   * 
   * // Check if specific service is in the list
   * if (authorized.includes('github')) {
   *   const repos = await client.github.listOwnRepos({});
   * }
   * ```
   */
  async authorizedProviders(): Promise<string[]> {
    // Wait for any pending OAuth callback to complete first
    if (this.oauthCallbackPromise) {
      await this.oauthCallbackPromise;
      this.oauthCallbackPromise = null; // Clear it after first use
    }

    const authorized: string[] = [];

    // Check each integration with OAuth config
    for (const integration of this.integrations) {
      if (integration.oauth) {
        const provider = integration.oauth.provider;
        if (this.authState.get(provider)?.authenticated) {
          authorized.push(provider);
        }
      }
    }

    return authorized;
  }

  /**
   * Get detailed authorization status for a provider
   * 
   * @param provider - Provider name
   * @param email - Optional email to check specific account status
   * @returns Full authorization status including scopes and expiration
   */
  async getAuthorizationStatus(provider: string, email?: string): Promise<AuthStatus> {
    return await this.oauthManager.checkAuthStatus(provider, email);
  }

  /**
   * Initiate OAuth authorization flow for a provider
   * Opens authorization URL in popup or redirects based on configuration
   * 
   * @param provider - Provider name (github, gmail, etc.)
   * @param options - Optional configuration for the authorization flow
   * @param options.returnUrl - URL to redirect to after OAuth completion (for redirect mode)
   * @param options.useExistingConnection - If true and a connection exists, skip OAuth and use existing token. If false or undefined, proceed with OAuth flow (allows creating new account even if one exists)
   * 
   * @example
   * ```typescript
   * // Basic usage - popup flow
   * await client.authorize('github');
   * 
   * // Redirect flow with custom return URL
   * await client.authorize('github', { 
   *   returnUrl: '/marketplace/github' 
   * });
   * 
   * // Auto-detect current location
   * await client.authorize('github', { 
   *   returnUrl: window.location.pathname 
   * });
   * 
   * // Use existing connection if available
   * await client.authorize('github', { 
   *   useExistingConnection: true 
   * });
   * 
   * // Force new connection (default behavior)
   * await client.authorize('github', { 
   *   useExistingConnection: false 
   * });
   * ```
   */
  async authorize(provider: string, options?: { returnUrl?: string; useExistingConnection?: boolean }): Promise<void> {
    const integration = this.integrations.find(p => p.oauth?.provider === provider);

    if (!integration?.oauth) {
      const error = new Error(`No OAuth configuration found for provider: ${provider}`);
      this.eventEmitter.emit('auth:error', { provider, error });
      throw error;
    }

    // Check if we should use existing connection
    if (options?.useExistingConnection) {
      const authStatus = await this.oauthManager.checkAuthStatus(provider);

      if (authStatus.authorized) {
        // Connection exists, use it without OAuth flow
        const tokenData = await this.oauthManager.getProviderToken(provider);

        if (tokenData) {
          // Emit auth:complete event with existing token
          this.eventEmitter.emit('auth:complete', {
            provider,
            sessionToken: tokenData.sessionToken || this.sessionToken,
            accessToken: tokenData.accessToken,
            expiresAt: tokenData.expiresAt
          });

          // Update auth state
          this.authState.set(provider, { authenticated: true });
        }

        // Return early, skipping OAuth flow
        return;
      }
      // If useExistingConnection is true but no connection exists, fall through to OAuth flow
    }

    // Emit auth:started event
    this.eventEmitter.emit('auth:started', { provider });

    try {
      await this.oauthManager.initiateFlow(provider, integration.oauth, options?.returnUrl);

      // Get the provider token after authorization
      const tokenData = await this.oauthManager.getProviderToken(provider);

      if (tokenData) {
        // Emit auth:complete event
        this.eventEmitter.emit('auth:complete', {
          provider,
          sessionToken: tokenData.sessionToken || this.sessionToken,
          accessToken: tokenData.accessToken,
          expiresAt: tokenData.expiresAt
        });
      }

      // Update auth state
      this.authState.set(provider, { authenticated: true });
    } catch (error) {
      this.eventEmitter.emit('auth:error', { provider, error: error as Error });
      throw error;
    }
  }

  /**
   * Handle OAuth callback after user authorization
   * Call this from your OAuth callback page with code and state from URL
   * 
   * @param params - Callback parameters containing code and state
   * 
   * @example
   * ```typescript
   * // In your callback route (e.g., /oauth/callback)
   * const params = new URLSearchParams(window.location.search);
   * await client.handleOAuthCallback({
   *   code: params.get('code')!,
   *   state: params.get('state')!
   * });
   * 
   * // Now you can use the client
   * const repos = await client.github.listOwnRepos({});
   * ```
   */
  async handleOAuthCallback(params: OAuthCallbackParams): Promise<void> {
    try {
      // If tokenData is provided (backend redirect flow), use it directly
      // Otherwise, exchange code for token
      const result = params.tokenData
        ? await this.oauthManager.handleCallbackWithToken(params.code, params.state, params.tokenData)
        : await this.oauthManager.handleCallback(params.code, params.state);

      if (result.sessionToken) {
        this.setSessionToken(result.sessionToken);
      }

      // Update auth state for this specific provider
      this.authState.set(result.provider, { authenticated: true });

      // Emit auth:complete event for the provider
      this.eventEmitter.emit('auth:complete', {
        provider: result.provider,
        sessionToken: result.sessionToken || this.sessionToken,
        accessToken: result.accessToken,
        expiresAt: result.expiresAt
      });
    } catch (error) {
      // Emit error event (we don't know which provider, so use generic)
      this.eventEmitter.emit('auth:error', {
        provider: 'unknown',
        error: error as Error
      });
      throw error;
    }
  }

  /**
   * Get access token for a specific provider
   * Useful for making direct API calls or storing tokens
   * 
   * @param provider - Provider name (e.g., 'github', 'gmail')
   * @param email - Optional email to get specific account token
   * @param context - Optional user context (userId, organizationId, etc.) for multi-tenant apps
   * @returns Provider token data or undefined if not authorized
   */
  async getProviderToken(provider: string, email?: string, context?: MCPContext): Promise<import('./oauth/types.js').ProviderTokenData | undefined> {
    return await this.oauthManager.getProviderToken(provider, email, context);
  }

  /**
   * Set provider token manually
   * Use this if you have an existing provider token
   * Pass null to delete the token
   * 
   * @param provider - Provider name
   * @param tokenData - Provider token data, or null to delete
   * @param email - Optional email to store specific account token
   * @param context - Optional user context (userId, organizationId, etc.) for multi-tenant apps
   */
  async setProviderToken(provider: string, tokenData: import('./oauth/types.js').ProviderTokenData | null, email?: string, context?: MCPContext): Promise<void> {
    await this.oauthManager.setProviderToken(provider, tokenData, email, context);

    // Update authState based on whether token is being set or deleted
    if (tokenData === null) {
      // Token is being deleted - update authState to reflect disconnection
      this.authState.set(provider, { authenticated: false });
    } else {
      // Token is being set - update authState to reflect connection
      this.authState.set(provider, { authenticated: true });
    }
  }

  /**
   * Get all provider tokens
   * Returns a map of provider names to access tokens
   * Useful for server-side usage where you need to pass tokens from client to server
   * 
   * Note: This returns tokens from the in-memory cache. For fresh data from database,
   * ensure tokens are loaded first via loadAllProviderTokens or individual getProviderToken calls.
   * 
   * @returns Record of provider names to access tokens
   * 
   * @example
   * ```typescript
   * // Client-side: Get all tokens to send to server
   * const tokens = client.getAllProviderTokens();
   * // { github: 'ghp_...', gmail: 'ya29...' }
   * 
   * // Send to server
   * await fetch('/api/ai', {
   *   method: 'POST',
   *   headers: {
   *     'x-integrate-tokens': JSON.stringify(tokens)
   *   },
   *   body: JSON.stringify({ prompt: 'Create a GitHub issue' })
   * });
   * ```
   */
  getAllProviderTokens(): Record<string, string> {
    const tokens: Record<string, string> = {};
    const allTokens = this.oauthManager.getAllProviderTokens();

    for (const [provider, tokenData] of allTokens.entries()) {
      tokens[provider] = tokenData.accessToken;
    }

    return tokens;
  }

  /**
   * Manually trigger re-authentication for a specific provider
   * Useful if you want to proactively refresh tokens
   */
  async reauthenticate(provider: string): Promise<boolean> {
    const state = this.authState.get(provider);
    if (!state) {
      throw new Error(`Provider "${provider}" not found in configured integrations`);
    }

    if (!this.onReauthRequired) {
      throw new Error("No re-authentication handler configured. Set onReauthRequired in client config.");
    }

    const lastError = state.lastError || new (await import("./errors.js")).AuthenticationError(
      "Manual re-authentication requested",
      undefined,
      provider
    );

    const success = await this.onReauthRequired({
      provider,
      error: lastError,
    });

    if (success) {
      this.authState.set(provider, { authenticated: true });
    }

    return success;
  }
}

/**
 * Register cleanup handlers for graceful shutdown
 */
function registerCleanupHandlers() {
  if (cleanupHandlersRegistered) return;
  cleanupHandlersRegistered = true;

  const cleanup = async () => {
    const clients = Array.from(cleanupClients);
    cleanupClients.clear();

    await Promise.all(
      clients.map(async (client) => {
        try {
          if (client.isConnected()) {
            await client.disconnect();
          }
        } catch (error) {
          logger.error('Error disconnecting client:', error);
        }
      })
    );
  };

  // Only register signal handlers in proper Node.js environments
  // Check for process.on and process.exit to avoid issues with bundlers/edge runtimes
  if (typeof process !== 'undefined' && typeof process.on === 'function' && typeof process.exit === 'function') {
    try {
      process.on('SIGINT', async () => {
        await cleanup();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await cleanup();
        process.exit(0);
      });

      process.on('beforeExit', async () => {
        await cleanup();
      });
    } catch (error) {
      // Silently ignore if we can't register handlers (e.g., in bundlers/edge runtimes)
    }
  }
}

/**
 * Generate a cache key for a client configuration
 */
function generateCacheKey<TIntegrations extends readonly MCPIntegration[]>(
  config: MCPClientConfig<TIntegrations>
): string {
  // Create a stable key based on configuration
  const parts = [
    config.serverUrl || 'default',
    config.clientInfo?.name || 'integrate-sdk',
    config.clientInfo?.version || '0.1.0',
    JSON.stringify(config.integrations.map(p => ({ id: p.id, tools: p.tools }))),
    JSON.stringify(config.headers || {}),
    config.timeout?.toString() || '30000',
  ];
  return parts.join('|');
}

/**
 * Create a new MCP Client instance (CLIENT-SIDE)
 * 
 * By default, uses singleton pattern and lazy connection:
 * - Returns cached instance if one exists with same configuration
 * - Automatically connects on first method call
 * - Automatically cleans up on process exit
 * 
 * ⚠️ For server-side usage with API key, use createMCPServer() instead.
 * 
 * @example
 * ```typescript
 * // Client-side usage (no API key)
 * const client = createMCPClient({
 *   integrations: [
 *     githubIntegration({ clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID }),
 *   ],
 * });
 * 
 * // No need to call connect()!
 * const repos = await client.github.listOwnRepos({});
 * 
 * // No need to call disconnect()! (auto-cleanup on exit)
 * ```
 * 
 * @example
 * ```typescript
 * // Manual connection mode (original behavior)
 * const client = createMCPClient({
 *   integrations: [githubIntegration({ clientId: '...' })],
 *   connectionMode: 'manual',
 *   singleton: false,
 * });
 * 
 * await client.connect();
 * const repos = await client.github.listOwnRepos({});
 * await client.disconnect();
 * ```
 */
export function createMCPClient<TIntegrations extends readonly MCPIntegration[]>(
  config: MCPClientConfig<TIntegrations>
): MCPClient<TIntegrations> {
  // Initialize logger based on debug flag (client context only)
  setLogLevel(config.debug ? 'debug' : 'error', CLIENT_LOG_CONTEXT);

  const useSingleton = config.singleton ?? true;
  const connectionMode = config.connectionMode ?? 'lazy';
  const autoCleanup = config.autoCleanup ?? true;

  // Check cache for existing instance
  if (useSingleton) {
    const cacheKey = generateCacheKey(config);
    const existing = clientCache.get(cacheKey);

    if (existing && existing.isConnected()) {
      return existing as MCPClient<TIntegrations>;
    }

    // Remove stale entry if exists
    if (existing) {
      clientCache.delete(cacheKey);
      cleanupClients.delete(existing);
    }

    // Create new instance
    const client = new MCPClientBase(config) as MCPClient<TIntegrations>;
    clientCache.set(cacheKey, client);

    if (autoCleanup) {
      cleanupClients.add(client);
      registerCleanupHandlers();
    }

    // Eager connection if requested
    if (connectionMode === 'eager') {
      // Connect asynchronously, don't block
      client.connect().catch((error) => {
        logger.error('Failed to connect client:', error);
      });
    }

    // Automatically handle OAuth callback if enabled
    if (config.autoHandleOAuthCallback !== false) {
      processOAuthCallbackFromHash(client, config.oauthCallbackErrorBehavior);
    }

    return client;
  } else {
    // Non-singleton: create fresh instance
    const client = new MCPClientBase(config) as MCPClient<TIntegrations>;

    if (autoCleanup) {
      cleanupClients.add(client);
      registerCleanupHandlers();
    }

    // Eager connection if requested
    if (connectionMode === 'eager') {
      client.connect().catch((error) => {
        logger.error('Failed to connect client:', error);
      });
    }

    // Automatically handle OAuth callback if enabled
    // This is done synchronously to ensure tokens are loaded before client is used
    if (config.autoHandleOAuthCallback !== false) {
      client.oauthCallbackPromise = processOAuthCallbackFromHash(client, config.oauthCallbackErrorBehavior);
    }

    return client;
  }
}

/**
 * Process OAuth callback from URL hash fragment
 * Automatically detects and processes #oauth_callback={...} in the URL
 * Returns a promise that resolves when callback processing is complete
 */
function processOAuthCallbackFromHash(
  client: MCPClientBase<any>,
  errorBehavior?: { mode: 'silent' | 'console' | 'redirect'; redirectUrl?: string }
): Promise<void> | null {
  // Only run in browser environment with proper window.location
  if (typeof window === 'undefined' || !window.location) {
    return null;
  }

  // Default to silent mode
  const mode = errorBehavior?.mode || 'silent';

  try {
    const hash = window.location.hash;

    // Check if hash contains oauth_callback parameter
    if (hash && hash.includes('oauth_callback=')) {
      // Parse the hash
      const hashParams = new URLSearchParams(hash.substring(1));
      const oauthCallbackData = hashParams.get('oauth_callback');

      if (oauthCallbackData) {
        // Decode and parse the callback data
        const callbackParams = JSON.parse(decodeURIComponent(oauthCallbackData));

        // Validate that we have code and state
        if (callbackParams.code && callbackParams.state) {
          // Process the callback and return the promise
          // If tokenData is present (backend redirect flow), use it directly
          // Otherwise, handleOAuthCallback will exchange code for token
          return client.handleOAuthCallback(callbackParams).then(() => {
            // Clean up URL hash after successful callback
            if (mode !== 'redirect' || !errorBehavior?.redirectUrl) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }).catch((error) => {
            // Handle error based on configured behavior
            if (mode === 'console') {
              logger.error('Failed to process OAuth callback:', error);
            } else if (mode === 'redirect' && errorBehavior?.redirectUrl) {
              // Redirect to error page
              window.location.href = errorBehavior.redirectUrl;
              return; // Don't clean up hash, let the redirect happen
            }
            // 'silent' mode: do nothing, just clean up hash
            if (mode !== 'redirect' || !errorBehavior?.redirectUrl) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          });
        }
      }
    }
  } catch (error) {
    // Handle parsing errors based on configured behavior
    if (mode === 'console') {
      logger.error('Failed to process OAuth callback from hash:', error);
    } else if (mode === 'redirect' && errorBehavior?.redirectUrl) {
      window.location.href = errorBehavior.redirectUrl;
      return null;
    }
    // 'silent' mode: suppress error

    // Clean up URL hash on error (unless redirecting)
    try {
      if (mode !== 'redirect' || !errorBehavior?.redirectUrl) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  return null;
}

/**
 * Clear the client cache and disconnect all cached clients
 * Useful for testing or when you need to force recreation of clients
 * 
 * @example
 * ```typescript
 * // In test teardown
 * afterAll(async () => {
 *   await clearClientCache();
 * });
 * ```
 */
export async function clearClientCache(): Promise<void> {
  const clients = Array.from(clientCache.values());
  clientCache.clear();

  await Promise.all(
    clients.map(async (client) => {
      try {
        if (client.isConnected()) {
          await client.disconnect();
        }
      } catch (error) {
        logger.error('Error disconnecting client during cache clear:', error);
      }
    })
  );
}
