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

export { telegramIntegration } from "./integrations/telegram.js";
export type { TelegramIntegrationOptions, TelegramTools, TelegramIntegrationClient } from "./integrations/telegram.js";

export { boxIntegration } from "./integrations/box.js";
export type { BoxIntegrationOptions, BoxTools, BoxIntegrationClient } from "./integrations/box.js";

export { paypalIntegration } from "./integrations/paypal.js";
export type { PayPalIntegrationConfig, PayPalTools, PayPalIntegrationClient } from "./integrations/paypal.js";

export { squareIntegration } from "./integrations/square.js";
export type { SquareIntegrationConfig, SquareTools, SquareScopes, SquareIntegrationClient } from "./integrations/square.js";

export { spotifyIntegration } from "./integrations/spotify.js";
export type { SpotifyIntegrationConfig, SpotifyTools, SpotifyScopes, SpotifyIntegrationClient } from "./integrations/spotify.js";

export { stravaIntegration } from "./integrations/strava.js";
export type { StravaIntegrationConfig, StravaTools, StravaScopes, StravaIntegrationClient } from "./integrations/strava.js";

export { asanaIntegration } from "./integrations/asana.js";
export type { AsanaIntegrationConfig, AsanaTools, AsanaIntegrationClient } from "./integrations/asana.js";

export { confluenceIntegration } from "./integrations/confluence.js";
export type { ConfluenceIntegrationConfig, ConfluenceTools, ConfluenceScopes, ConfluenceIntegrationClient } from "./integrations/confluence.js";

export { oktaIntegration } from "./integrations/okta.js";
export type { OktaIntegrationConfig, OktaTools, OktaScopes, OktaIntegrationClient } from "./integrations/okta.js";

export { quickbooksIntegration } from "./integrations/quickbooks.js";
export type { QuickBooksIntegrationConfig, QuickBooksTools, QuickBooksScopes, QuickBooksIntegrationClient } from "./integrations/quickbooks.js";

export { bitbucketIntegration } from "./integrations/bitbucket.js";
export type { BitbucketIntegrationConfig, BitbucketTools, BitbucketScopes, BitbucketIntegrationClient } from "./integrations/bitbucket.js";

export { smartthingsIntegration } from "./integrations/smartthings.js";
export type { SmartThingsIntegrationConfig, SmartThingsTools, SmartThingsScopes, SmartThingsIntegrationClient } from "./integrations/smartthings.js";

export { googleAdsIntegration } from "./integrations/google_ads.js";
export type { GoogleAdsIntegrationConfig, GoogleAdsTools, GoogleAdsScopes, GoogleAdsIntegrationClient } from "./integrations/google_ads.js";

export { pinterestIntegration } from "./integrations/pinterest.js";
export type { PinterestIntegrationConfig, PinterestTools, PinterestScopes, PinterestIntegrationClient } from "./integrations/pinterest.js";

export { twitchIntegration } from "./integrations/twitch.js";
export type { TwitchIntegrationConfig, TwitchTools, TwitchScopes, TwitchIntegrationClient } from "./integrations/twitch.js";

export { xIntegration } from "./integrations/x.js";
export type { XIntegrationConfig, XTools, XScopes, XIntegrationClient } from "./integrations/x.js";

export { ebayIntegration } from "./integrations/ebay.js";
export type { EbayIntegrationConfig, EbayTools, EbayScopes, EbayIntegrationClient } from "./integrations/ebay.js";

export { miroIntegration } from "./integrations/miro.js";
export type { MiroIntegrationConfig, MiroTools, MiroScopes, MiroIntegrationClient } from "./integrations/miro.js";

export { smartsheetIntegration } from "./integrations/smartsheet.js";
export type { SmartsheetIntegrationConfig, SmartsheetTools, SmartsheetScopes, SmartsheetIntegrationClient } from "./integrations/smartsheet.js";

export { docusignIntegration } from "./integrations/docusign.js";
export type { DocusignIntegrationConfig, DocusignTools, DocusignScopes, DocusignIntegrationClient } from "./integrations/docusign.js";

export { pipedriveIntegration } from "./integrations/pipedrive.js";
export type { PipedriveIntegrationConfig, PipedriveTools, PipedriveScopes, PipedriveIntegrationClient } from "./integrations/pipedrive.js";

export { freshserviceIntegration } from "./integrations/freshservice.js";
export type { FreshserviceIntegrationConfig, FreshserviceTools, FreshserviceScopes, FreshserviceIntegrationClient } from "./integrations/freshservice.js";

export { zohoCrmIntegration } from "./integrations/zoho_crm.js";
export type { ZohoCrmIntegrationConfig, ZohoCrmTools, ZohoCrmScopes, ZohoCrmIntegrationClient } from "./integrations/zoho_crm.js";

export { zohoMailIntegration } from "./integrations/zoho_mail.js";
export type { ZohoMailIntegrationConfig, ZohoMailTools, ZohoMailScopes, ZohoMailIntegrationClient } from "./integrations/zoho_mail.js";

export { zohoDeskIntegration } from "./integrations/zoho_desk.js";
export type { ZohoDeskIntegrationConfig, ZohoDeskTools, ZohoDeskScopes, ZohoDeskIntegrationClient } from "./integrations/zoho_desk.js";

export { zohoBooksIntegration } from "./integrations/zoho_books.js";
export type { ZohoBooksIntegrationConfig, ZohoBooksTools, ZohoBooksScopes, ZohoBooksIntegrationClient } from "./integrations/zoho_books.js";

export { zohoProjectsIntegration } from "./integrations/zoho_projects.js";
export type { ZohoProjectsIntegrationConfig, ZohoProjectsTools, ZohoProjectsScopes, ZohoProjectsIntegrationClient } from "./integrations/zoho_projects.js";

export { zohoCampaignsIntegration } from "./integrations/zoho_campaigns.js";
export type { ZohoCampaignsIntegrationConfig, ZohoCampaignsTools, ZohoCampaignsScopes, ZohoCampaignsIntegrationClient } from "./integrations/zoho_campaigns.js";

export { zohoAnalyticsIntegration } from "./integrations/zoho_analytics.js";
export type { ZohoAnalyticsIntegrationConfig, ZohoAnalyticsTools, ZohoAnalyticsScopes, ZohoAnalyticsIntegrationClient } from "./integrations/zoho_analytics.js";

export { zohoInvoiceIntegration } from "./integrations/zoho_invoice.js";
export type { ZohoInvoiceIntegrationConfig, ZohoInvoiceTools, ZohoInvoiceScopes, ZohoInvoiceIntegrationClient } from "./integrations/zoho_invoice.js";

export { ouraIntegration } from "./integrations/oura.js";
export type { OuraIntegrationConfig, OuraTools, OuraScopes, OuraIntegrationClient } from "./integrations/oura.js";
export { whoopIntegration } from "./integrations/whoop.js";
export type { WhoopIntegrationConfig, WhoopTools, WhoopScopes, WhoopIntegrationClient } from "./integrations/whoop.js";
export { garminIntegration } from "./integrations/garmin.js";
export type { GarminIntegrationConfig, GarminTools, GarminScopes, GarminIntegrationClient } from "./integrations/garmin.js";
export { fitbitIntegration } from "./integrations/fitbit.js";
export type { FitbitIntegrationConfig, FitbitTools, FitbitScopes, FitbitIntegrationClient } from "./integrations/fitbit.js";
export { withingsIntegration } from "./integrations/withings.js";
export type { WithingsIntegrationConfig, WithingsTools, WithingsScopes, WithingsIntegrationClient } from "./integrations/withings.js";
export { mapmyfitnessIntegration } from "./integrations/mapmyfitness.js";
export type { MapmyfitnessIntegrationConfig, MapmyfitnessTools, MapmyfitnessScopes, MapmyfitnessIntegrationClient } from "./integrations/mapmyfitness.js";
export { mieleIntegration } from "./integrations/miele.js";
export type { MieleIntegrationConfig, MieleTools, MieleScopes, MieleIntegrationClient } from "./integrations/miele.js";
export { teslaIntegration } from "./integrations/tesla.js";
export type { TeslaIntegrationConfig, TeslaTools, TeslaScopes, TeslaIntegrationClient } from "./integrations/tesla.js";
export { tuyaIntegration } from "./integrations/tuya.js";
export type { TuyaIntegrationConfig, TuyaTools, TuyaScopes, TuyaIntegrationClient } from "./integrations/tuya.js";
export { homeConnectIntegration } from "./integrations/home_connect.js";
export type { HomeConnectIntegrationConfig, HomeConnectTools, HomeConnectScopes, HomeConnectIntegrationClient } from "./integrations/home_connect.js";
export { netatmoIntegration } from "./integrations/netatmo.js";
export type { NetatmoIntegrationConfig, NetatmoTools, NetatmoScopes, NetatmoIntegrationClient } from "./integrations/netatmo.js";
export { philipsHueIntegration } from "./integrations/philips_hue.js";
export type { PhilipsHueIntegrationConfig, PhilipsHueTools, PhilipsHueScopes, PhilipsHueIntegrationClient } from "./integrations/philips_hue.js";
export { googleHomeIntegration } from "./integrations/google_home.js";
export type { GoogleHomeIntegrationConfig, GoogleHomeTools, GoogleHomeScopes, GoogleHomeIntegrationClient } from "./integrations/google_home.js";
export { sonosIntegration } from "./integrations/sonos.js";
export type { SonosIntegrationConfig, SonosTools, SonosScopes, SonosIntegrationClient } from "./integrations/sonos.js";
export { ringIntegration } from "./integrations/ring.js";
export type { RingIntegrationConfig, RingTools, RingScopes, RingIntegrationClient } from "./integrations/ring.js";
export { kickIntegration } from "./integrations/kick.js";
export type { KickIntegrationConfig, KickTools, KickScopes, KickIntegrationClient } from "./integrations/kick.js";
export { deezerIntegration } from "./integrations/deezer.js";
export type { DeezerIntegrationConfig, DeezerTools, DeezerScopes, DeezerIntegrationClient } from "./integrations/deezer.js";
export { uberIntegration } from "./integrations/uber.js";
export type { UberIntegrationConfig, UberTools, UberScopes, UberIntegrationClient } from "./integrations/uber.js";
export { amadeusIntegration } from "./integrations/amadeus.js";
export type { AmadeusIntegrationConfig, AmadeusTools, AmadeusScopes, AmadeusIntegrationClient } from "./integrations/amadeus.js";
export { expediaIntegration } from "./integrations/expedia.js";
export type { ExpediaIntegrationConfig, ExpediaTools, ExpediaScopes, ExpediaIntegrationClient } from "./integrations/expedia.js";
export { eventbriteIntegration } from "./integrations/eventbrite.js";
export type { EventbriteIntegrationConfig, EventbriteTools, EventbriteScopes, EventbriteIntegrationClient } from "./integrations/eventbrite.js";
export { meetupIntegration } from "./integrations/meetup.js";
export type { MeetupIntegrationConfig, MeetupTools, MeetupScopes, MeetupIntegrationClient } from "./integrations/meetup.js";
export { universeIntegration } from "./integrations/universe.js";
export type { UniverseIntegrationConfig, UniverseTools, UniverseScopes, UniverseIntegrationClient } from "./integrations/universe.js";
export { etsyIntegration } from "./integrations/etsy.js";
export type { EtsyIntegrationConfig, EtsyTools, EtsyScopes, EtsyIntegrationClient } from "./integrations/etsy.js";
export { amazonIntegration } from "./integrations/amazon.js";
export type { AmazonIntegrationConfig, AmazonTools, AmazonScopes, AmazonIntegrationClient } from "./integrations/amazon.js";
export { bigcommerceIntegration } from "./integrations/bigcommerce.js";
export type { BigcommerceIntegrationConfig, BigcommerceTools, BigcommerceScopes, BigcommerceIntegrationClient } from "./integrations/bigcommerce.js";
export { foursquareIntegration } from "./integrations/foursquare.js";
export type { FoursquareIntegrationConfig, FoursquareTools, FoursquareScopes, FoursquareIntegrationClient } from "./integrations/foursquare.js";
export { uberEatsIntegration } from "./integrations/uber_eats.js";
export type { UberEatsIntegrationConfig, UberEatsTools, UberEatsScopes, UberEatsIntegrationClient } from "./integrations/uber_eats.js";
export { wordpressIntegration } from "./integrations/wordpress.js";
export type { WordpressIntegrationConfig, WordpressTools, WordpressScopes, WordpressIntegrationClient } from "./integrations/wordpress.js";
export { contentfulIntegration } from "./integrations/contentful.js";
export type { ContentfulIntegrationConfig, ContentfulTools, ContentfulScopes, ContentfulIntegrationClient } from "./integrations/contentful.js";
export { canvasLmsIntegration } from "./integrations/canvas_lms.js";
export type { CanvasLmsIntegrationConfig, CanvasLmsTools, CanvasLmsScopes, CanvasLmsIntegrationClient } from "./integrations/canvas_lms.js";
export { googleClassroomIntegration } from "./integrations/google_classroom.js";
export type { GoogleClassroomIntegrationConfig, GoogleClassroomTools, GoogleClassroomScopes, GoogleClassroomIntegrationClient } from "./integrations/google_classroom.js";
export { microsoftGraphEducationIntegration } from "./integrations/microsoft_graph_education.js";
export type { MicrosoftGraphEducationIntegrationConfig, MicrosoftGraphEducationTools, MicrosoftGraphEducationScopes, MicrosoftGraphEducationIntegrationClient } from "./integrations/microsoft_graph_education.js";
export { leverIntegration } from "./integrations/lever.js";
export type { LeverIntegrationConfig, LeverTools, LeverScopes, LeverIntegrationClient } from "./integrations/lever.js";
export { greenhouseIntegration } from "./integrations/greenhouse.js";
export type { GreenhouseIntegrationConfig, GreenhouseTools, GreenhouseScopes, GreenhouseIntegrationClient } from "./integrations/greenhouse.js";
export { bamboohrIntegration } from "./integrations/bamboohr.js";
export type { BamboohrIntegrationConfig, BamboohrTools, BamboohrScopes, BamboohrIntegrationClient } from "./integrations/bamboohr.js";
export { snowflakeIntegration } from "./integrations/snowflake.js";
export type { SnowflakeIntegrationConfig, SnowflakeTools, SnowflakeScopes, SnowflakeIntegrationClient } from "./integrations/snowflake.js";
export { bigqueryIntegration } from "./integrations/bigquery.js";
export type { BigqueryIntegrationConfig, BigqueryTools, BigqueryScopes, BigqueryIntegrationClient } from "./integrations/bigquery.js";
export { lookerIntegration } from "./integrations/looker.js";
export type { LookerIntegrationConfig, LookerTools, LookerScopes, LookerIntegrationClient } from "./integrations/looker.js";
export { tableauIntegration } from "./integrations/tableau.js";
export type { TableauIntegrationConfig, TableauTools, TableauScopes, TableauIntegrationClient } from "./integrations/tableau.js";
export { dropboxSignIntegration } from "./integrations/dropbox_sign.js";
export type { DropboxSignIntegrationConfig, DropboxSignTools, DropboxSignScopes, DropboxSignIntegrationClient } from "./integrations/dropbox_sign.js";
export { adobeAcrobatSignIntegration } from "./integrations/adobe_acrobat_sign.js";
export type { AdobeAcrobatSignIntegrationConfig, AdobeAcrobatSignTools, AdobeAcrobatSignScopes, AdobeAcrobatSignIntegrationClient } from "./integrations/adobe_acrobat_sign.js";
export { pandadocIntegration } from "./integrations/pandadoc.js";
export type { PandadocIntegrationConfig, PandadocTools, PandadocScopes, PandadocIntegrationClient } from "./integrations/pandadoc.js";
export { metaAdsIntegration } from "./integrations/meta_ads.js";
export type { MetaAdsIntegrationConfig, MetaAdsTools, MetaAdsScopes, MetaAdsIntegrationClient } from "./integrations/meta_ads.js";
export { microsoftAdsIntegration } from "./integrations/microsoft_ads.js";
export type { MicrosoftAdsIntegrationConfig, MicrosoftAdsTools, MicrosoftAdsScopes, MicrosoftAdsIntegrationClient } from "./integrations/microsoft_ads.js";
export { tiktokBusinessIntegration } from "./integrations/tiktok_business.js";
export type { TiktokBusinessIntegrationConfig, TiktokBusinessTools, TiktokBusinessScopes, TiktokBusinessIntegrationClient } from "./integrations/tiktok_business.js";
export { amazonAdsIntegration } from "./integrations/amazon_ads.js";
export type { AmazonAdsIntegrationConfig, AmazonAdsTools, AmazonAdsScopes, AmazonAdsIntegrationClient } from "./integrations/amazon_ads.js";
export { moneybirdIntegration } from "./integrations/moneybird.js";
export type { MoneybirdIntegrationConfig, MoneybirdTools, MoneybirdScopes, MoneybirdIntegrationClient } from "./integrations/moneybird.js";
export { exactOnlineIntegration } from "./integrations/exact_online.js";
export type { ExactOnlineIntegrationConfig, ExactOnlineTools, ExactOnlineScopes, ExactOnlineIntegrationClient } from "./integrations/exact_online.js";
export { sageIntegration } from "./integrations/sage.js";
export type { SageIntegrationConfig, SageTools, SageScopes, SageIntegrationClient } from "./integrations/sage.js";
export { freeagentIntegration } from "./integrations/freeagent.js";
export type { FreeagentIntegrationConfig, FreeagentTools, FreeagentScopes, FreeagentIntegrationClient } from "./integrations/freeagent.js";
export { oneloginIntegration } from "./integrations/onelogin.js";
export type { OneloginIntegrationConfig, OneloginTools, OneloginScopes, OneloginIntegrationClient } from "./integrations/onelogin.js";
export { microsoftEntraIdIntegration } from "./integrations/microsoft_entra_id.js";
export type { MicrosoftEntraIdIntegrationConfig, MicrosoftEntraIdTools, MicrosoftEntraIdScopes, MicrosoftEntraIdIntegrationClient } from "./integrations/microsoft_entra_id.js";
export { dhlIntegration } from "./integrations/dhl.js";
export type { DhlIntegrationConfig, DhlTools, DhlScopes, DhlIntegrationClient } from "./integrations/dhl.js";
export { upsIntegration } from "./integrations/ups.js";
export type { UpsIntegrationConfig, UpsTools, UpsScopes, UpsIntegrationClient } from "./integrations/ups.js";
export { fedexIntegration } from "./integrations/fedex.js";
export type { FedexIntegrationConfig, FedexTools, FedexScopes, FedexIntegrationClient } from "./integrations/fedex.js";
export { plaidIntegration } from "./integrations/plaid.js";
export type { PlaidIntegrationConfig, PlaidTools, PlaidScopes, PlaidIntegrationClient } from "./integrations/plaid.js";
export { truelayerIntegration } from "./integrations/truelayer.js";
export type { TruelayerIntegrationConfig, TruelayerTools, TruelayerScopes, TruelayerIntegrationClient } from "./integrations/truelayer.js";
export { tinkIntegration } from "./integrations/tink.js";
export type { TinkIntegrationConfig, TinkTools, TinkScopes, TinkIntegrationClient } from "./integrations/tink.js";
export { gocardlessIntegration } from "./integrations/gocardless.js";
export type { GocardlessIntegrationConfig, GocardlessTools, GocardlessScopes, GocardlessIntegrationClient } from "./integrations/gocardless.js";

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

export { gkeepIntegration } from "./integrations/gkeep.js";
export type { GkeepIntegrationConfig, GkeepTools, GkeepIntegrationClient } from "./integrations/gkeep.js";

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

export { calendlyIntegration } from "./integrations/calendly.js";
export type { CalendlyIntegrationConfig, CalendlyTools, CalendlyScopes, CalendlyIntegrationClient } from "./integrations/calendly.js";

export { klaviyoIntegration } from "./integrations/klaviyo.js";
export type { KlaviyoIntegrationConfig, KlaviyoTools, KlaviyoScopes, KlaviyoIntegrationClient } from "./integrations/klaviyo.js";

export { googleFormsIntegration } from "./integrations/google_forms.js";
export type { GoogleFormsIntegrationConfig, GoogleFormsTools, GoogleFormsScopes, GoogleFormsIntegrationClient } from "./integrations/google_forms.js";

export { firebaseIntegration } from "./integrations/firebase.js";
export type { FirebaseIntegrationConfig, FirebaseTools, FirebaseScopes, FirebaseIntegrationClient } from "./integrations/firebase.js";

export { microsoftToDoIntegration } from "./integrations/microsoft_to_do.js";
export type { MicrosoftToDoIntegrationConfig, MicrosoftToDoTools, MicrosoftToDoScopes, MicrosoftToDoIntegrationClient } from "./integrations/microsoft_to_do.js";

export { onenoteIntegration } from "./integrations/onenote.js";
export type { OnenoteIntegrationConfig, OnenoteTools, OnenoteScopes, OnenoteIntegrationClient } from "./integrations/onenote.js";

export { microsoftBookingsIntegration } from "./integrations/microsoft_bookings.js";
export type { MicrosoftBookingsIntegrationConfig, MicrosoftBookingsTools, MicrosoftBookingsScopes, MicrosoftBookingsIntegrationClient } from "./integrations/microsoft_bookings.js";

export { azureDevopsIntegration } from "./integrations/azure_devops.js";
export type { AzureDevopsIntegrationConfig, AzureDevopsTools, AzureDevopsScopes, AzureDevopsIntegrationClient } from "./integrations/azure_devops.js";

export { googlePlayConsoleIntegration } from "./integrations/google_play_console.js";
export type { GooglePlayConsoleIntegrationConfig, GooglePlayConsoleTools, GooglePlayConsoleScopes, GooglePlayConsoleIntegrationClient } from "./integrations/google_play_console.js";

export { squarespaceIntegration } from "./integrations/squarespace.js";
export type { SquarespaceIntegrationConfig, SquarespaceTools, SquarespaceScopes, SquarespaceIntegrationClient } from "./integrations/squarespace.js";

export { zohoPeopleIntegration } from "./integrations/zoho_people.js";
export type { ZohoPeopleIntegrationConfig, ZohoPeopleTools, ZohoPeopleScopes, ZohoPeopleIntegrationClient } from "./integrations/zoho_people.js";

export { zohoRecruitIntegration } from "./integrations/zoho_recruit.js";
export type { ZohoRecruitIntegrationConfig, ZohoRecruitTools, ZohoRecruitScopes, ZohoRecruitIntegrationClient } from "./integrations/zoho_recruit.js";

export { zohoSignIntegration } from "./integrations/zoho_sign.js";
export type { ZohoSignIntegrationConfig, ZohoSignTools, ZohoSignScopes, ZohoSignIntegrationClient } from "./integrations/zoho_sign.js";

export { zohoWorkdriveIntegration } from "./integrations/zoho_workdrive.js";
export type { ZohoWorkdriveIntegrationConfig, ZohoWorkdriveTools, ZohoWorkdriveScopes, ZohoWorkdriveIntegrationClient } from "./integrations/zoho_workdrive.js";

export { zohoCreatorIntegration } from "./integrations/zoho_creator.js";
export type { ZohoCreatorIntegrationConfig, ZohoCreatorTools, ZohoCreatorScopes, ZohoCreatorIntegrationClient } from "./integrations/zoho_creator.js";

export { zohoInventoryIntegration } from "./integrations/zoho_inventory.js";
export type { ZohoInventoryIntegrationConfig, ZohoInventoryTools, ZohoInventoryScopes, ZohoInventoryIntegrationClient } from "./integrations/zoho_inventory.js";

export { zohoBillingIntegration } from "./integrations/zoho_billing.js";
export type { ZohoBillingIntegrationConfig, ZohoBillingTools, ZohoBillingScopes, ZohoBillingIntegrationClient } from "./integrations/zoho_billing.js";

export { zohoWriterIntegration } from "./integrations/zoho_writer.js";
export type { ZohoWriterIntegrationConfig, ZohoWriterTools, ZohoWriterScopes, ZohoWriterIntegrationClient } from "./integrations/zoho_writer.js";

export { zohoSprintsIntegration } from "./integrations/zoho_sprints.js";
export type { ZohoSprintsIntegrationConfig, ZohoSprintsTools, ZohoSprintsScopes, ZohoSprintsIntegrationClient } from "./integrations/zoho_sprints.js";

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
