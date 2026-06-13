/**
 * Documentation metadata for integration pages (developer portals, auth setup).
 * Used by the docs generator at build time.
 */

export type IntegrationAuthMode = "oauth" | "apiKey" | "none";

export type IntegrationDocsMetadata = {
  /** Link to the provider's developer portal or OAuth app console */
  developerPortal?: { label: string; url: string };
  /** Override inferred authentication mode */
  authMode?: IntegrationAuthMode;
  /** Extra markdown appended after default setup steps */
  setupNotes?: string;
  /** Replace default OAuth setup steps */
  setupSteps?: Array<{ label: string; url?: string }>;
};

const GOOGLE_CLOUD_PORTAL = {
  label: "Google Cloud Console",
  url: "https://console.cloud.google.com",
} as const;

const AZURE_APP_REGISTRATIONS = {
  label: "Azure Portal — App Registrations",
  url: "https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps",
} as const;

const ZOHO_API_CONSOLE = {
  label: "Zoho API Console",
  url: "https://api-console.zoho.com",
} as const;

const GOOGLE_INTEGRATION_IDS = new Set([
  "gcal",
  "gchat",
  "gcontacts",
  "gdocs",
  "gdrive",
  "gmail",
  "gmeet",
  "google_ads",
  "google_classroom",
  "google_forms",
  "google_home",
  "google_play_console",
  "gsheets",
  "gslides",
  "gtasks",
  "ga4",
  "youtube",
]);

const MICROSOFT_INTEGRATION_IDS = new Set([
  "excel",
  "microsoft_bookings",
  "microsoft_entra_id",
  "microsoft_graph_education",
  "microsoft_to_do",
  "microsoft_ads",
  "onedrive",
  "onenote",
  "outlook",
  "planner",
  "powerpoint",
  "sharepoint",
  "teams",
  "word",
]);

/**
 * Explicit overrides and migrated developer portal links.
 * Add an entry when adding a new OAuth integration.
 */
export const INTEGRATION_DOCS_METADATA: Record<string, IntegrationDocsMetadata> = {
  airtable: {
    authMode: "oauth",
    developerPortal: {
      label: "Airtable Developer Hub",
      url: "https://airtable.com/create/oauth",
    },
  },
  calcom: {
    authMode: "oauth",
    developerPortal: {
      label: "Cal.com Platform Settings",
      url: "https://app.cal.com/settings/developer",
    },
  },
  discord: {
    authMode: "oauth",
    developerPortal: {
      label: "Discord Developer Portal",
      url: "https://discord.com/developers/applications",
    },
  },
  excel: {
    authMode: "oauth",
    developerPortal: AZURE_APP_REGISTRATIONS,
  },
  figma: {
    authMode: "oauth",
    developerPortal: {
      label: "Figma for Developers",
      url: "https://www.figma.com/developers/apps",
    },
  },
  gcal: {
    authMode: "oauth",
    developerPortal: GOOGLE_CLOUD_PORTAL,
  },
  gdocs: {
    authMode: "oauth",
    developerPortal: GOOGLE_CLOUD_PORTAL,
  },
  gdrive: {
    authMode: "oauth",
    developerPortal: GOOGLE_CLOUD_PORTAL,
  },
  github: {
    authMode: "oauth",
    developerPortal: {
      label: "GitHub Developer Settings",
      url: "https://github.com/settings/developers",
    },
  },
  gmail: {
    authMode: "oauth",
    developerPortal: GOOGLE_CLOUD_PORTAL,
  },
  gsheets: {
    authMode: "oauth",
    developerPortal: GOOGLE_CLOUD_PORTAL,
  },
  gslides: {
    authMode: "oauth",
    developerPortal: GOOGLE_CLOUD_PORTAL,
  },
  hubspot: {
    authMode: "oauth",
    developerPortal: {
      label: "HubSpot Developer Apps",
      url: "https://app.hubspot.com/developers",
    },
  },
  intercom: {
    authMode: "oauth",
    developerPortal: {
      label: "Intercom Developer Hub",
      url: "https://developers.intercom.com/",
    },
  },
  linear: {
    authMode: "oauth",
    developerPortal: {
      label: "Linear Settings",
      url: "https://linear.app/settings/api",
    },
  },
  notion: {
    authMode: "oauth",
    developerPortal: {
      label: "Notion Integrations",
      url: "https://www.notion.so/my-integrations",
    },
  },
  onedrive: {
    authMode: "oauth",
    developerPortal: AZURE_APP_REGISTRATIONS,
  },
  outlook: {
    authMode: "oauth",
    developerPortal: AZURE_APP_REGISTRATIONS,
  },
  polar: {
    authMode: "oauth",
    developerPortal: {
      label: "Polar Settings",
      url: "https://polar.sh/settings",
    },
  },
  powerpoint: {
    authMode: "oauth",
    developerPortal: AZURE_APP_REGISTRATIONS,
  },
  ramp: {
    authMode: "oauth",
    developerPortal: {
      label: "Ramp Developer Portal",
      url: "https://app.ramp.com/developer",
    },
  },
  slack: {
    authMode: "oauth",
    developerPortal: {
      label: "Slack API Apps",
      url: "https://api.slack.com/apps",
    },
  },
  stripe: {
    authMode: "oauth",
    developerPortal: {
      label: "Stripe Connect Settings",
      url: "https://dashboard.stripe.com/settings/applications",
    },
  },
  todoist: {
    authMode: "oauth",
    developerPortal: {
      label: "Todoist App Console",
      url: "https://developer.todoist.com/appconsole.html",
    },
  },
  vercel: {
    authMode: "oauth",
    developerPortal: {
      label: "Vercel Integrations",
      url: "https://vercel.com/dashboard/integrations",
    },
  },
  whatsapp: {
    authMode: "oauth",
    developerPortal: {
      label: "Meta for Developers",
      url: "https://developers.facebook.com",
    },
  },
  word: {
    authMode: "oauth",
    developerPortal: AZURE_APP_REGISTRATIONS,
  },
  youtube: {
    authMode: "oauth",
    developerPortal: GOOGLE_CLOUD_PORTAL,
  },
};

function inferDeveloperPortal(id: string): { label: string; url: string } | undefined {
  if (GOOGLE_INTEGRATION_IDS.has(id)) {
    return GOOGLE_CLOUD_PORTAL;
  }
  if (MICROSOFT_INTEGRATION_IDS.has(id)) {
    return AZURE_APP_REGISTRATIONS;
  }
  if (id.startsWith("zoho_")) {
    return ZOHO_API_CONSOLE;
  }
  return undefined;
}

function labelFromHostname(hostname: string): string {
  const host = hostname.replace(/^www\./, "");
  const base = host.split(".")[0] ?? host;
  const words = base.split(/[-_]/).filter(Boolean);
  const title = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  if (host.includes("developer") || host.startsWith("developers.")) {
    return `${title} Developer Hub`;
  }
  return `${title} Developer Portal`;
}

/**
 * Derive a developer portal link from an OAuth authorization endpoint URL.
 */
export function developerPortalFromAuthEndpoint(
  authorizationEndpoint?: string,
): { label: string; url: string } | undefined {
  if (!authorizationEndpoint) return undefined;
  try {
    const url = new URL(authorizationEndpoint);
    return {
      label: labelFromHostname(url.hostname),
      url: `${url.protocol}//${url.hostname}`,
    };
  } catch {
    return undefined;
  }
}

export function resolveIntegrationDocsMetadata(
  id: string,
  options: {
    inferredAuthMode: IntegrationAuthMode;
    authorizationEndpoint?: string;
  },
): IntegrationDocsMetadata & { authMode: IntegrationAuthMode } {
  const explicit = INTEGRATION_DOCS_METADATA[id] ?? {};
  const developerPortal =
    explicit.developerPortal ??
    inferDeveloperPortal(id) ??
    (options.inferredAuthMode === "oauth"
      ? developerPortalFromAuthEndpoint(options.authorizationEndpoint)
      : undefined);

  return {
    ...explicit,
    authMode: explicit.authMode ?? options.inferredAuthMode,
    developerPortal,
  };
}
