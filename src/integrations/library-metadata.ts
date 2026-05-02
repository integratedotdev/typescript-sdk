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
  calcom: {
    description: "Manage Cal.com bookings and schedules",
    category: "Business",
  },
  cursor: {
    description: "Manage Cursor Cloud Agents and background tasks",
    category: "Engineering",
  },
  figma: {
    description: "Access Figma files, comments, and components",
    category: "Engineering",
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
  hubspot: {
    description: "Manage HubSpot contacts, deals, and tickets",
    category: "Business",
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
  outlook: {
    description: "Manage Outlook mail, calendars, and contacts",
    category: "Communication",
  },
  polar: {
    description: "Manage Polar products, orders, and subscriptions",
    category: "Finance",
  },
  posthog: {
    description: "Read PostHog organizations, projects, insights, and feature flags",
    category: "Analytics",
  },
  ramp: {
    description: "Manage Ramp corporate cards, bills, and spend",
    category: "Business",
  },
  railway: {
    description: "Manage Railway workspaces, projects, services, deployments, variables, domains, and volumes",
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
  whatsapp: {
    description: "Send WhatsApp messages and templates",
    category: "Communication",
  },
  youtube: {
    description: "Search and access YouTube videos and channels",
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
  granola: {
    description: "List and read Granola meeting notes and folders",
    category: "Productivity",
  },
  mercury: {
    description: "Manage Mercury bank accounts, cards, and transactions",
    category: "Finance",
  },
  zendesk: {
    description: "Manage Zendesk tickets, users, and help center content",
    category: "Business",
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
