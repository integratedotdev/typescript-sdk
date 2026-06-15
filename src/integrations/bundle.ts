/**
 * Default integration bundle — single source of truth for createIntegrationBundle() and the default client.
 * Auto-generated: includes every integration factory that can be constructed without required credentials.
 * Integrations that need API keys or tenant config at construction time are exported from src/index.ts
 * and must be added explicitly (e.g. auth0Integration({ domain }), granolaIntegration({ apiKey })).
 */

import { adobeAcrobatSignIntegration } from './adobe_acrobat_sign.js';
import { airtableIntegration } from './airtable.js';
import { amadeusIntegration } from './amadeus.js';
import { amazonIntegration } from './amazon.js';
import { amazonAdsIntegration } from './amazon_ads.js';
import { asanaIntegration } from './asana.js';
import { attioIntegration } from './attio.js';
import { azureDevopsIntegration } from './azure_devops.js';
import { bamboohrIntegration } from './bamboohr.js';
import { bigcommerceIntegration } from './bigcommerce.js';
import { bigqueryIntegration } from './bigquery.js';
import { bitbucketIntegration } from './bitbucket.js';
import { boxIntegration } from './box.js';
import { calcomIntegration } from './calcom.js';
import { calendlyIntegration } from './calendly.js';
import { canvaIntegration } from './canva.js';
import { canvasLmsIntegration } from './canvas_lms.js';
import { clickupIntegration } from './clickup.js';
import { cloudflareIntegration } from './cloudflare.js';
import { confluenceIntegration } from './confluence.js';
import { contentfulIntegration } from './contentful.js';
import { cursorIntegration } from './cursor.js';
import { databricksIntegration } from './databricks.js';
import { datadogIntegration } from './datadog.js';
import { deezerIntegration } from './deezer.js';
import { dhlIntegration } from './dhl.js';
import { discordIntegration } from './discord.js';
import { docusignIntegration } from './docusign.js';
import { dropboxIntegration } from './dropbox.js';
import { dropboxSignIntegration } from './dropbox_sign.js';
import { ebayIntegration } from './ebay.js';
import { etsyIntegration } from './etsy.js';
import { eventbriteIntegration } from './eventbrite.js';
import { exactOnlineIntegration } from './exact_online.js';
import { excelIntegration } from './excel.js';
import { expediaIntegration } from './expedia.js';
import { facebookIntegration } from './facebook.js';
import { fedexIntegration } from './fedex.js';
import { figmaIntegration } from './figma.js';
import { firebaseIntegration } from './firebase.js';
import { fitbitIntegration } from './fitbit.js';
import { foursquareIntegration } from './foursquare.js';
import { freeagentIntegration } from './freeagent.js';
import { freshserviceIntegration } from './freshservice.js';
import { garminIntegration } from './garmin.js';
import { githubIntegration } from './github.js';
import { gitlabIntegration } from './gitlab.js';
import { gmailIntegration } from './gmail.js';
import { gocardlessIntegration } from './gocardless.js';
import { googleAdsIntegration } from './google_ads.js';
import { googleAnalyticsIntegration } from './google_analytics.js';
import { googleCalendarIntegration } from './google_calendar.js';
import { googleChatIntegration } from './google_chat.js';
import { googleClassroomIntegration } from './google_classroom.js';
import { googleContactsIntegration } from './google_contacts.js';
import { googleDocsIntegration } from './google_docs.js';
import { googleDriveIntegration } from './google_drive.js';
import { googleFormsIntegration } from './google_forms.js';
import { googleHomeIntegration } from './google_home.js';
import { googleKeepIntegration } from './google_keep.js';
import { googleMeetIntegration } from './google_meet.js';
import { googlePlayConsoleIntegration } from './google_play_console.js';
import { googleSheetsIntegration } from './google_sheets.js';
import { googleSlidesIntegration } from './google_slides.js';
import { googleTasksIntegration } from './google_tasks.js';
import { greenhouseIntegration } from './greenhouse.js';
import { homeConnectIntegration } from './home_connect.js';
import { hubspotIntegration } from './hubspot.js';
import { instagramIntegration } from './instagram.js';
import { intercomIntegration } from './intercom.js';
import { jiraIntegration } from './jira.js';
import { kickIntegration } from './kick.js';
import { klaviyoIntegration } from './klaviyo.js';
import { leverIntegration } from './lever.js';
import { linearIntegration } from './linear.js';
import { linkedinIntegration } from './linkedin.js';
import { lookerIntegration } from './looker.js';
import { mailchimpIntegration } from './mailchimp.js';
import { mapmyfitnessIntegration } from './mapmyfitness.js';
import { meetupIntegration } from './meetup.js';
import { metaAdsIntegration } from './meta_ads.js';
import { microsoftAdsIntegration } from './microsoft_ads.js';
import { microsoftBookingsIntegration } from './microsoft_bookings.js';
import { microsoftEntraIdIntegration } from './microsoft_entra_id.js';
import { microsoftGraphEducationIntegration } from './microsoft_graph_education.js';
import { microsoftToDoIntegration } from './microsoft_to_do.js';
import { mieleIntegration } from './miele.js';
import { miroIntegration } from './miro.js';
import { mondayIntegration } from './monday.js';
import { moneybirdIntegration } from './moneybird.js';
import { netatmoIntegration } from './netatmo.js';
import { netlifyIntegration } from './netlify.js';
import { notionIntegration } from './notion.js';
import { oktaIntegration } from './okta.js';
import { onedriveIntegration } from './onedrive.js';
import { oneloginIntegration } from './onelogin.js';
import { onenoteIntegration } from './onenote.js';
import { ouraIntegration } from './oura.js';
import { outlookIntegration } from './outlook.js';
import { pandadocIntegration } from './pandadoc.js';
import { paperIntegration } from './paper.js';
import { paypalIntegration } from './paypal.js';
import { phantomIntegration } from './phantom.js';
import { philipsHueIntegration } from './philips_hue.js';
import { pinterestIntegration } from './pinterest.js';
import { pipedriveIntegration } from './pipedrive.js';
import { plaidIntegration } from './plaid.js';
import { planetscaleIntegration } from './planetscale.js';
import { plannerIntegration } from './planner.js';
import { polarIntegration } from './polar.js';
import { posthogIntegration } from './posthog.js';
import { powerpointIntegration } from './powerpoint.js';
import { quickbooksIntegration } from './quickbooks.js';
import { railwayIntegration } from './railway.js';
import { rampIntegration } from './ramp.js';
import { redditIntegration } from './reddit.js';
import { ringIntegration } from './ring.js';
import { sageIntegration } from './sage.js';
import { salesforceIntegration } from './salesforce.js';
import { sentryIntegration } from './sentry.js';
import { sharepointIntegration } from './sharepoint.js';
import { shopifyIntegration } from './shopify.js';
import { slackIntegration } from './slack.js';
import { smartsheetIntegration } from './smartsheet.js';
import { smartthingsIntegration } from './smartthings.js';
import { snowflakeIntegration } from './snowflake.js';
import { sonosIntegration } from './sonos.js';
import { spotifyIntegration } from './spotify.js';
import { squareIntegration } from './square.js';
import { squarespaceIntegration } from './squarespace.js';
import { stravaIntegration } from './strava.js';
import { stripeIntegration } from './stripe.js';
import { supabaseIntegration } from './supabase.js';
import { tableauIntegration } from './tableau.js';
import { teamsIntegration } from './teams.js';
import { teslaIntegration } from './tesla.js';
import { threadsIntegration } from './threads.js';
import { tiktokIntegration } from './tiktok.js';
import { tiktokBusinessIntegration } from './tiktok_business.js';
import { tinkIntegration } from './tink.js';
import { tldrawIntegration } from './tldraw.js';
import { todoistIntegration } from './todoist.js';
import { truelayerIntegration } from './truelayer.js';
import { tuyaIntegration } from './tuya.js';
import { twitchIntegration } from './twitch.js';
import { typeformIntegration } from './typeform.js';
import { uberIntegration } from './uber.js';
import { uberEatsIntegration } from './uber_eats.js';
import { universeIntegration } from './universe.js';
import { upsIntegration } from './ups.js';
import { vercelIntegration } from './vercel.js';
import { webflowIntegration } from './webflow.js';
import { whatsappIntegration } from './whatsapp.js';
import { whoopIntegration } from './whoop.js';
import { withingsIntegration } from './withings.js';
import { wordIntegration } from './word.js';
import { wordpressIntegration } from './wordpress.js';
import { workdayIntegration } from './workday.js';
import { xIntegration } from './x.js';
import { xeroIntegration } from './xero.js';
import { youtubeIntegration } from './youtube.js';
import { zapierIntegration } from './zapier.js';
import { zendeskIntegration } from './zendesk.js';
import { zohoAnalyticsIntegration } from './zoho_analytics.js';
import { zohoBillingIntegration } from './zoho_billing.js';
import { zohoBooksIntegration } from './zoho_books.js';
import { zohoCampaignsIntegration } from './zoho_campaigns.js';
import { zohoCreatorIntegration } from './zoho_creator.js';
import { zohoCrmIntegration } from './zoho_crm.js';
import { zohoDeskIntegration } from './zoho_desk.js';
import { zohoInventoryIntegration } from './zoho_inventory.js';
import { zohoInvoiceIntegration } from './zoho_invoice.js';
import { zohoMailIntegration } from './zoho_mail.js';
import { zohoPeopleIntegration } from './zoho_people.js';
import { zohoProjectsIntegration } from './zoho_projects.js';
import { zohoRecruitIntegration } from './zoho_recruit.js';
import { zohoSignIntegration } from './zoho_sign.js';
import { zohoSprintsIntegration } from './zoho_sprints.js';
import { zohoWorkdriveIntegration } from './zoho_workdrive.js';
import { zohoWriterIntegration } from './zoho_writer.js';
import { zoomIntegration } from './zoom.js';

import type { MCPIntegration } from './types.js';

export interface IntegrationBundleOptions {
  /** When set, only these integration ids are included. Omit for the full default bundle. */
  include?: string[];
}

export function allIntegrations(): MCPIntegration[] {
  return [
    adobeAcrobatSignIntegration(),
    airtableIntegration(),
    amadeusIntegration(),
    amazonIntegration(),
    amazonAdsIntegration(),
    asanaIntegration(),
    attioIntegration(),
    azureDevopsIntegration(),
    bamboohrIntegration(),
    bigcommerceIntegration(),
    bigqueryIntegration(),
    bitbucketIntegration(),
    boxIntegration(),
    calcomIntegration(),
    calendlyIntegration(),
    canvaIntegration(),
    canvasLmsIntegration(),
    clickupIntegration(),
    cloudflareIntegration(),
    confluenceIntegration(),
    contentfulIntegration(),
    cursorIntegration(),
    databricksIntegration(),
    datadogIntegration(),
    deezerIntegration(),
    dhlIntegration(),
    discordIntegration(),
    docusignIntegration(),
    dropboxIntegration(),
    dropboxSignIntegration(),
    ebayIntegration(),
    etsyIntegration(),
    eventbriteIntegration(),
    exactOnlineIntegration(),
    excelIntegration(),
    expediaIntegration(),
    facebookIntegration(),
    fedexIntegration(),
    figmaIntegration(),
    firebaseIntegration(),
    fitbitIntegration(),
    foursquareIntegration(),
    freeagentIntegration(),
    freshserviceIntegration(),
    garminIntegration(),
    githubIntegration(),
    gitlabIntegration(),
    gmailIntegration(),
    gocardlessIntegration(),
    googleAdsIntegration(),
    googleAnalyticsIntegration(),
    googleCalendarIntegration(),
    googleChatIntegration(),
    googleClassroomIntegration(),
    googleContactsIntegration(),
    googleDocsIntegration(),
    googleDriveIntegration(),
    googleFormsIntegration(),
    googleHomeIntegration(),
    googleKeepIntegration(),
    googleMeetIntegration(),
    googlePlayConsoleIntegration(),
    googleSheetsIntegration(),
    googleSlidesIntegration(),
    googleTasksIntegration(),
    greenhouseIntegration(),
    homeConnectIntegration(),
    hubspotIntegration(),
    instagramIntegration(),
    intercomIntegration(),
    jiraIntegration(),
    kickIntegration(),
    klaviyoIntegration(),
    leverIntegration(),
    linearIntegration(),
    linkedinIntegration(),
    lookerIntegration(),
    mailchimpIntegration(),
    mapmyfitnessIntegration(),
    meetupIntegration(),
    metaAdsIntegration(),
    microsoftAdsIntegration(),
    microsoftBookingsIntegration(),
    microsoftEntraIdIntegration(),
    microsoftGraphEducationIntegration(),
    microsoftToDoIntegration(),
    mieleIntegration(),
    miroIntegration(),
    mondayIntegration(),
    moneybirdIntegration(),
    netatmoIntegration(),
    netlifyIntegration(),
    notionIntegration(),
    oktaIntegration(),
    onedriveIntegration(),
    oneloginIntegration(),
    onenoteIntegration(),
    ouraIntegration(),
    outlookIntegration(),
    pandadocIntegration(),
    paperIntegration(),
    paypalIntegration(),
    phantomIntegration(),
    philipsHueIntegration(),
    pinterestIntegration(),
    pipedriveIntegration(),
    plaidIntegration(),
    planetscaleIntegration(),
    plannerIntegration(),
    polarIntegration(),
    posthogIntegration(),
    powerpointIntegration(),
    quickbooksIntegration(),
    railwayIntegration(),
    rampIntegration(),
    redditIntegration(),
    ringIntegration(),
    sageIntegration(),
    salesforceIntegration(),
    sentryIntegration(),
    sharepointIntegration(),
    shopifyIntegration(),
    slackIntegration(),
    smartsheetIntegration(),
    smartthingsIntegration(),
    snowflakeIntegration(),
    sonosIntegration(),
    spotifyIntegration(),
    squareIntegration(),
    squarespaceIntegration(),
    stravaIntegration(),
    stripeIntegration(),
    supabaseIntegration(),
    tableauIntegration(),
    teamsIntegration(),
    teslaIntegration(),
    threadsIntegration(),
    tiktokIntegration(),
    tiktokBusinessIntegration(),
    tinkIntegration(),
    tldrawIntegration(),
    todoistIntegration(),
    truelayerIntegration(),
    tuyaIntegration(),
    twitchIntegration(),
    typeformIntegration(),
    uberIntegration(),
    uberEatsIntegration(),
    universeIntegration(),
    upsIntegration(),
    vercelIntegration(),
    webflowIntegration(),
    whatsappIntegration(),
    whoopIntegration(),
    withingsIntegration(),
    wordIntegration(),
    wordpressIntegration(),
    workdayIntegration(),
    xIntegration(),
    xeroIntegration(),
    youtubeIntegration(),
    zapierIntegration(),
    zendeskIntegration(),
    zohoAnalyticsIntegration(),
    zohoBillingIntegration(),
    zohoBooksIntegration(),
    zohoCampaignsIntegration(),
    zohoCreatorIntegration(),
    zohoCrmIntegration(),
    zohoDeskIntegration(),
    zohoInventoryIntegration(),
    zohoInvoiceIntegration(),
    zohoMailIntegration(),
    zohoPeopleIntegration(),
    zohoProjectsIntegration(),
    zohoRecruitIntegration(),
    zohoSignIntegration(),
    zohoSprintsIntegration(),
    zohoWorkdriveIntegration(),
    zohoWriterIntegration(),
    zoomIntegration(),
  ];
}

/**
 * Filtered integration bundle for server registration.
 * Omit `include` to register every default integration; pass ids to opt into a subset.
 */
export function createIntegrationBundle(
  options?: IntegrationBundleOptions
): MCPIntegration[] {
  const all = allIntegrations();
  if (!options?.include?.length) return all;
  const allowed = new Set(options.include);
  return all.filter((i) => allowed.has(i.id));
}
