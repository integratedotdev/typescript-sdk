/**
 * Pre-configured integration bundle for server and custom clients.
 * @module integrations/bundle
 */
import type { MCPIntegration } from "./types.js";
import { githubIntegration } from './github.js';
import { gmailIntegration } from './gmail.js';
import { notionIntegration } from './notion.js';
import { slackIntegration } from './slack.js';
import { discordIntegration } from './discord.js';
import { boxIntegration } from './box.js';
import { paypalIntegration } from './paypal.js';
import { squareIntegration } from './square.js';
import { spotifyIntegration } from './spotify.js';
import { stravaIntegration } from './strava.js';
import { asanaIntegration } from './asana.js';
import { confluenceIntegration } from './confluence.js';
import { oktaIntegration } from './okta.js';
import { quickbooksIntegration } from './quickbooks.js';
import { bitbucketIntegration } from './bitbucket.js';
import { smartthingsIntegration } from './smartthings.js';
import { googleAdsIntegration } from './google_ads.js';
import { pinterestIntegration } from './pinterest.js';
import { twitchIntegration } from './twitch.js';
import { xIntegration } from './x.js';
import { ebayIntegration } from './ebay.js';
import { miroIntegration } from './miro.js';
import { smartsheetIntegration } from './smartsheet.js';
import { docusignIntegration } from './docusign.js';
import { pipedriveIntegration } from './pipedrive.js';
import { freshserviceIntegration } from './freshservice.js';
import { zohoCrmIntegration } from './zoho_crm.js';
import { zohoMailIntegration } from './zoho_mail.js';
import { zohoDeskIntegration } from './zoho_desk.js';
import { zohoBooksIntegration } from './zoho_books.js';
import { zohoProjectsIntegration } from './zoho_projects.js';
import { zohoCampaignsIntegration } from './zoho_campaigns.js';
import { zohoAnalyticsIntegration } from './zoho_analytics.js';
import { zohoInvoiceIntegration } from './zoho_invoice.js';
import { linearIntegration } from './linear.js';
import { vercelIntegration } from './vercel.js';
import { zendeskIntegration } from './zendesk.js';
import { stripeIntegration } from './stripe.js';
import { gcalIntegration } from './gcal.js';
import { gmeetIntegration } from './gmeet.js';
import { gtasksIntegration } from './gtasks.js';
import { gkeepIntegration } from './gkeep.js';
import { gcontactsIntegration } from './gcontacts.js';
import { outlookIntegration } from './outlook.js';
import { teamsIntegration } from './teams.js';
import { airtableIntegration } from './airtable.js';
import { attioIntegration } from './attio.js';
import { todoistIntegration } from './todoist.js';
import { whatsappIntegration } from './whatsapp.js';
import { calcomIntegration } from './calcom.js';
import { canvaIntegration } from './canva.js';
import { cloudflareIntegration } from './cloudflare.js';
import { rampIntegration } from './ramp.js';
import { onedriveIntegration } from './onedrive.js';
import { plannerIntegration } from './planner.js';
import { sharepointIntegration } from './sharepoint.js';
import { wordIntegration } from './word.js';
import { excelIntegration } from './excel.js';
import { powerpointIntegration } from './powerpoint.js';
import { gdocsIntegration } from './gdocs.js';
import { gdriveIntegration } from './gdrive.js';
import { gsheetsIntegration } from './gsheets.js';
import { gslidesIntegration } from './gslides.js';
import { polarIntegration } from './polar.js';
import { facebookIntegration } from './facebook.js';
import { figmaIntegration } from './figma.js';
import { intercomIntegration } from './intercom.js';
import { hubspotIntegration } from './hubspot.js';
import { instagramIntegration } from './instagram.js';
import { linkedinIntegration } from './linkedin.js';
import { threadsIntegration } from './threads.js';
import { tiktokIntegration } from './tiktok.js';
import { typeformIntegration } from './typeform.js';
import { xeroIntegration } from './xero.js';
import { gchatIntegration } from './gchat.js';
import { shopifyIntegration } from './shopify.js';
import { youtubeIntegration } from './youtube.js';
import { zoomIntegration } from './zoom.js';
import { redditIntegration } from './reddit.js';
import { cursorIntegration } from './cursor.js';
import { posthogIntegration } from './posthog.js';
import { sentryIntegration } from './sentry.js';
import { datadogIntegration } from './datadog.js';
import { netlifyIntegration } from './netlify.js';
import { mondayIntegration } from './monday.js';
import { webflowIntegration } from './webflow.js';
import { jiraIntegration } from './jira.js';
import { salesforceIntegration } from './salesforce.js';
import { workdayIntegration } from './workday.js';
import { calendlyIntegration } from './calendly.js';
import { klaviyoIntegration } from './klaviyo.js';
import { googleFormsIntegration } from './google_forms.js';
import { firebaseIntegration } from './firebase.js';
import { microsoftToDoIntegration } from './microsoft_to_do.js';
import { onenoteIntegration } from './onenote.js';
import { microsoftBookingsIntegration } from './microsoft_bookings.js';
import { azureDevopsIntegration } from './azure_devops.js';
import { googlePlayConsoleIntegration } from './google_play_console.js';
import { squarespaceIntegration } from './squarespace.js';
import { zohoPeopleIntegration } from './zoho_people.js';
import { zohoRecruitIntegration } from './zoho_recruit.js';
import { zohoSignIntegration } from './zoho_sign.js';
import { zohoWorkdriveIntegration } from './zoho_workdrive.js';
import { zohoCreatorIntegration } from './zoho_creator.js';
import { zohoInventoryIntegration } from './zoho_inventory.js';
import { zohoBillingIntegration } from './zoho_billing.js';
import { zohoWriterIntegration } from './zoho_writer.js';
import { zohoSprintsIntegration } from './zoho_sprints.js';

export interface IntegrationBundleOptions {
  /** When set, only include these integration ids */
  include?: readonly string[];
}

/**
 * All default integrations (same set as the browser `client` singleton).
 */
export function allIntegrations(): MCPIntegration[] {
  return [
    githubIntegration(),
    gmailIntegration(),
    notionIntegration(),
    slackIntegration(),
    discordIntegration(),
    boxIntegration(),
    paypalIntegration(),
    squareIntegration(),
    spotifyIntegration(),
    stravaIntegration(),
    asanaIntegration(),
    confluenceIntegration(),
    oktaIntegration(),
    quickbooksIntegration(),
    bitbucketIntegration(),
    smartthingsIntegration(),
    googleAdsIntegration(),
    pinterestIntegration(),
    twitchIntegration(),
    xIntegration(),
    ebayIntegration(),
    miroIntegration(),
    smartsheetIntegration(),
    docusignIntegration(),
    pipedriveIntegration(),
    freshserviceIntegration(),
    zohoCrmIntegration(),
    zohoMailIntegration(),
    zohoDeskIntegration(),
    zohoBooksIntegration(),
    zohoProjectsIntegration(),
    zohoCampaignsIntegration(),
    zohoAnalyticsIntegration(),
    zohoInvoiceIntegration(),
    linearIntegration(),
    vercelIntegration(),
    zendeskIntegration(),
    stripeIntegration(),
    gcalIntegration(),
    gmeetIntegration(),
    gtasksIntegration(),
    gkeepIntegration(),
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
    calendlyIntegration(),
    klaviyoIntegration(),
    googleFormsIntegration(),
    firebaseIntegration(),
    microsoftToDoIntegration(),
    onenoteIntegration(),
    microsoftBookingsIntegration(),
    azureDevopsIntegration(),
    googlePlayConsoleIntegration(),
    squarespaceIntegration(),
    zohoPeopleIntegration(),
    zohoRecruitIntegration(),
    zohoSignIntegration(),
    zohoWorkdriveIntegration(),
    zohoCreatorIntegration(),
    zohoInventoryIntegration(),
    zohoBillingIntegration(),
    zohoWriterIntegration(),
    zohoSprintsIntegration(),
  ];
}

/**
 * Filtered integration bundle for server registration.
 */
export function createIntegrationBundle(
  options?: IntegrationBundleOptions
): MCPIntegration[] {
  const all = allIntegrations();
  if (!options?.include?.length) return all;
  const allowed = new Set(options.include);
  return all.filter((i) => allowed.has(i.id));
}
