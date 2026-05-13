/**
 * Default library copy and categories for known integrations.
 * Hosts can override per integration via `description` / `category` on {@link MCPIntegration}.
 */

export type IntegrationCategory =
  | "Analytics"
  | "Business"
  | "Finance"
  | "Productivity"
  | "Communication"
  | "Engineering"
  | "Infrastructure"
  | "Storage"
  | "Social Media"
  | "Other";

type LibraryEntry = {
  description: string;
  category: IntegrationCategory;
};

/** Display order for library section headers (categories not listed sort before "Other"). */
export const INTEGRATION_CATEGORY_ORDER: readonly IntegrationCategory[] = [
  "Analytics",
  "Productivity",
  "Business",
  "Finance",
  "Communication",
  "Engineering",
  "Infrastructure",
  "Storage",
  "Social Media",
  "Other",
] as const;

/**
 * Canonical one-line descriptions and categories for integrate-sdk integrations.
 */
export const INTEGRATION_LIBRARY_METADATA: Record<string, LibraryEntry> = {
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
  calcom: {
    description: "Manage Cal.com bookings and schedules",
    category: "Business",
  },
  canva: {
    description: "List and create Canva designs, manage folders, and export assets",
    category: "Productivity",
  },
  cloudflare: {
    description: "Manage Cloudflare zones, DNS, CDN cache, and Workers",
    category: "Infrastructure",
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
    description: "Manage Ramp corporate cards, bills, and spend",
    category: "Business",
  },
  resend: {
    description: "Send email and manage domains with the Resend API",
    category: "Communication",
  },
  mailchimp: {
    description: "Manage Mailchimp audiences, members, and campaigns",
    category: "Communication",
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
    category: "Infrastructure",
  },
  whatsapp: {
    description: "Send WhatsApp messages and templates",
    category: "Communication",
  },
  youtube: {
    description: "Search and access YouTube videos and channels",
    category: "Social Media",
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
    category: "Infrastructure",
  },
  betterstack: {
    description: "Monitor uptime, logs, and incident alerts with BetterStack",
    category: "Engineering",
  },
  clerk: {
    description: "Manage Clerk users, organizations, and authentication",
    category: "Infrastructure",
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
    category: "Business",
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
    category: "Social Media",
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
    category: "Business",
  },
  webflow: {
    description: "Manage Webflow sites, collections, and CMS content",
    category: "Engineering",
  },
  workday: {
    description: "Read Workday HR data including workers, organizations, and pay",
    category: "Business",
  },
  xero: {
    description: "Manage Xero invoices, contacts, and accounting data",
    category: "Finance",
  },
  zapier: {
    description: "Trigger and manage Zapier automation workflows",
    category: "Engineering",
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
