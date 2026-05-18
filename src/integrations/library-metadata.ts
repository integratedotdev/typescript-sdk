/**
 * Default library copy and categories for known integrations.
 * Hosts can override per integration via `description` / `category` on {@link MCPIntegration}.
 */

export type IntegrationCategory =
  | "Analytics"
  | "Business"
  | "Finance"
  | "Marketing"
  | "Entertainment"
  | "Productivity"
  | "Lifestyle"
  | "Communication"
  | "Engineering"
  | "Infrastructure"
  | "Storage"
  | "Social Media"
  | "Fitness"
  | "Travel"
  | "Events & Ticketing"
  | "Commerce"
  | "Food"
  | "CMS"
  | "Education"
  | "HR & Recruiting"
  | "Data & BI"
  | "Legal"
  | "Accounting"
  | "Identity & Access"
  | "Shipping & Logistics"
  | "Banking"
  | "Other";

type LibraryEntry = {
  description: string;
  category: IntegrationCategory;
};

/** Display order for library section headers (categories not listed sort before "Other"). */
export const INTEGRATION_CATEGORY_ORDER: readonly IntegrationCategory[] = [
  "Analytics",
  "Productivity",
  "Lifestyle",
  "Business",
  "Finance",
  "Marketing",
  "Entertainment",
  "Communication",
  "Engineering",
  "Infrastructure",
  "Storage",
  "Social Media",
  "Fitness",
  "Travel",
  "Events & Ticketing",
  "Commerce",
  "Food",
  "CMS",
  "Education",
  "HR & Recruiting",
  "Data & BI",
  "Legal",
  "Accounting",
  "Identity & Access",
  "Shipping & Logistics",
  "Banking",
  "Other",
] as const;

/**
 * Canonical one-line descriptions and categories for integrate-sdk integrations.
 */
export const INTEGRATION_LIBRARY_METADATA: Record<string, LibraryEntry> = {
  oura: {
    description: "Manage Oura get personal info, list daily activity, list sleep, list workouts, list sessions",
    category: "Fitness",
  },
  whoop: {
    description: "Manage WHOOP get profile, get body measurement, list cycles, list recovery, list sleep",
    category: "Fitness",
  },
  garmin: {
    description: "Manage Garmin list activities, list daily summaries, list sleep, list heart rates, list body composition",
    category: "Fitness",
  },
  fitbit: {
    description: "Manage Fitbit get profile, list activities, list sleep, list heart rate, list weight",
    category: "Fitness",
  },
  withings: {
    description: "Manage Withings get measurements, get activity, get sleep, get workouts, get user",
    category: "Fitness",
  },
  mapmyfitness: {
    description: "Manage MapMyFitness get user, list workouts, get workout, create workout, list routes",
    category: "Fitness",
  },
  miele: {
    description: "Manage Miele list devices, get device, get actions, execute action, get programs",
    category: "Lifestyle",
  },
  tesla: {
    description: "Manage Tesla list vehicles, get vehicle, wake vehicle, send vehicle command, list energy sites",
    category: "Lifestyle",
  },
  tuya: {
    description: "Manage Tuya list devices, get device, get device status, send device commands, list scenes",
    category: "Lifestyle",
  },
  home_connect: {
    description: "Manage Home Connect list appliances, get appliance, get status, get programs, start program",
    category: "Lifestyle",
  },
  netatmo: {
    description: "Manage Netatmo get homesdata, get stationsdata, get measure, set thermpoint, get events",
    category: "Lifestyle",
  },
  philips_hue: {
    description: "Manage Philips Hue list bridges, list lights, get light, update light, list rooms",
    category: "Lifestyle",
  },
  google_home: {
    description: "Manage Google Home devices, structures, rooms, and device commands",
    category: "Lifestyle",
  },
  sonos: {
    description: "Manage Sonos list households, list groups, get playback status, control playback, get group volume",
    category: "Lifestyle",
  },
  ring: {
    description: "Manage Ring list locations, list devices, get device health, list events, activate siren",
    category: "Lifestyle",
  },
  kick: {
    description: "Manage Kick get users, get channels, get livestreams, get categories, send chat message",
    category: "Entertainment",
  },
  deezer: {
    description: "Manage Deezer get user, search, get album, get track, list playlists",
    category: "Entertainment",
  },
  uber: {
    description: "Manage Uber get profile, list products, estimate price, estimate time, list requests",
    category: "Travel",
  },
  amadeus: {
    description: "Manage Amadeus search flights, price flight, search hotels, get hotel offers, search locations",
    category: "Travel",
  },
  expedia: {
    description: "Manage Expedia Rapid search properties, get property content, get rate quote, create booking, get itinerary",
    category: "Travel",
  },
  eventbrite: {
    description: "Manage Eventbrite get user, list organizations, list events, get event, create event",
    category: "Events & Ticketing",
  },
  meetup: {
    description: "Manage Meetup get self, search groups, list events, get event, create event",
    category: "Events & Ticketing",
  },
  universe: {
    description: "Manage Universe get user, list events, get event, create event, list orders",
    category: "Events & Ticketing",
  },
  etsy: {
    description: "Manage Etsy get me, get shop, list shop listings, create listing, list receipts",
    category: "Commerce",
  },
  amazon: {
    description: "Manage Amazon Selling Partner search catalog items, list orders, get order, list inventory, list listings",
    category: "Commerce",
  },
  bigcommerce: {
    description: "Manage BigCommerce list products, get product, create product, list orders, get order",
    category: "Commerce",
  },
  foursquare: {
    description: "Manage Foursquare search places, get place, get place tips, get place photos, autocomplete places",
    category: "Food",
  },
  uber_eats: {
    description: "Manage Uber Eats list stores, get store, list orders, get order, update order status",
    category: "Food",
  },
  wordpress: {
    description: "Manage WordPress get site, list posts, get post, create post, update post",
    category: "CMS",
  },
  contentful: {
    description: "Manage Contentful list spaces, get space, list entries, get entry, create entry",
    category: "CMS",
  },
  canvas_lms: {
    description: "Manage Canvas LMS list courses, get course, list assignments, create assignment, list submissions",
    category: "Education",
  },
  google_classroom: {
    description: "Manage Google Classroom list courses, get course, create course, list coursework, create coursework",
    category: "Education",
  },
  microsoft_graph_education: {
    description: "Manage Microsoft Graph Education list classes, get class, list users, list assignments, create assignment",
    category: "Education",
  },
  lever: {
    description: "Manage Lever list opportunities, get opportunity, create opportunity, list postings, list users",
    category: "HR & Recruiting",
  },
  greenhouse: {
    description: "Manage Greenhouse list candidates, get candidate, create candidate, list jobs, list applications",
    category: "HR & Recruiting",
  },
  bamboohr: {
    description: "Manage BambooHR get company report, list employees, get employee, update employee, list time off requests",
    category: "HR & Recruiting",
  },
  snowflake: {
    description: "Manage Snowflake submit statement, get statement, cancel statement, list databases, list warehouses",
    category: "Data & BI",
  },
  bigquery: {
    description: "Manage BigQuery list projects, list datasets, list tables, get table, query",
    category: "Data & BI",
  },
  looker: {
    description: "Manage Looker me, search dashboards, get dashboard, run query, list looks",
    category: "Data & BI",
  },
  tableau: {
    description: "Manage Tableau list sites, list workbooks, get workbook, list views, list datasources",
    category: "Data & BI",
  },
  dropbox_sign: {
    description: "Manage Dropbox Sign get account, list signature requests, get signature request, send signature request, list templates",
    category: "Legal",
  },
  adobe_acrobat_sign: {
    description: "Manage Adobe Acrobat Sign get user, list agreements, get agreement, create agreement, list library documents",
    category: "Legal",
  },
  pandadoc: {
    description: "Manage PandaDoc list documents, get document, create document, send document, list templates",
    category: "Legal",
  },
  meta_ads: {
    description: "Manage Meta Ads list ad accounts, get ad account, list campaigns, create campaign, list adsets",
    category: "Marketing",
  },
  microsoft_ads: {
    description: "Manage Microsoft Ads get user, search accounts, get campaigns, add campaigns, get ad groups",
    category: "Marketing",
  },
  tiktok_business: {
    description: "Manage TikTok Business list advertisers, list campaigns, create campaign, list adgroups, list ads",
    category: "Marketing",
  },
  amazon_ads: {
    description: "Manage Amazon Ads list profiles, list campaigns, create campaigns, list ad groups, list keywords",
    category: "Marketing",
  },
  moneybird: {
    description: "Manage Moneybird list administrations, list contacts, create contact, list sales invoices, create sales invoice",
    category: "Accounting",
  },
  exact_online: {
    description: "Manage Exact Online list divisions, list accounts, list items, list sales invoices, create sales invoice",
    category: "Accounting",
  },
  sage: {
    description: "Manage Sage business details, contacts, products, and sales invoices",
    category: "Accounting",
  },
  freeagent: {
    description: "Manage FreeAgent get company, list contacts, create contact, list invoices, create invoice",
    category: "Accounting",
  },
  onelogin: {
    description: "Manage OneLogin list users, get user, create user, list roles, list apps",
    category: "Identity & Access",
  },
  microsoft_entra_id: {
    description: "Manage Microsoft Entra ID list users, get user, create user, list groups, list applications",
    category: "Identity & Access",
  },
  dhl: {
    description: "Manage DHL track shipment, create shipment, get label, delete shipment, validate address",
    category: "Shipping & Logistics",
  },
  ups: {
    description: "Manage UPS track shipment, rate shipment, create shipment, void shipment, validate address",
    category: "Shipping & Logistics",
  },
  fedex: {
    description: "Manage FedEx track shipments, rate shipment, create shipment, cancel shipment, validate address",
    category: "Shipping & Logistics",
  },
  plaid: {
    description: "Manage Plaid create link token, exchange public token, get accounts, get transactions, get identity",
    category: "Banking",
  },
  truelayer: {
    description: "Manage TrueLayer get me, list accounts, get account, get balance, list transactions",
    category: "Banking",
  },
  tink: {
    description: "Manage Tink get user, list accounts, get account, list transactions, list credentials",
    category: "Banking",
  },
  gocardless: {
    description: "Manage GoCardless institutions, requisitions, accounts, balances, and transactions",
    category: "Banking",
  },
  google_ads: {
    description: "Manage Google Ads customers, campaigns, ad groups, ads, keywords, and conversions",
    category: "Marketing",
  },
  pinterest: {
    description: "Manage Pinterest boards, pins, search, ad accounts, and campaigns",
    category: "Social Media",
  },
  twitch: {
    description: "Manage Twitch users, streams, channels, clips, videos, games, follows, and subscriptions",
    category: "Entertainment",
  },
  x: {
    description: "Manage X users, posts, timelines, likes, bookmarks, follows, and posting",
    category: "Social Media",
  },
  ebay: {
    description: "Manage eBay browse, inventory, offers, orders, and fulfillment APIs",
    category: "Commerce",
  },
  miro: {
    description: "Manage Miro boards, board items, comments, members, and collaborators",
    category: "Productivity",
  },
  smartsheet: {
    description: "Manage Smartsheet sheets, rows, columns, workspaces, reports, and attachments",
    category: "Productivity",
  },
  docusign: {
    description: "Manage DocuSign eSignature accounts, envelopes, recipients, documents, and templates",
    category: "Legal",
  },
  pipedrive: {
    description: "Manage Pipedrive deals, leads, people, organizations, activities, notes, pipelines, and products",
    category: "Business",
  },
  freshservice: {
    description: "Manage Freshservice tickets, requesters, agents, assets, changes, problems, releases, and solutions",
    category: "Business",
  },
  zoho_crm: {
    description: "Manage Zoho CRM modules, records, users, org settings, search, and COQL",
    category: "Business",
  },
  zoho_mail: {
    description: "Manage Zoho Mail accounts, folders, messages, labels, search, and sending",
    category: "Communication",
  },
  zoho_desk: {
    description: "Manage Zoho Desk tickets, contacts, accounts, agents, departments, and articles",
    category: "Business",
  },
  zoho_books: {
    description: "Manage Zoho Books organizations, contacts, items, invoices, bills, payments, and reports",
    category: "Accounting",
  },
  zoho_projects: {
    description: "Manage Zoho Projects portals, projects, milestones, tasks, issues, and timesheets",
    category: "Productivity",
  },
  zoho_campaigns: {
    description: "Manage Zoho Campaigns lists, contacts, campaigns, reports, and sends",
    category: "Marketing",
  },
  zoho_analytics: {
    description: "Manage Zoho Analytics workspaces, views, imports, exports, and query APIs",
    category: "Analytics",
  },
  zoho_invoice: {
    description: "Manage Zoho Invoice organizations, customers, items, estimates, invoices, payments, and reports",
    category: "Accounting",
  },
  airtable: {
    description: "Manage Airtable bases, tables, and records",
    category: "Business",
  },
  aws: {
    description: "Inspect AWS accounts and resources with SigV4 (control-plane APIs)",
    category: "Infrastructure",
  },
  attio: {
    description: "Manage Attio people, companies, tasks, and CRM records",
    category: "Business",
  },
  asana: {
    description: "Manage Asana workspaces, projects, tasks, stories, users, and teams",
    category: "Productivity",
  },
  bitbucket: {
    description: "Manage Bitbucket Cloud repositories, pull requests, issues, and pipelines",
    category: "Engineering",
  },
  calcom: {
    description: "Manage Cal.com bookings and schedules",
    category: "Productivity",
  },
  canva: {
    description: "List and create Canva designs, manage folders, and export assets",
    category: "Productivity",
  },
  cloudflare: {
    description: "Manage Cloudflare zones, DNS, CDN cache, and Workers",
    category: "Infrastructure",
  },
  confluence: {
    description: "Manage Confluence spaces, pages, search, comments, and attachments",
    category: "Productivity",
  },
  cursor: {
    description: "Manage Cursor Cloud Agents and background tasks",
    category: "Engineering",
  },
  databricks: {
    description: "Run Databricks jobs, list clusters and SQL warehouses, and inspect workspace paths",
    category: "Engineering",
  },
  figma: {
    description: "Access Figma files, comments, and components",
    category: "Engineering",
  },
  facebook: {
    description: "Manage Facebook Page posts, comments, reactions, and insights via the Graph API",
    category: "Social Media",
  },
  github: {
    description: "Manage GitHub repos, issues, and pull requests",
    category: "Engineering",
  },
  gmail: {
    description: "Send, read, and search Gmail messages",
    category: "Communication",
  },
  gcal: {
    description: "Manage Google Calendar events and schedules",
    category: "Productivity",
  },
  gtasks: {
    description: "Manage Google Tasks lists and to-dos",
    category: "Productivity",
  },
  gkeep: {
    description: "Manage Google Keep notes, attachments, and sharing permissions",
    category: "Productivity",
  },
  gmeet: {
    description: "Create Google Meet links and manage meeting events via Calendar",
    category: "Communication",
  },
  gcontacts: {
    description: "List, search, create, update, and delete Google Contacts via the People API",
    category: "Communication",
  },
  hubspot: {
    description: "Manage HubSpot contacts, deals, and tickets",
    category: "Business",
  },
  instagram: {
    description: "Instagram Graph API — media, comments, insights, stories, and publishing",
    category: "Social Media",
  },
  intercom: {
    description: "Manage Intercom contacts and conversations",
    category: "Business",
  },
  linear: {
    description: "Manage Linear issues, projects, and cycles",
    category: "Engineering",
  },
  notion: {
    description: "Manage Notion pages and databases",
    category: "Productivity",
  },
  okta: {
    description: "Manage Okta users, groups, applications, policies, and system logs",
    category: "Identity & Access",
  },
  onedrive: {
    description: "Manage OneDrive files, folders, and sharing",
    category: "Storage",
  },
  planner: {
    description: "Manage Microsoft Planner plans, buckets, and tasks",
    category: "Productivity",
  },
  outlook: {
    description: "Manage Outlook mail, calendars, and contacts",
    category: "Communication",
  },
  polar: {
    description: "Manage Polar products, orders, and subscriptions",
    category: "Finance",
  },
  paypal: {
    description: "Manage PayPal orders, captures, refunds, invoices, products, plans, and subscriptions",
    category: "Finance",
  },
  phantom: {
    description: "Build Phantom mobile browse universal links and deeplink provider documentation (Solana)",
    category: "Other",
  },
  posthog: {
    description: "Read PostHog organizations, projects, insights, and feature flags",
    category: "Analytics",
  },
  postman: {
    description: "Manage Postman workspaces, collections, and environments via the Postman API",
    category: "Engineering",
  },
  ramp: {
    description: "Manage Ramp corporate cards, bills, reimbursements, and spend controls",
    category: "Finance",
  },
  quickbooks: {
    description: "Manage QuickBooks Online accounting data, invoices, bills, payments, and reports",
    category: "Accounting",
  },
  resend: {
    description: "Send email and manage domains with the Resend API",
    category: "Communication",
  },
  mailchimp: {
    description: "Manage Mailchimp audiences, members, and campaigns",
    category: "Marketing",
  },
  railway: {
    description: "Manage Railway workspaces, projects, services, deployments, variables, domains, and volumes",
    category: "Infrastructure",
  },
  supabase: {
    description: "Manage Supabase organizations, projects, Postgres, API keys, secrets, and branches",
    category: "Infrastructure",
  },
  sentry: {
    description: "Monitor Sentry errors, issues, releases, and projects",
    category: "Engineering",
  },
  netlify: {
    description: "Manage Netlify sites, deploys, builds, and environment variables",
    category: "Infrastructure",
  },
  redis: {
    description: "Manage Redis Cloud subscriptions, databases, async tasks, and audit logs",
    category: "Infrastructure",
  },
  upstash: {
    description: "Use Upstash Redis REST, QStash messaging, and related HTTP APIs",
    category: "Infrastructure",
  },
  jira: {
    description: "Manage Jira issues, projects, sprints, and boards",
    category: "Engineering",
  },
  slack: {
    description: "Send and manage Slack messages and channels",
    category: "Communication",
  },
  smartthings: {
    description: "Manage SmartThings locations, rooms, devices, scenes, and rules",
    category: "Lifestyle",
  },
  spotify: {
    description: "Search Spotify, manage playlists and saved tracks, and control playback",
    category: "Entertainment",
  },
  strava: {
    description: "Manage Strava athletes, activities, routes, clubs, segments, streams, gear, and uploads",
    category: "Fitness",
  },
  square: {
    description: "Manage Square merchants, locations, customers, catalog, orders, payments, refunds, and invoices",
    category: "Finance",
  },
  telegram: {
    description: "Use Telegram as an actual user account via MTProto sessions",
    category: "Communication",
  },
  stripe: {
    description: "Manage Stripe customers, payments, and subscriptions",
    category: "Finance",
  },
  todoist: {
    description: "Manage Todoist tasks, projects, and labels",
    category: "Productivity",
  },
  gslides: {
    description: "Create and update Google Slides presentations",
    category: "Productivity",
  },
  gsheets: {
    description: "Read and update Google Sheets spreadsheets",
    category: "Productivity",
  },
  gdocs: {
    description: "Create and edit Google Docs documents",
    category: "Productivity",
  },
  gdrive: {
    description: "Manage Google Drive files, folders, and sharing",
    category: "Storage",
  },
  vercel: {
    description: "Manage Vercel projects, deployments, and domains",
    category: "Infrastructure",
  },
  workos: {
    description: "Manage WorkOS organizations, users, directory sync, and AuthKit",
    category: "Identity & Access",
  },
  whatsapp: {
    description: "Send WhatsApp messages and templates",
    category: "Communication",
  },
  youtube: {
    description: "Search and access YouTube videos and channels",
    category: "Entertainment",
  },
  zoom: {
    description: "Manage Zoom user profile and meetings",
    category: "Communication",
  },
  reddit: {
    description: "Browse subreddits, search posts, submit content, and vote on Reddit",
    category: "Social Media",
  },
  powerpoint: {
    description: "Manage PowerPoint presentations and sharing",
    category: "Productivity",
  },
  excel: {
    description: "Manage Excel workbooks, worksheets, and tables",
    category: "Productivity",
  },
  word: {
    description: "Manage Word documents and sharing",
    category: "Productivity",
  },
  dropbox: {
    description: "Manage Dropbox files, folders, and sharing",
    category: "Storage",
  },
  box: {
    description: "Manage Box files, folders, sharing, comments, search, and collaborations",
    category: "Storage",
  },
  paper: {
    description: "Create, update, and export Dropbox Paper documents",
    category: "Productivity",
  },
  granola: {
    description: "List and read Granola meeting notes and folders",
    category: "Productivity",
  },
  alpaca: {
    description: "Trade equities with Alpaca: account, orders, positions, and market clock",
    category: "Finance",
  },
  binance: {
    description: "Read Binance Spot prices, order books, and account data with read-only API keys",
    category: "Finance",
  },
  mercury: {
    description: "Manage Mercury bank accounts, cards, and transactions",
    category: "Finance",
  },
  monday: {
    description: "Manage Monday.com boards, items, columns, and updates",
    category: "Productivity",
  },
  zendesk: {
    description: "Manage Zendesk tickets, users, and help center content",
    category: "Business",
  },
  wix: {
    description: "Manage Wix site stores, products, and e-commerce orders via REST",
    category: "Business",
  },
  astronomer: {
    description: "Manage Apache Airflow DAGs and deployments on Astronomer",
    category: "Engineering",
  },
  auth0: {
    description: "Manage Auth0 users, applications, and tenant configuration",
    category: "Identity & Access",
  },
  betterstack: {
    description: "Monitor uptime, logs, and incident alerts with BetterStack",
    category: "Engineering",
  },
  clerk: {
    description: "Manage Clerk users, organizations, and authentication",
    category: "Identity & Access",
  },
  clickup: {
    description: "Manage ClickUp tasks, lists, spaces, and workspaces",
    category: "Productivity",
  },
  convex: {
    description: "Run Convex functions, manage tables, and query your app backend",
    category: "Engineering",
  },
  datadog: {
    description: "Monitor Datadog metrics, logs, dashboards, and alerts",
    category: "Engineering",
  },
  discord: {
    description: "Send messages and manage Discord channels and servers",
    category: "Communication",
  },
  etoro: {
    description: "Read eToro portfolio data and market instruments",
    category: "Finance",
  },
  ga4: {
    description: "Read Google Analytics reports, properties, and events",
    category: "Analytics",
  },
  gchat: {
    description: "Send messages and manage Google Chat spaces and memberships",
    category: "Communication",
  },
  gitlab: {
    description: "Manage GitLab repositories, issues, and merge requests",
    category: "Engineering",
  },
  linkedin: {
    description: "Post updates and manage LinkedIn profile and company pages",
    category: "Social Media",
  },
  neon: {
    description: "Manage Neon Postgres projects, branches, and databases",
    category: "Infrastructure",
  },
  planetscale: {
    description: "Manage PlanetScale databases, branches, and schema changes",
    category: "Infrastructure",
  },
  salesforce: {
    description: "Manage Salesforce accounts, contacts, opportunities, and cases",
    category: "Business",
  },
  sharepoint: {
    description: "Manage SharePoint sites, lists, documents, and permissions",
    category: "Productivity",
  },
  shopify: {
    description: "Manage Shopify products, orders, customers, and inventory",
    category: "Commerce",
  },
  teams: {
    description: "Send messages and manage Microsoft Teams channels and meetings",
    category: "Communication",
  },
  threads: {
    description: "Post and manage content on Threads (Meta)",
    category: "Social Media",
  },
  tiktok: {
    description: "Manage TikTok videos, account info, and creator analytics",
    category: "Entertainment",
  },
  tldraw: {
    description: "Create and manage tldraw collaborative whiteboards",
    category: "Productivity",
  },
  trello: {
    description: "Manage Trello boards, lists, and cards",
    category: "Productivity",
  },
  typeform: {
    description: "Create and manage Typeform surveys and responses",
    category: "Productivity",
  },
  webflow: {
    description: "Manage Webflow sites, collections, and CMS content",
    category: "Engineering",
  },
  workday: {
    description: "Read Workday HR data including workers, organizations, and pay",
    category: "HR & Recruiting",
  },
  xero: {
    description: "Manage Xero invoices, contacts, and accounting data",
    category: "Accounting",
  },
  zapier: {
    description: "Trigger and manage Zapier automation workflows",
    category: "Productivity",
  },
};

export type IntegrationLibraryPresentation = {
  description?: string;
  category?: string;
};

/**
 * Resolves library marketing description and category for an integration row.
 * Explicit `description` / `category` on the integration object win over the catalog.
 */
export function integrationLibraryPresentationFields(
  integration: Record<string, unknown>
): IntegrationLibraryPresentation {
  const id =
    typeof integration["id"] === "string"
      ? integration["id"]
      : String(integration["id"] ?? "");
  const fromCatalog = id ? INTEGRATION_LIBRARY_METADATA[id] : undefined;
  const explicitDescription = integration["description"];
  const explicitCategory = integration["category"];

  const description =
    typeof explicitDescription === "string" && explicitDescription.trim().length > 0
      ? explicitDescription.trim()
      : fromCatalog?.description;

  const category =
    typeof explicitCategory === "string" && explicitCategory.trim().length > 0
      ? explicitCategory.trim()
      : fromCatalog?.category;

  const out: IntegrationLibraryPresentation = {};
  if (description) out.description = description;
  if (category) out.category = category;
  return out;
}
